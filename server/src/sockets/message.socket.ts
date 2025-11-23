import { SOCKET_EVENTS } from "@lib/utils/constants";
import { enqueueCreateMessage } from "@src/queue/queues/message.queues";
import { DefaultEventsMap, Server, Socket } from "socket.io";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IO = Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SOCKET = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

type Payload<T> = {
  data: T;
};

async function socketOnCreateMessage(_: IO, socket: SOCKET) {
  socket.on(
    SOCKET_EVENTS.CREATE_MESSAGE,
    async (payload: Payload<Swift.CreateMessagePayLoad>) => {
      const { tempId } = payload.data;
      const userId = socket.data.user.id;

      let errorOccurred = false;
      try {
        await enqueueCreateMessage({ ...payload.data, userId });
      } catch (_: unknown) {
        errorOccurred = true;
      }

      socket.emit(SOCKET_EVENTS.MESSAGE_QUEUED_ACK, {
        tempId,
        status: errorOccurred ? "failed" : "success"
      });
    }
  );
}

export { socketOnCreateMessage };

//   const memberIds = await getMemberIds(chatId);
//   for (const memberId of memberIds) {
//     //   if (memberId === socket.memberIds) continue;
//     const sockets = await redisGetUserSockets(memberId);
//     sockets.forEach((sockId) => {
//       io.to(sockId).emit("message:receive", message);
//     });
//   }

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
