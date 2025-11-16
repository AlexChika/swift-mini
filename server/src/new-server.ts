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
import { enqueueChatCreated } from "./queue/queues/chat.queues";
import { getChatMembers } from "./graphql/services/chat.service";
import { redisGetChatMembers } from "./redis/chat.redis";

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
  const { userId, chatId, otherUserId } = req.query;
  if (typeof userId !== "string") return res.send("UserID missing");
  if (typeof chatId !== "string") return res.send("ChatID missing");
  if (typeof otherUserId !== "string") return res.send("ChatID missing");

  // const ids = await redisGetChatMembers(chatId);
  // const ids2 = await getChatMembers(chatId);
  // console.log({ ids, ids2 });

  enqueueChatCreated(chatId, { userId, otherUserId });

  res.send("We Good" + " " + userId);
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

// http://localhost:4000/test?userId=68a6ddda719e71ea932488f8&chatId=69150dc75b56b999d0293fd4&otherUserId=68a6e3097eeafbc9d57b30e7
