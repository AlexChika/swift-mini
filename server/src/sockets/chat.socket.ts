/* eslint-disable @typescript-eslint/no-explicit-any */
import { redisGetUserSockets } from "@src/redis/user.redis";
import { DefaultEventsMap, Server, Socket } from "socket.io";
import { getMemberIds } from "@src/graphql/services/chat.service";

type IO = Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

type SOCKET = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

async function socketEmitGroupMessage(
  io: IO,
  socket: SOCKET,
  chatId: string,
  message: any
) {
  const memberIds = await getMemberIds(chatId);
  for (const memberId of memberIds || []) {
    //   if (memberId === socket.memberIds) continue;
    const sockets = await redisGetUserSockets(memberId);
    sockets.forEach((sockId) => {
      io.to(sockId).emit("message:receive", message);
    });
  }
}

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
