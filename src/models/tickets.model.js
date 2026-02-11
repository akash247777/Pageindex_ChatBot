import mongoose from "mongoose";
const { Schema } = mongoose;

const TicketSchema = new Schema({
    ticketId: { type: String, required: true },
    userType: { type: String },
    userId: { type: Schema.Types.ObjectId },

    category: { type: String },
    subCategory: { type: String },
    tripId: { type: String },

    description: { type: String },
    status: { type: String },
    priority: { type: String },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

export default mongoose.model(
    "tickets",
    TicketSchema,
    "tickets"
);
