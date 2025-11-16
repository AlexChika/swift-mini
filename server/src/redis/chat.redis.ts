import { redis } from "./redis";
import { REDIS_KEYS } from "@lib/utils/constants";

export async function redisSetChatMembers(chatId: string, members: string[]) {
  const prefix = REDIS_KEYS.chatMembers;
  const key = `${prefix}${chatId}`;

  const maxRetries = 3;
  let attempt = 0;
  let lastError: unknown = null;
  while (attempt < maxRetries) {
    try {
      return await redis.sAdd(key, members);
    } catch (error) {
      lastError = error;
      attempt++;
      await new Promise((res) => setTimeout(res, 500 * attempt));
    }
  }
  console.error(
    "error setting chat members in redis after retries:",
    lastError
  );
  return 0;
}

export async function redisGetChatMembers(chatId: string) {
  const key = `chat:members:${chatId}`;

  try {
    return await redis.sMembers(key);
  } catch (error) {
    return [];
  }
}

export async function redisRemoveChatMember(chatId: string, memberId: string) {
  const key = `chat:members:${chatId}`;
  return await redis.sRem(key, memberId);
}

export async function redisAddChatMember(chatId: string, memberId: string) {
  const key = `chat:members:${chatId}`;
  return await redis.sAdd(key, memberId);
}
