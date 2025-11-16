import { io, Socket } from "socket.io-client";
import { swiftEvent } from "@/lib/helpers/swiftEvent";

export type Payload<T> = {
  data: T;
};

const url =
  process.env.NODE_ENV === "development"
    ? "ws://localhost:4000"
    : `${process.env.NEXT_PUBLIC_APP_WSS_SERVER}`;

const socket = io(url, {
  withCredentials: true,
  autoConnect: false,
  auth: {
    platform: "web",
    sessionUrl: process.env.NEXT_PUBLIC_SESSION_URL
  }
});

function connectSocket() {
  return socket.connect();
}

async function connectSocketAsync() {
  if (socket.connected) return socket;

  return new Promise<Socket>((resolve, reject) => {
    socket.once("connect", () => resolve(socket));
    socket.once("connect_error", (err) => reject(err));
    socket.connect();
  });
}

function loadListeners() {}

export const eventTypes = {
  CHAT_CREATED: "CHAT_CREATED"
} as const satisfies Record<string, keyof Swift.Events>;

socket.on(eventTypes.CHAT_CREATED, (payload: Payload<ChatLean>) => {
  console.log("chat created", payload);
  swiftEvent.emit(eventTypes.CHAT_CREATED, payload);
});

function disconnectSocket() {
  socket.disconnect();
}
//
export { socket, connectSocket, disconnectSocket, connectSocketAsync };
