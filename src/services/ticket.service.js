import Ticket from "../models/tickets.model.js";

export async function getDriverTickets(driverId) {
    return Ticket.find({ userId: driverId }).sort({ createdAt: -1 });
}

export async function createTicketFromChat({
    driverId,
    tripId,
    description
}) {
    const ticket = new Ticket({
        ticketId: `TKT-${Date.now()}`,
        userType: "driver",
        userId: driverId,
        tripId,
        description,
        status: "open",
        priority: "medium"
    });

    return ticket.save();
}
