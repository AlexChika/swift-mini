import { io } from "socket.io-client";

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

  return new Promise((resolve, reject) => {
    socket.once("connect", () => resolve(socket));
    socket.once("connect_error", (err) => reject(err));
    socket.connect();
  });
}

function disconnectSocket() {
  socket.disconnect();
}

export { socket, connectSocket, disconnectSocket, connectSocketAsync };
