import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema({
    mobileNumber: [{ type: String }],
    email: { type: String },
    name: { type: String },
    role: { type: String },
    userRole: { type: String },
    companyName: { type: Schema.Types.ObjectId },
    clientProfile: { type: Schema.Types.ObjectId, ref: "clientprofiles" },
    walletBalance: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
}, { versionKey: false });

export default mongoose.model(
    "users",
    UserSchema,
    "users"
);
