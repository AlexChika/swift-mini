import { REDIS_KEYS } from "@lib/utils/constants";
import { redis } from "./redis";

export async function redisAddUserSocket(userId: string, socketId: string) {
  const prefix = REDIS_KEYS.userSockets;
  const key = `${prefix}${userId}`;
  const maxRetries = 3;
  let attempt = 0;
  let lastError: unknown = null;

  while (attempt < maxRetries) {
    try {
      await redis.sAdd(key, socketId);
      await redis.expire(key, 86400);
      return;
    } catch (error) {
      lastError = error;
      attempt++;

      await new Promise((res) => setTimeout(res, 500 * attempt));
    }
  }
  console.error("error adding user socket to redis after retries:", lastError);
}

export async function redisRemoveUserSocket(userId: string, socketId: string) {
  const prefix = REDIS_KEYS.userSockets;
  const key = `${prefix}${userId}`;

  try {
    await redis.sRem(key, socketId);
  } catch (_) {
    //
  }
}

export async function redisGetUserSockets(userId: string) {
  const prefix = REDIS_KEYS.userSockets;
  const key = `${prefix}${userId}`;
  const maxRetries = 3;
  let attempt = 0;
  let lastError: unknown = null;
  while (attempt < maxRetries) {
    try {
      return await redis.sMembers(key);
    } catch (error) {
      lastError = error;
      attempt++;
      await new Promise((res) => setTimeout(res, 500 * attempt));
    }
  }
  console.error(
    "error getting user sockets from redis after retries:",
    lastError
  );
  return [];
}
