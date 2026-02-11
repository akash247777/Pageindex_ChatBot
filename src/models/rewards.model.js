import mongoose from "mongoose";
const { Schema } = mongoose;

const RewardSchema = new Schema({
    driverId: { type: Schema.Types.ObjectId, required: true },
    rewardPoints: { type: Number },
    rewardFor: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model(
    "rewards",
    RewardSchema,
    "rewards"
);
