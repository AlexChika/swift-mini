// /* ------------------ Group sample ----------------- */

// // socket.on("message:send", async (data) => {
// //   const { chatId, content } = data;

// //   const chat = await Chat.findById(chatId);
// //   if (!chat) return;

// //   const message = await Message.create({
// //     chatId,
// //     senderId: socket.userId,
// //     content,
// //     status: "sent",
// //     createdAt: new Date()
// //   });

// //   // Loop over participants (excluding sender)
// //   for (const participantId of chat.participants) {
// //     if (participantId === socket.userId) continue;

// //     const sockets = await redis.lrange(`sockets:user:${participantId}`, 0, -1);
// //     sockets.forEach((sockId) => {
// //       io.to(sockId).emit("message:receive", message);
// //     });
// //   }

// //   socket.emit("message:sent", { messageId: message._id });
// // });

// export { socketOnConnect };
