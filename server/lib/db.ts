import mongoose from "mongoose";
import { DATABASE_URL } from "./utils/constants";

mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB connected successfully");
});

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🔌 MongoDB connection closed due to app termination");
  process.exit(0);
});

export async function connectDB() {
  const { readyState } = mongoose.connection;

  // 1 = connected, 2 = connecting
  if (readyState === 1) {
    return mongoose;
  }

  if (readyState === 2) {
    console.log("MongoDB connection in progress, waiting...");
    await new Promise((resolve, reject) => {
      mongoose.connection.once("connected", resolve);
      mongoose.connection.once("error", reject);
    });
    return mongoose;
  }

  try {
    await mongoose.connect(DATABASE_URL, {
      dbName: "swift",
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
    return mongoose;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}
