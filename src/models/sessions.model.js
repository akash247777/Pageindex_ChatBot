import mongoose from "mongoose";
const { Schema } = mongoose;

const SessionSchema = new Schema({
    sessionId: { type: String, required: true },
    driverId: { type: Schema.Types.ObjectId, required: true },
    userId: { type: Schema.Types.ObjectId },
    userType: { type: String, default: "driver" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    lastActivity: { type: Date }
});

export default mongoose.model(
    "sessions",
    SessionSchema,
    "sessions"
);
