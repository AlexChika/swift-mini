import { Queue } from "bullmq";
import { queueConfig } from "../queues.config";

export const messageQueue = new Queue("messages", queueConfig.redis);

/**
 * enques messages to be created from socket on Create chat event
 */
export async function enqueueCreateMessage(payload: Swift.CreateMessageJob) {
  await messageQueue.add("createMessage", payload, {
    ...queueConfig.opts,
    attempts: queueConfig.maxAttempts
  });
}

export async function enqueueMessageCreatedAck(
  payload: Swift.MessageCreatedAckJob
) {
  await messageQueue.add("messageCreatedAck", payload, queueConfig.opts);
}

export async function enqueueMessageFailedAck(
  payload: Swift.MessageFailedAckJob
) {
  await messageQueue.add("messageFailedAck", payload, queueConfig.opts);
}

export async function enqueueCreateMessageDuplicate(
  payload: Swift.CreateMessageJob & {
    messageIds: {
      cmid: string;
      smid: string;
    };
  }
) {
  await messageQueue.add("createMessageDuplicate", payload, {
    ...queueConfig.opts,
    attempts: 1
  });
}

export async function enqueueMessageStatusAck(payload: string) {
  await messageQueue.add("messageStatusAck", payload, queueConfig.opts);
}
