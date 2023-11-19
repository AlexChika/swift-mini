import { Session } from "next-auth";

import axios from "axios";
import express from "express";
import { GraphqlContext } from "./swift-mini";

async function getSession(
  req: express.Request,
  url: string
): Promise<GraphqlContext> {
  try {
    const fetchOptions = req ? { headers: { cookie: req.headers.cookie } } : {};
    const res = await axios.get<Session>(url, fetchOptions);
    const session = res.data;

    if (Object.keys(session).length === 0 && session.constructor === Object) {
      return null;
    }

    return { session };
  } catch (e) {
    return { session: null };
  }
}

export { getSession };
