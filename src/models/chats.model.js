import mongoose from "mongoose";
const { Schema } = mongoose;

const ChatSchema = new Schema({
    sessionId: { type: String, required: true },
    role: { type: String, enum: ["user", "assistant"], required: true },
    message: { type: String },
    messageType: { type: String },
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model(
    "chats",
    ChatSchema,
    "chats"
);
