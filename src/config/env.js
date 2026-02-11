import dotenv from "dotenv";

dotenv.config();

export const ENV = {
    PORT: process.env.PORT || 3000,
    MONGO_URI: process.env.MONGO_URI,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY
};

if (!ENV.MONGO_URI) {
    throw new Error("❌ MONGO_URI is missing in environment variables");
}

if (!ENV.GEMINI_API_KEY) {
    throw new Error("❌ GEMINI_API_KEY is missing in environment variables");
}
