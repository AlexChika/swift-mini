/* eslint-disable @typescript-eslint/no-explicit-any */
import { Job, Worker } from "bullmq";
import { getIO } from "@src/sockets/socket";
import { queueConfig } from "../queues.config";
import { SOCKET_EVENTS } from "@lib/utils/constants";
import { redisGetUserSocketsWithRetry } from "@src/redis/user.redis";
import { redisSetChatMembersWithRetry } from "@src/redis/chat.redis";
import { getChatCreated } from "@src/graphql/services/chat.service";

export async function jobChatCreated(data: Swift.DuoChatCreatedJob) {
  const { chatId, members } = data;
  const { userId, otherUserId } = members;
  const io = getIO();

  const memberIds = [userId, otherUserId];

  await redisSetChatMembersWithRetry(chatId, memberIds);
  const chat = await getChatCreated(chatId);

  for (const memberId of memberIds) {
    const memberSockets = await redisGetUserSocketsWithRetry(memberId);

    memberSockets.forEach((sid) => {
      io.to(sid).emit(SOCKET_EVENTS.CHAT_CREATED, { data: chat });
    });
  }
}

export async function jobGroupChatCreated(data: Swift.GroupChatCreatedJob) {
  const { chatId, memberIds } = data;
  const io = getIO();

  await redisSetChatMembersWithRetry(chatId, memberIds);
  const chat = await getChatCreated(chatId);

  for (const memberId of memberIds) {
    const memberSockets = await redisGetUserSocketsWithRetry(memberId);

    memberSockets.forEach((sid) => {
      io.to(sid).emit(SOCKET_EVENTS.CHAT_CREATED, { data: chat });
    });
  }
}

type ChatJob = Swift.ChatJob;
export function registerChatWorker() {
  const worker = new Worker<ChatJob["data"], any, ChatJob["name"]>(
    "chats",
    async (job: Job<ChatJob["data"], any, ChatJob["name"]>) => {
      // /* ---------------- duo chat created --------------- */
      if (job.name === "duoChatCreated") {
        await jobChatCreated(job.data as Swift.DuoChatCreatedJob);
      }

      // /* --------------- group chat created -------------- */
      else if (job.name === "groupChatCreated") {
        await jobGroupChatCreated(job.data as Swift.GroupChatCreatedJob);
      }

      // ....
      else if (job.name === "test") {
        console.log("Test job data:", job.data);
      }
    },
    queueConfig.redis
  );

  worker.on("failed", (job, err) =>
    console.error(`❌ Job ${job?.name} failed:`, err)
  );
}
