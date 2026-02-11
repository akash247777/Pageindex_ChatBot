import { GoogleGenerativeAI } from "@google/generative-ai";
import { ENV } from "./env.js";

const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);

export const geminiModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
});
