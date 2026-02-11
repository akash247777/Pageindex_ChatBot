import mongoose from "mongoose";
const { Schema } = mongoose;

const AssignVehiclesSchema = new Schema({
    tripId: { type: String },
    driverId: { type: Schema.Types.ObjectId, required: true },
    vehicleId: { type: Schema.Types.ObjectId },
    vendorId: { type: Schema.Types.ObjectId },

    tripStarted: { type: Boolean },
    deliveryStatus: { type: String },
    delayStatus: { type: Boolean },
    delayTime: { type: Number },

    managerName: { type: String },
    managerNumber: { type: String },
    pickupTime: { type: Date },
    startDate: { type: Date },
    cronCompletedTime: { type: Date },

    totalDistanceKm: { type: Number },
    cityName: { type: String },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

export default mongoose.model(
    "assignevheicles",
    AssignVehiclesSchema,
    "assignevheicles"
);
