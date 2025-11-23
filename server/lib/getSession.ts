import axios from "axios";
import { type Request } from "express";
import { parseCookies } from "./utils";
import {
  redisGetUserSessions,
  redisSetUserSessions
} from "@src/redis/user.redis";

type Req = Request | string;

async function getSession(req: Req, url: string): Promise<Session | null> {
  try {
    const cookie = typeof req === "string" ? req : req.headers.cookie;

    const fetchOptions = req ? { headers: { cookie } } : {};

    const res = await axios.get<Session>(url, fetchOptions);
    const session = res.data;

    if (
      session &&
      Object.keys(session).length === 0 &&
      session.constructor === Object
    ) {
      return null;
    }

    return session;
  } catch (_) {
    return null;
  }
}

async function getCachedSession(
  req: Req,
  url: string
): Promise<Session | null> {
  const cookies = typeof req === "string" ? parseCookies(req) : req.cookies;

  const sessionToken =
    cookies["__Secure-swift.session-token"] || cookies["authjs.session-token"];

  if (!sessionToken) return null;

  let session = await redisGetUserSessions(sessionToken);

  if (!session) {
    session = await getSession(req, url);

    if (session) {
      try {
        await redisSetUserSessions(sessionToken, session);
      } catch (error) {
        console.error("Error setting user session in Redis:", error);
      }
    }
  }

  return session;
}

export { getSession, getCachedSession };
