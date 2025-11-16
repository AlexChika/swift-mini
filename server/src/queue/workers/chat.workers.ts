/* eslint-disable @typescript-eslint/no-explicit-any */
import { Swift } from "swift-mini";
import { Job, Worker } from "bullmq";
import { getIO } from "@src/sockets/socket";
import { queueConfig } from "../queues.config";
import { SOCKET_EVENTS } from "@lib/utils/constants";
import { redisGetUserSockets } from "@src/redis/user.redis";
import { redisSetChatMembers } from "@src/redis/chat.redis";
import { getChatCreated } from "@src/graphql/services/chat.service";

export async function jobChatCreated(data: Swift.DuoChatCreatedJob) {
  const { chatId, members } = data;
  const { userId, otherUserId } = members;
  const io = getIO();

  try {
    const thisUserSockets = await redisGetUserSockets(userId);
    const otherUserSockets = await redisGetUserSockets(otherUserId);

    const chat = await getChatCreated(chatId, userId);

    [...thisUserSockets, ...otherUserSockets].forEach((sid) => {
      io.to(sid).emit(SOCKET_EVENTS.CHAT_CREATED, { data: chat });
    });
  } catch (error) {
    console.log("error @ jobChatCreated", error);
  }
}

export async function jobGroupChatCreated(data: Swift.GroupChatCreatedJob) {
  const { chatId, memberIds } = data;
  const io = getIO();

  try {
    await redisSetChatMembers(chatId, memberIds);
    const chat = await getChatCreated(chatId, "");

    for (const memberId of memberIds) {
      const memberSockets = await redisGetUserSockets(memberId);

      memberSockets.forEach((sid) => {
        io.to(sid).emit(SOCKET_EVENTS.CHAT_CREATED, { data: chat });
      });
    }
  } catch (error) {
    console.log("error @ jobGroupChatCreated", error);
  }
}

type ChatJob = Swift.ChatJob;
export function registerChatWorker() {
  const worker = new Worker<ChatJob["data"], any, ChatJob["name"]>(
    "chats",
    async (job: Job<ChatJob["data"], any, ChatJob["name"]>) => {
      if (job.name === "duoChatCreated") {
        await jobChatCreated(job.data as Swift.DuoChatCreatedJob);
      } else if (job.name === "groupChatCreated") {
        await jobGroupChatCreated(job.data as Swift.GroupChatCreatedJob);
      } else if (job.name === "test") {
        console.log("Test job data:", job.data);
      }
    },
    queueConfig.redis
  );

  worker.on("completed", (job) =>
    console.log(`✅ Job ${job.name} (${job.id}) completed`)
  );
  worker.on("failed", (job, err) =>
    console.error(`❌ Job ${job?.name} failed:`, err)
  );
}
