import { DefaultEventsMap, Server, Socket } from "socket.io";
import { redis } from "@src/redis/redis";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IO = Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SOCKET = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

function socketTest(_: IO, socket: SOCKET) {
  console.log("New socket connected:", socket.id);

  redis.SET(`socket:test`, "socket and redis connected frm local");
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

export { socketTest };
