import { Session } from "next-auth";

import axios from "axios";
import { Request } from "express";

async function getSession(req: Request, url: string): Promise<Session | null> {
  try {
    const fetchOptions = req ? { headers: { cookie: req.headers.cookie } } : {};

    const res = await axios.get<Session>(url, fetchOptions);
    const session = res.data;

    if (Object.keys(session).length === 0 && session.constructor === Object) {
      return null;
    }

    return session;
  } catch (e) {
    return null;
  }
}

export { getSession };
