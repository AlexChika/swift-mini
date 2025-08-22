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
