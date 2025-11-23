import { redis } from "./redis";
import { withRetry } from "@lib/utils";
import { REDIS_KEYS } from "@lib/utils/constants";

/**
 *
 * @param cmid client message id - a temp client generated id
 */
export async function redisGetMessageIdemKeys(cmid: string) {
  const key = `${REDIS_KEYS.messageIdempotency}${cmid}`;
  const res = await redis.get(key);
  if (res !== null) {
    const keys = res.split(`cmidsmid`);
    return {
      cmid: keys[0],
      smid: keys[1]
    };
  }
  return null;
}

/**
 *
 * @param cmid client message id - a temp client generated id
 * @param smid sever message id - a perm server generated id
 * @returns `boolean`
 */
export async function redisSetMessageIdemKeys(cmid: string, smid: string) {
  const key = `${REDIS_KEYS.messageIdempotency}${cmid}`;
  const value = `${cmid}cmidsmid${smid}`;
  await redis.set(key, value, {
    expiration: {
      type: "EX",
      value: 60 * 60 * 24 * 1
    }
  });
  return true;
}

export async function redisDeleteMessageIdemKeys(cmid: string) {
  const key = `${REDIS_KEYS.messageIdempotency}${cmid}`;
  await redis.del(key);
  return true;
}

export const redisGetMessageIdemKeysWithRetry = withRetry(
  redisGetMessageIdemKeys,
  {
    onRetry: (err: Error, attempt) => {
      console.error(
        `Error on set message idempotency keys. Attempt: ${attempt}. Error: ${err.message || err}`
      );
    }
  }
);

export const redisSetMessageIdemKeysWithRetry = withRetry(
  redisSetMessageIdemKeys,
  {
    onRetry: (err: Error, attempt) => {
      console.error(
        `Error on set message idempotency keys. Attempt: ${attempt}. Error: ${err.message || err}`
      );
    }
  }
);
