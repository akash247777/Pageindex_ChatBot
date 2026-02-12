import mongoose from "mongoose";
const { Schema } = mongoose;

const AssignVehiclesSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "users" },
    vehicleId: { type: Schema.Types.ObjectId },
    driverId: { type: Schema.Types.ObjectId, ref: "driverdetails" },
    vendorId: { type: Schema.Types.ObjectId },
    companyName: { type: Schema.Types.ObjectId },
    tripId: { type: String },
    startDate: { type: String },
    pickupTime: { type: String },
    deliveryStatus: { type: String, enum: ["upcoming", "Ongoing trips", "delivered"] },
    consignorName: { type: String },
    managerName: { type: String },
    managerNumber: { type: String },
    costWithoutTax: { type: Number },
    revenueWithoutTax: { type: Number },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
}, { versionKey: false });

export default mongoose.model(
    "assignevheicles",
    AssignVehiclesSchema,
    "assignevheicles"
);
