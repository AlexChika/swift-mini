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
