/* eslint-disable @typescript-eslint/no-explicit-any */
import { redisGetUserSockets } from "@src/redis/user.redis";
import { DefaultEventsMap, Server, Socket } from "socket.io";
import { getChatMembers } from "@src/graphql/services/chat.service";
import {
  redisGetChatMembers,
  redisSetChatMembers
} from "@src/redis/chat.redis";

type IO = Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

type SOCKET = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

async function getMemberIds(chatId: string) {
  try {
    const membersFromRedis = await redisGetChatMembers(chatId);
    if (membersFromRedis && membersFromRedis.length > 0) {
      return membersFromRedis;
    } else {
      const memberIdsFromDb = await getChatMembers(chatId);
      await redisSetChatMembers(chatId, memberIdsFromDb);
      return memberIdsFromDb;
    }
  } catch (error) {
    console.error("error getting chat members:", error);
    return [];
  }
}

async function emitGroupMessage(
  io: IO,
  socket: SOCKET,
  chatId: string,
  message: any
) {
  const memberIds = await getMemberIds(chatId);
  for (const memberId of memberIds) {
    //   if (memberId === socket.memberIds) continue;
    const sockets = await redisGetUserSockets(memberId);
    sockets.forEach((sockId) => {
      io.to(sockId).emit("message:receive", message);
    });
  }
}

// socket.on("message:send", async (data) => {
//   const { chatId, receiverId, content } = data;

//   // Persist message
//   const message = await Message.create({
//     chatId,
//     senderId: socket.userId,
//     receiverId,
//     content,
//     status: "sent",
//     createdAt: new Date()
//   });

//   // Find recipient socket IDs
//   const receiverSockets = await redis.lrange(
//     `sockets:user:${receiverId}`,
//     0,
//     -1
//   );

//   // Emit message:receive to all of receiver’s sockets
//   receiverSockets.forEach((sockId) => {
//     io.to(sockId).emit("message:receive", message);
//   });

//   // Optionally acknowledge to sender
//   socket.emit("message:sent", { messageId: message._id });
// });

/* ------------------ Group sample ----------------- */

// socket.on("message:send", async (data) => {
//   const { chatId, content } = data;

//   const chat = await Chat.findById(chatId);
//   if (!chat) return;

//   const message = await Message.create({
//     chatId,
//     senderId: socket.userId,
//     content,
//     status: "sent",
//     createdAt: new Date()
//   });

//   // Loop over participants (excluding sender)
//   for (const participantId of chat.participants) {
//     if (participantId === socket.userId) continue;

//     const sockets = await redis.lrange(`sockets:user:${participantId}`, 0, -1);
//     sockets.forEach((sockId) => {
//       io.to(sockId).emit("message:receive", message);
//     });
//   }

//   socket.emit("message:sent", { messageId: message._id });
// });
