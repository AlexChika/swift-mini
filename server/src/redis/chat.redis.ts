import { redis } from "./redis";
import { withRetry } from "@lib/utils";
import { REDIS_KEYS } from "@lib/utils/constants";

export async function redisSetChatMembers(
  chatId: string,
  members: string[] | string
) {
  const prefix = REDIS_KEYS.chatMembers;
  const key = `${prefix}${chatId}`;
  const result = await redis
    .multi()
    .sAdd(key, members)
    .expire(key, 60 * 60 * 24 * 7)
    .execAsPipeline();
  return result[0]; // numbers of member ids added
}

export async function redisGetChatMembers(chatId: string) {
  const prefix = REDIS_KEYS.chatMembers;
  const key = `${prefix}${chatId}`;

  return await redis.sMembers(key);
}

export async function redisRemoveChatMember(chatId: string, memberId: string) {
  const prefix = REDIS_KEYS.chatMembers;
  const key = `${prefix}${chatId}`;
  return await redis.sRem(key, memberId);
}

export const redisSetChatMembersWithRetry = withRetry(redisSetChatMembers, {
  onRetry: (err: Error, attempt) => {
    console.error(
      `Error on Redis set chat members. Attempt: ${attempt}. Error: ${err.message || err}`
    );
  }
});
