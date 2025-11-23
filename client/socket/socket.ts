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

function disconnectSocket() {
  socket.disconnect();
}

async function connectSocketAsync() {
  if (socket.connected) return socket;

  return new Promise<Socket>((resolve, reject) => {
    socket.once("connect", () => resolve(socket));
    socket.once("connect_error", (err) => reject(err));
    socket.connect();
  });
}

const socketEmitEvents = {
  CREATE_MESSAGE: "CREATE_MESSAGE"
} as const;

function socketEmitNewMessage(payload: {
  tempId: string;
  message: SendMessage;
}) {
  socket.emit(socketEmitEvents.CREATE_MESSAGE, { data: payload });
}

// function loadListeners() {}

export const socketOnEvents = {
  CHAT_CREATED: "CHAT_CREATED",
  MESSAGE_CREATED_ACK: "MESSAGE_CREATED_ACK",
  MESSAGE_QUEUED_ACK: "MESSAGE_QUEUED_ACK",
  MESSAGE_FAILED_ACK: "MESSAGE_FAILED_ACK"
} as const satisfies Record<string, keyof Swift.Events>;

socket.on(socketOnEvents.CHAT_CREATED, (payload: Payload<ChatLean>) => {
  console.log("chat created", payload);
  swiftEvent.emit(socketOnEvents.CHAT_CREATED, payload);
});

socket.on(
  socketOnEvents.MESSAGE_QUEUED_ACK,
  (payload: Payload<Swift.Events["MESSAGE_QUEUED_ACK"]>) => {
    console.log("message created ack", payload);
    swiftEvent.emit(socketOnEvents.MESSAGE_QUEUED_ACK, payload);
  }
);

socket.on(
  socketOnEvents.MESSAGE_CREATED_ACK,
  (payload: Payload<Swift.Events["MESSAGE_CREATED_ACK"]>) => {
    console.log("message created ack", payload);
    swiftEvent.emit(socketOnEvents.MESSAGE_CREATED_ACK, payload);
  }
);

socket.on(
  socketOnEvents.MESSAGE_FAILED_ACK,
  (payload: Payload<Swift.Events["MESSAGE_FAILED_ACK"]>) => {
    console.log("message failed ack", payload);
    swiftEvent.emit(socketOnEvents.MESSAGE_FAILED_ACK, payload);
  }
);

export {
  socket,
  connectSocket,
  disconnectSocket,
  connectSocketAsync,
  socketEmitNewMessage
};
