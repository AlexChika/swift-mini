import { REDIS_URL } from "@lib/utils/constants";
import { createClient } from "redis";

const redis = createClient({
  url: REDIS_URL
});

redis.on("connect", () => console.log("✅ Redis connected"));
redis.on("error", (err) => console.error("❌ Redis error", err));
redis.on("reconnecting", () => console.warn("⚠️ Redis reconnecting..."));

export async function connectRedis() {
  if (!redis.isOpen) await redis.connect();
  return redis;
}

export { redis };
