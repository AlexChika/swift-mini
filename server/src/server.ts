import cors from "cors";
import morgan from "morgan";
import express from "express";
import mongoose from "mongoose";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import { initQueue } from "./queue/queue";
import { connectDB, keepAliveJob } from "@lib";
import { initApolloServer } from "@lib/apollo";
import { corsOpts } from "@lib/utils/constants";
import { initSocketServer } from "./sockets/socket";
import { connectRedis, redis } from "@src/redis/redis";
import imagesRouter from "@src/routes/images/images.route";
import { getMessage } from "./graphql/services/message.service";

// http server
const app = express();
const httpServer = createServer(app);

app.set("trust proxy", 1);
app.use(morgan("combined"));
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

app.use(
  (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(`[Express]: ${req.method} ${req.url}`);
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
  }
);

async function start() {
  const PORT = process.env.PORT || 4000;

  await connectDB();
  await connectRedis();

  const pub = redis.duplicate();
  const sub = redis.duplicate();
  pub.on("error", (e) => console.error("[Redis]: Pub error:", e));
  sub.on("error", (e) => console.error("[Redis]: Sub error:", e));
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
        console.log("[MongoDB]: Db connection closed");

        await Promise.all([redis.quit(), pub.quit(), sub.quit()]);
        console.log("[Redis]: connections closed");
      } catch (err) {
        console.error("Error closing MongoDB connection:", err);
      }

      process.exit(0);
    });
  }

  process.on("SIGTERM", () => SwiftShutdown("SIGTERM"));
  process.on("SIGINT", () => SwiftShutdown("SIGINT"));
  process.on("unhandledRejection", (reason, p) => {
    console.error("[FATAL]: Unhandled Rejection at:", p, "reason:", reason);
    process.exit(1);
  });
  process.on("uncaughtException", (err) => {
    console.error("[FATAL]: Uncaught Exception:", err);
    process.exit(1);
  });
} catch (err) {
  console.error("Server failed to start:", err);
  process.exit(1);
}
