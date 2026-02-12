import mongoose from "mongoose";
const { Schema } = mongoose;

const ClientChatSchema = new Schema({
    sessionId: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "users" },
    role: { type: String, enum: ["user", "assistant"], required: true },
    message: { type: String },
    timestamp: { type: Date, default: Date.now }
}, { versionKey: false });

export default mongoose.model(
    "ClientChats",
    ClientChatSchema,
    "ClientChats"
);
