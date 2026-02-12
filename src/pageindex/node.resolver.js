export function resolveNodesFromQuestion(question) {
    const q = question.toLowerCase().replace(/\s+/g, '');

    if (q.includes("driver")) {
        return ["trips.assigned", "trips.drivers"];
    }

    if (q.includes("profile") || q.includes("company") || q.includes("gst") || q.includes("pan") || q.includes("pickuploc") || q.includes("pickloc") || q.includes("pickup") || q.includes("droploc") || q.includes("drop")) {
        return ["client.profile"];
    }

    if (q.includes("wallet") || q.includes("balance")) {
        return ["client.user"];
    }

    if (q.includes("chat") || q.includes("history") || q.includes("session")) {
        return ["support.chat", "support.sessions"];
    }

    return ["client.user"];
}
