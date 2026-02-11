import mongoose from "mongoose";
import { ENV } from "./env.js";

export async function connectMongo() {
    try {
        await mongoose.connect(ENV.MONGO_URI);
        console.log("✅ MongoDB connected");
    } catch (err) {
        console.error("❌ MongoDB connection failed", err);
        process.exit(1);
    }
}
