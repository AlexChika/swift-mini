/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server } from "socket.io";
import { corsOpts } from "@lib/utils/constants";
import { getCachedSession } from "@lib/getSession";
import { createAdapter } from "@socket.io/redis-adapter";
import { socketTest } from "./socket.utils";

export function initSocketServer(
  server: ReturnType<typeof import("http").createServer>,
  pub: any,
  sub: any
) {
  const io = new Server(server, {
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

    const session = await getCachedSession(cookies, sessionUrl, "localMem");

    if (!session) return next(new Error("AUTH: User is not authenticated"));

    socket.data.user = session.user;
    next();
  });

  io.on("connection", (socket) => {
    socketTest(io, socket);

    socket.on("disconnect", () => {
      console.log("⚠️ User disconnected:", socket.id);
    });
  });

  return io;
}
