import { CorsOptions } from "cors";

/* --------- database url -------- */

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST || "cluster0.mongodb.net";
const DB_NAME = process.env.DB_NAME;

const params = new URLSearchParams({
  retryWrites: "true",
  w: "majority",
  appName: "STAR"
});

export const DATABASE_URL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?${params.toString()}`;

/* --------- cloudinary url -------- */

const cloudName = process.env.CD_NAME;
export const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

/* ---------------CORS --------------*/

export const corsOpts: CorsOptions = {
  origin:
    process.env.NODE_ENV === "development"
      ? ["http://localhost:3000", "https://studio.apollographql.com"]
      : [
          "https://swiftmini.globalstack.dev",
          "https://swift-mini.vercel.app",
          "https://swiftmini-staging.globalstack.dev"
        ],
  credentials: true
};

/* ------------- REDIS ------------- */

const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
export const REDIS_URL =
  process.env.NODE_ENV === "development"
    ? "redis://127.0.0.1:6379"
    : `rediss://default:${REDIS_PASSWORD}@sought-wolf-15913.upstash.io:6379`;
