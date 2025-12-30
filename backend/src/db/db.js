import "dotenv/config";
import mongoose from "mongoose";
import { DB_NAME } from "../contants.js";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    console.log(mongoUri,"mongoUri");

    if (!mongoUri) {
      throw new Error("MONGODB_URI not found in env");
    }

    await mongoose.connect(`${mongoUri}/${DB_NAME}`, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;