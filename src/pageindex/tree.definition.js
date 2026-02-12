export const PAGEINDEX_TREE = {
    root: {
        children: ["client", "trips", "support"]
    },

    // ── CLIENT CONTEXT ──
    client: {
        children: ["client.user", "client.profile"]
    },

    "client.user": {
        collection: "users",
        match: "userId",
        queryKey: "_id",
        fields: ["name", "email", "mobileNumber", "role", "userRole", "walletBalance"]
    },

    "client.profile": {
        collection: "clientprofiles",
        match: "userId",
        queryKey: "user",
        fields: [
            "companyInfo",
            "gstDetails",
            "signatoryDetails",
            "locations"
        ]
    },

    // ── TRIP/DRIVER CONTEXT ──
    trips: {
        children: ["trips.assigned", "trips.drivers"]
    },

    "trips.assigned": {
        collection: "assignevheicles",
        match: "userId",
        queryKey: "userId",
        fields: [
            "tripId",
            "driverId",
            "vehicleId",
            "deliveryStatus",
            "consignorName"
        ]
    },

    "trips.drivers": {
        collection: "driverdetails",
        match: "driverId",
        queryKey: "_id",
        fields: ["name", "phoneNumber", "email", "city", "address"]
    },

    // ── SUPPORT CONTEXT ──
    support: {
        children: ["support.chat", "support.sessions"]
    },

    "support.chat": {
        collection: "ClientChats",
        match: "userId",
        queryKey: "user",
        fields: ["role", "message", "timestamp"]
    },

    "support.sessions": {
        collection: "sessions",
        match: "userId",
        queryKey: "userId",
        fields: ["sessionId", "lastActivity", "userType"]
    }
};
