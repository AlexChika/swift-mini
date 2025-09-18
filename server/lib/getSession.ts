import axios from "axios";
import { type Request } from "express";
import { Session } from "swift-mini";

async function getSession(req: Request, url: string): Promise<Session | null> {
  try {
    const fetchOptions = req ? { headers: { cookie: req.headers.cookie } } : {};

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

export { getSession };

/**

import Redis from "ioredis";
import { getSession } from "next-auth/react"; // use this in Express
import cookieParser from "cookie-parser";

const redis = new Redis(process.env.REDIS_URL);

export async function getCachedSession(req, sessionUrl) {
  const cookie =
    req.cookies["next-auth.session-token"] ||
    req.cookies["__Secure-next-auth.session-token"];
  if (!cookie) return null;

  const cacheKey = `session:${cookie}`;

  // 1. Try Redis
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // 2. Fallback: call NextAuth (Mongo lookup under the hood)
  const session = await getSession({ req, sessionUrl });
  if (!session) return null;

  // 3. Cache it
  await redis.set(cacheKey, JSON.stringify(session), "EX", 60); // TTL = 60s

  return session;
}

*/
