import mongoose from "mongoose";
const { Schema } = mongoose;

const ClientProfileSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "users" },
    companyInfo: {
        registeredCompanyName: { type: String },
        brandName: { type: String },
        authorizedName: { type: String },
        contactNumber: { type: String },
        emailAddress: { type: String },
        address: { type: String },
        pincode: { type: String }
    },
    gstDetails: {
        hasGST: { type: Boolean },
        gstNumber: { type: String },
        panNumber: { type: String }
    },
    signatoryDetails: {
        accountantName: { type: String },
        accountantPhoneNumber: { type: String },
        accountantEmail: { type: String }
    },
    locations: {
        pickupLocations: [{
            address: { type: String },
            latitude: { type: Number },
            longitude: { type: Number }
        }],
        dropLocations: [{
            address: { type: String },
            latitude: { type: Number },
            longitude: { type: Number }
        }]
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
}, { versionKey: false });

export default mongoose.model(
    "clientprofiles",
    ClientProfileSchema,
    "clientprofiles"
);
