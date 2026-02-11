import mongoose from "mongoose";
const { Schema } = mongoose;

const TripStartDetailsSchema = new Schema({
    driverId: { type: Schema.Types.ObjectId, required: true },
    assignedVehicle: { type: Schema.Types.ObjectId },

    driverAtPickupPoint: { type: Boolean },
    driverSelfieUploaded: { type: Boolean },
    driverSelfie: { type: String },

    productImagesUploaded: { type: Boolean },
    startLoadinStatus: { type: Boolean },
    completeLoadInStatus: { type: Boolean },

    endTripTime: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model(
    "tripstartdetails",
    TripStartDetailsSchema,
    "tripstartdetails"
);
