export const PAGEINDEX_TREE = {
    root: {
        children: ["driver", "trips", "vehicle", "support"]
    },

    driver: {
        children: ["driver.profile", "driver.sessions", "driver.rewards"]
    },

    "driver.profile": {
        collection: "driverdetails",
        match: "driverId",
        queryKey: "_id",
        fields: ["name", "phoneNumber", "city", "drivingLicenseExpiry"]
    },

    "driver.sessions": {
        collection: "sessions",
        match: "driverId",
        fields: ["sessionId", "lastActivity"]
    },

    "driver.rewards": {
        collection: "rewards",
        match: "driverId",
        fields: ["rewardPoints", "rewardFor"]
    },

    trips: {
        children: ["trips.assignment", "trips.start"]
    },

    "trips.assignment": {
        collection: "assignevheicles",
        match: "driverId",
        fields: ["tripId", "deliveryStatus", "delayStatus", "pickupTime", "managerName", "managerNumber"]
    },

    "trips.start": {
        collection: "tripstartdetails",
        match: "driverId",
        fields: ["driverAtPickupPoint", "completeLoadInStatus"]
    },

    support: {
        children: ["support.chat", "support.tickets"]
    },

    "support.chat": {
        collection: "chats",
        match: "sessionId",
        fields: ["role", "message", "timestamp"]
    },

    "support.tickets": {
        collection: "tickets",
        match: "userId",
        fields: ["ticketId", "status", "priority"]
    }
};
