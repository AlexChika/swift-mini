import { Queue } from "bullmq";
import { queueConfig } from "../queues.config";

export const chatQueue = new Queue("chats", queueConfig.redis);

chatQueue.on("error", (err) => {
  console.error("[Queue]: Chat Que error :", err);
});

export async function enqueueChatCreated(
  chatId: string,
  members: {
    userId: string;
    otherUserId: string;
  }
) {
  await chatQueue.add("duoChatCreated", { chatId, members }, queueConfig.opts);
}

export async function enqueueGroupCreated(chatId: string, memberIds: string[]) {
  await chatQueue.add(
    "groupChatCreated",
    { chatId, memberIds },
    queueConfig.opts
  );
}
