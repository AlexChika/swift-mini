import axios from "axios";
import { Session } from "swift-mini";
import { type Request } from "express";
import { parseCookies } from "./utils";

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

// const redis = new Redis(process.env.REDIS_URL);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const redis: any = {};

type Cache = {
  exp: number;
  session: Session;
} | null;

const localMem = new Map<string, Cache>();

type CacheType = "redis" | "localMem";
async function getCachedSession(
  req: Req,
  url: string,
  cache: CacheType = "localMem"
): Promise<Session | null> {
  const cookies = typeof req === "string" ? parseCookies(req) : req.cookies;

  const sessionToken =
    cookies["__Secure-swift.session-token"] || cookies["authjs.session-token"];

  if (!sessionToken) return null;

  const THIRTY_MINUTES = 1000 * 60 * 30;
  const cacheKey = `session:${sessionToken}`;

  if (cache === "localMem") {
    const cache = localMem.get(cacheKey) || null;
    if (cache && cache.exp > Date.now()) return cache.session;
    else {
      const session = await getSession(req, url);
      if (session)
        localMem.set(cacheKey, { session, exp: Date.now() + THIRTY_MINUTES });
      return session;
    }
  }

  if (cache === "redis") {
    throw new Error("Redis not implemented yet");

    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const session = await getSession(req, url);
    if (!session) return null;

    await redis.set(cacheKey, JSON.stringify(session), "EX", 30 * 60); // TTL = 30 minutes
    return session;
  }

  return null;
}

export { getSession, getCachedSession };
