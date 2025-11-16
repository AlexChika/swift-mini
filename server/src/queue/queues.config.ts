import { REDIS_URL } from "@lib/utils/constants";

export const queueConfig = {
  redis: {
    connection: {
      url: REDIS_URL
    }
  },
  opts: {
    attempts: 3,
    backoff: { type: "exponential", delay: 3000 },
    removeOnComplete: true,
    removeOnFail: true
  }
};
