import { Session } from "next-auth";

import axios from "axios";
import express from "express";

async function getSession(req: express.Request, url: string): Promise<Session> {
  try {
    const fetchOptions = req ? { headers: { cookie: req.headers.cookie } } : {};
    console.log("headers", req.headers);
    console.log("fetchOptions", fetchOptions);
    const res = await axios.get<Session>(url, fetchOptions);
    const session = res.data;

    console.log("inside getSession", session);

    if (Object.keys(session).length === 0 && session.constructor === Object) {
      return null;
    }

    return session;
  } catch (e) {
    return null;
  }
}

export { getSession };
