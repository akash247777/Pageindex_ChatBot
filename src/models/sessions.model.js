import mongoose from "mongoose";
const { Schema } = mongoose;

const SessionSchema = new Schema({
    sessionId: { type: String, required: true },
    clientId: { type: String },
    userId: { type: String },
    userType: { type: String, default: "client" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    lastActivity: { type: Date }
}, { versionKey: false });

export default mongoose.model(
    "sessions",
    SessionSchema,
    "sessions"
);
