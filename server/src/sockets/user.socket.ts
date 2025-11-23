import { DefaultEventsMap, Server, Socket } from "socket.io";
import {
  redisAddUserSocket,
  redisRemoveUserSocket
} from "@src/redis/user.redis";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IO = Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SOCKET = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

export async function socketOnConnect(_: IO, socket: SOCKET) {
  try {
    await redisAddUserSocket(socket.data.user.id, socket.id);
  } catch (error) {
    console.error("Error in socketOnConnect:", error);
  }
}

export async function socketOnDisconnect(_: IO, socket: SOCKET) {
  socket.on("disconnect", async () => {
    try {
      await redisRemoveUserSocket(socket.data.user.id, socket.id);
    } catch (error) {
      console.error("Error in socketOnDisconnect:", error);
    }
  });
}
