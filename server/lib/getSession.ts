import axios from "axios";
// import Redis from "ioredis";
import { Session } from "swift-mini";
import { type Request } from "express";

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

// const redis = new Redis(process.env.REDIS_URL);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const redis: any = {};

type Cache = {
  exp: number;
  session: Session;
} | null;

const localMem = new Map<string, Cache>();

async function getCachedSession(
  req: Request,
  url: string,
  cache: "redis" | "localMem" = "localMem"
): Promise<Session | null> {
  const cookie =
    req.cookies["__Secure-swift.session-token"] ||
    req.cookies["authjs.session-token"];

  if (!cookie) return null;

  const TEN_MINUTES = 1000 * 60 * 10;
  const cacheKey = `session:${cookie}`;

  if (cache === "localMem") {
    const cache = localMem.get(cacheKey) || null;
    if (cache && cache.exp > Date.now()) return cache.session;
    else {
      const session = await getSession(req, url);
      if (session)
        localMem.set(cacheKey, { session, exp: Date.now() + TEN_MINUTES });
      return session;
    }
  }

  if (cache === "redis") {
    throw new Error("Redis not implemented yet");

    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const session = await getSession(req, url);
    if (!session) return null;

    await redis.set(cacheKey, JSON.stringify(session), "EX", 10 * 60); // TTL = 10 minutess
  }

  return null;
}

export { getSession, getCachedSession };
