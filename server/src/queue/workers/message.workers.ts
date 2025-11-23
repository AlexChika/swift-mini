/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { Job, Worker } from "bullmq";
import { getIO } from "@src/sockets/socket";
import { queueConfig } from "../queues.config";
import { getMemberIds } from "@src/graphql/services/chat.service";
import { redisGetUserSocketsWithRetry } from "@src/redis/user.redis";

import {
  createMessage,
  getMessage
} from "@src/graphql/services/message.service";

import {
  redisDeleteMessageIdemKeys,
  redisGetMessageIdemKeysWithRetry,
  redisSetMessageIdemKeysWithRetry
} from "@src/redis/message.redis";

import {
  enqueueCreateMessageDuplicate,
  enqueueMessageCreatedAck,
  enqueueMessageFailedAck
} from "../queues/message.queues";
import { SOCKET_EVENTS } from "@lib/utils/constants";

export async function jobCreateMessage(data: Swift.CreateMessageJob) {
  const chatId = data.message.chatId;
  const { message: initMessage, tempId } = data;

  const messageIds = await redisGetMessageIdemKeysWithRetry(data.tempId);
  if (messageIds) {
    // this message has been processed
    enqueueCreateMessageDuplicate({
      ...data,
      messageIds
    });

    return;
  }

  const msession = await mongoose.startSession();
  msession.startTransaction();

  try {
    const res = await createMessage(data, msession);
    if (!res.success) {
      await msession.abortTransaction();
      await msession.endSession();
      await enqueueMessageFailedAck({
        ...res,
        chatId,
        tempId,
        errType: "client",
        message: initMessage
      });
      return;
    }

    await redisSetMessageIdemKeysWithRetry(data.tempId, res.message.id);

    // add sender to created message
    const message = { ...res.message, sender: data.message.sender };
    await enqueueMessageCreatedAck({
      ...res,
      message,
      tempId,
      chatId
    });

    await msession.commitTransaction();
    await msession.endSession();
    return;
  } catch (error) {
    await redisDeleteMessageIdemKeys(data.tempId);
    await msession.abortTransaction();
    await msession.endSession();
    throw error; // Re-throw the error after handling the transaction
  }
}

async function jobCreateMessageDuplicate(
  data: Swift.CreateMessageDuplicateJob
) {
  const existingMessage = await getMessage(data.messageIds.smid);

  if (!existingMessage) {
    await enqueueMessageFailedAck({
      success: false,
      tempId: data.tempId,
      chatId: data.message.chatId,
      message: data.message,
      errType: "server",
      msg: "Message not found"
    });
    return;
  }

  const message = {
    ...existingMessage,
    sender: data.message.sender
  };

  await enqueueMessageCreatedAck({
    message,
    success: true,
    msg: "success",
    tempId: data.tempId,
    chatId: data.message.chatId
  });
}

async function jobMessageCreatedAck(data: Swift.MessageCreatedAckJob) {
  const io = getIO();
  const { chatId } = data;
  const memberIds = await getMemberIds(chatId);

  for (const memberId of memberIds) {
    const socketIds = await redisGetUserSocketsWithRetry(memberId);

    for (const socketId of socketIds) {
      io.to(socketId).emit(SOCKET_EVENTS.MESSAGE_CREATED_ACK, {
        data
      });
    }
  }
}

async function jobMessageFailedAck(data: Swift.MessageFailedAckJob) {
  const io = getIO();

  const { chatId } = data;
  const memberIds = await getMemberIds(chatId);

  for (const memberId of memberIds) {
    const socketIds = await redisGetUserSocketsWithRetry(memberId);

    for (const socketId of socketIds) {
      io.to(socketId).emit(SOCKET_EVENTS.MESSAGE_FAILED_ACK, {
        data
      });
    }
  }
}

type MessageJob = Swift.MessageJob;
export function registerMessageWorker() {
  const worker = new Worker<MessageJob["data"], any, MessageJob["name"]>(
    "messages",
    async (job: Job<MessageJob["data"], any, MessageJob["name"]>) => {
      // /* ----------------- create message ---------------- */
      if (job.name === "createMessage") {
        if (job.attemptsMade <= queueConfig.baseAttempts) {
          await jobCreateMessage(job.data as Swift.CreateMessageJob);
        } else {
          const data = job.data as Swift.CreateMessageJob;
          const failedReason = job.failedReason;

          await enqueueMessageFailedAck({
            success: false,
            tempId: data.tempId,
            chatId: data.message.chatId,
            message: data.message,
            errType: "server",
            msg: `Failed to send message: ${failedReason}`
          });
        }
      }

      // /* ------------ create message duplicate ----------- */
      else if (job.name === "createMessageDuplicate") {
        await jobCreateMessageDuplicate(
          job.data as Swift.CreateMessageDuplicateJob
        );
      }

      // /* --------- message created acknowledgement --------- */
      else if (job.name === "messageCreatedAck") {
        await jobMessageCreatedAck(job.data as Swift.MessageCreatedAckJob);
      }

      // /* --------- message failed acknowledgement --------- */
      else if (job.name === "messageFailedAck") {
        await jobMessageFailedAck(job.data as Swift.MessageFailedAckJob);
      }

      // /* ----------------- job name two ------------------ */
      else if (job.name === "jobeNameTwo") {
        console.log("");
      }
    },
    queueConfig.redis
  );

  worker.on("failed", async (job, err) => {
    console.error(`❌ Job ${job?.name} (${job?.id}) failed:`, err);
  });
}
