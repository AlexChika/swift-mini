import { REDIS_URL } from "@lib/utils/constants";
import { createClient } from "redis";

const redis = createClient({
  url: REDIS_URL
});

redis.on("connect", () => console.log("[Redis]: Redis connected ✅"));
redis.on("ready", () => console.log("[Redis]: Redis ready for commands ✅"));
redis.on("error", (err) => console.error("[Redis]: Redis error ❌", err));
redis.on("reconnecting", () =>
  console.warn("[Redis]: Redis reconnecting... ⚠️")
);
redis.on("end", () => console.log("[Redis]: Redis connection closed 🛑"));

export async function connectRedis() {
  if (!redis.isOpen) await redis.connect();
  return redis;
}

 // @typescript-eslint/no-explicit-any
function shouldRetry(err: any) {
  // Return false to skip retrying semantic/syntax errors
  if (err.name === "ReplyError" || err.message?.includes("WRONGTYPE")) {
    return false;
  }
  // Return true to retry network/connection errors
  return true;
}
export { redis, shouldRetry };
