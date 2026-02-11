export function resolveNodesFromQuestion(question) {
    const q = question.toLowerCase();

    if (q.includes("vehicle")) {
        return ["trips.assignment", "vehicle.details"];
    }

    if (q.includes("trip") || q.includes("delay")) {
        return ["trips.assignment", "trips.start"];
    }

    if (q.includes("reward")) {
        return ["driver.rewards"];
    }

    if (q.includes("ticket") || q.includes("complaint")) {
        return ["support.tickets"];
    }

    return ["driver.profile"];
}
