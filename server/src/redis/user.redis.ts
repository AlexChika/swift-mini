import { redis } from "./redis";
import { withRetry } from "@lib/utils";
import { REDIS_KEYS } from "@lib/utils/constants";

export async function redisAddUserSocket(userId: string, socketId: string) {
  const prefix = REDIS_KEYS.userSockets;
  const key = `${prefix}${userId}`;
  await redis.sAdd(key, socketId);
  await redis.expire(key, 86400);
}

export async function redisGetUserSockets(userId: string) {
  const prefix = REDIS_KEYS.userSockets;
  const key = `${prefix}${userId}`;
  return await redis.sMembers(key);
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

export const redisGetUserSocketsWithRetry = withRetry(redisGetUserSockets, {
  onRetry: (err: Error, attempt) => {
    console.error(
      `Error on Redis getUserSockets. Attempt: ${attempt}. Error: ${err.message || err}`
    );
  }
});

export const redisAddUserSocketWithRetry = withRetry(redisAddUserSocket, {
  onRetry: (err: Error, attempt) => {
    console.error(
      `Error on Redis addUserSocket. Attempt: ${attempt}. Error: ${err.message || err}`
    );
  }
});

export async function redisSetUserSessions(
  sessionToken: string,
  session: Session
) {
  const prefix = REDIS_KEYS.userSessions;
  const key = `${prefix}${sessionToken}`;

  await redis.set(key, JSON.stringify(session), {
    expiration: {
      type: "EX",
      value: 60 * 30 // 30 minutes
    }
  });
}

export async function redisGetUserSessions(sessionToken: string) {
  const prefix = REDIS_KEYS.userSessions;
  const key = `${prefix}${sessionToken}`;
  const res = await redis.get(key);

  if (!res) return null;
  return JSON.parse(res) as Session;
}

export async function redisDeleteUserSessions(sessionToken: string) {
  const prefix = REDIS_KEYS.userSessions;
  const key = `${prefix}${sessionToken}`;
  await redis.del(key);
}
