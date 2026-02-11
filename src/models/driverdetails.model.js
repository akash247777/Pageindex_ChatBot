import mongoose from "mongoose";
const { Schema } = mongoose;

const DriverDetailsSchema = new Schema({
    vendorId: { type: Schema.Types.ObjectId },
    name: { type: String },
    phoneNumber: { type: String },
    email: { type: String },
    city: { type: String },
    address: { type: String },
    drivingLicense: { type: String },
    drivingLicenseExpiry: { type: Date },
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model(
    "driverdetails",
    DriverDetailsSchema,
    "driverdetails"
);
