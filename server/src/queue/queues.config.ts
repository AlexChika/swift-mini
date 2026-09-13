import { REDIS_URL } from "@lib/utils/constants";

export const queueConfig = {
  redis: {
    connection: {
      url: REDIS_URL
    },
    // 1. Check for stalled jobs every 10 minutes (instead of every 30 seconds)
    stalledInterval: 600000,
    // 2. Wait 30 seconds before polling an empty queue again
    drainDelay: 30000
  },
  opts: {
    attempts: 3,
    backoff: { type: "exponential", delay: 3000 },
    removeOnComplete: true,
    removeOnFail: true
  },

  maxAttempts: 6,
  baseAttempts: 3
} as const;
