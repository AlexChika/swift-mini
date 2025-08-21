import mongoose from "mongoose";

const DATABASE_URL_NEW = process.env.DATABASE_URL_NEW as string;
let isConnected = false;

export async function connectDB() {
  if (isConnected) return mongoose;

  const db = await mongoose.connect(DATABASE_URL_NEW, {
    dbName: "swift"
  });

  isConnected = db.connections[0].readyState === 1;
  console.log({ isConnected });

  if (!isConnected) console.log("Failed to connect to MongoDB");
  else console.log("Connected to MongoDB");

  return mongoose;
}
