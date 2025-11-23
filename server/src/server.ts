import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import { initQueue } from "./queue/queue";
import { connectDB, keepAliveJob } from "lib";
import { initApolloServer } from "@lib/apollo";
import { corsOpts } from "@lib/utils/constants";
import { initSocketServer } from "./sockets/socket";
import { connectRedis, redis } from "src/redis/redis";
import imagesRouter from "src/routes/images/images.route";
import { getMessage } from "./graphql/services/message.service";

// configs
dotenv.config();

// http server
const app = express();
const httpServer = createServer(app);

app.use(cors<cors.CorsRequest>(corsOpts));
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

// routes
await initApolloServer(app, httpServer);

app.use("/images", imagesRouter);

app.get("/time", (_, res) => {
  res.json({ serverNow: Date.now() });
});

app.get("/health", (_, res) => {
  res.send("OK");
});

app.get("/test", async (req, res) => {
  // const { sessionToken } = req.query;
  // if (typeof sessionToken !== "string") return res.send("sessionToken missing");

  const msg = await getMessage("69220b45ab318d02c7e65446");

  console.log({ msg });
  console.log(msg?.id);

  res.send("We Good" + " ");
});

async function start() {
  const PORT = process.env.PORT || 4000;

  await connectDB();
  await connectRedis();

  const pub = redis.duplicate();
  const sub = redis.duplicate();
  await Promise.all([pub.connect(), sub.connect()]);

  initSocketServer(httpServer, pub, sub);
  initQueue();
  type RedisClient = typeof redis;

  return new Promise<{ pub: RedisClient; sub: RedisClient }>((res) =>
    httpServer.listen(PORT, () => {
      if (process.env.NODE_ENV === "production") keepAliveJob.start();
      res({ pub, sub });
    })
  );
}

try {
  const { pub, sub } = await start();
  const addr = httpServer.address();
  console.log(`Server running on ${JSON.stringify(addr)}`);

  async function SwiftShutdown(signal: string) {
    console.log(`${signal} received. Shutting down...`);

    httpServer.close(async () => {
      console.log("HTTP server closed.");

      try {
        await mongoose.connection.close();
        console.log("MongoDB connection closed");

        await Promise.all([redis.quit(), pub.quit(), sub.quit()]);
        console.log("Redis connections closed");
      } catch (err) {
        console.error("Error closing MongoDB connection:", err);
      }

      process.exit(0);
    });
  }

  process.on("SIGTERM", () => SwiftShutdown("SIGTERM"));
  process.on("SIGINT", () => SwiftShutdown("SIGINT"));
  process.on("unhandledRejection", (reason, p) => {
    console.error("Unhandled Rejection at:", p, "reason:", reason);
  });
} catch (err) {
  console.error("Server failed to start:", err);
  process.exit(1);
}

// http://localhost:4000/test?sessionToken=70ba7462-a5df-4e60-adfb-455d8956ac47
