import { PAGEINDEX_TREE } from "./tree.definition.js";

export function resolveRelevantNodes(userQuery) {
    const q = userQuery.toLowerCase().replace(/\s+/g, '');

    // Profile / company / account
    if (q.includes("profile") || q.includes("company") || q.includes("gst") || q.includes("pan") || q.includes("address") || q.includes("accountant") || q.includes("pickuploc") || q.includes("pickloc") || q.includes("pickup") || q.includes("droploc") || q.includes("drop") || q.includes("brand")) {
        return ["client.profile"];
    }

    // Driver related (newly restored)
    if (q.includes("driver")) {
        return ["trips.assigned", "trips.drivers"];
    }

    // Wallet / balance
    if (q.includes("wallet") || q.includes("balance")) {
        return ["client.user"];
    }

    // Chat history
    if (q.includes("chat") || q.includes("history") || q.includes("previous conversation")) {
        return ["support.chat"];
    }

    // Session info
    if (q.includes("session") || q.includes("login")) {
        return ["support.sessions"];
    }

    // Default: return user profile
    return ["client.user"];
}
