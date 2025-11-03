import mongoose from "mongoose";
import { DATABASE_URL } from "./utils/constants";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return mongoose;

  const db = await mongoose.connect(DATABASE_URL, {
    dbName: "swift"
  });

  isConnected = db.connections[0].readyState === 1;
  console.log({ isConnected });

  if (!isConnected) console.log("Failed to connect to MongoDB");
  else console.log("Connected to MongoDB");

  return mongoose;
}
