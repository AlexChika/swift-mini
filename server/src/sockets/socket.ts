/* eslint-disable @typescript-eslint/no-explicit-any */
import { corsOpts } from "@lib/utils/constants";
import { getCachedSession } from "@lib/getSession";
import { DefaultEventsMap, Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { socketOnConnect, socketOnDisconnect } from "./user.socket";
import { socketOnCreateMessage } from "./message.socket";

let io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

export function initSocketServer(
  server: ReturnType<typeof import("http").createServer>,
  pub: any,
  sub: any
) {
  io = new Server(server, {
    cors: corsOpts
  });

  io.adapter(createAdapter(pub, sub));

  io.use(async (socket, next) => {
    const { sessionUrl, platform } = socket.handshake.auth;
    const cookies = socket.handshake.headers.cookie;

    if (platform === "mobile") {
      // handle mobile specific auth if needed
      // form cookies from data passed in handshake
      //   like below
      // `__Secure-swift.session-token=${encodeURIComponent(data)};authjs.session-token=${encodeURIComponent(data2)}`;
    }

    if (!sessionUrl || !cookies)
      return next(new Error("AUTH: User is not authenticated"));

    const session = await getCachedSession(cookies, sessionUrl);

    if (!session) return next(new Error("AUTH: User is not authenticated"));

    socket.data.user = session.user;
    socket.data.sessionToken = session.sessionToken;

    next();
  });

  io.on("connection", (socket) => {
    socketOnConnect(io, socket);

    // all other socket event handlers here
    socketOnCreateMessage(io, socket);

    socketOnDisconnect(io, socket);
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}
