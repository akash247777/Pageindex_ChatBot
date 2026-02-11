import { PAGEINDEX_TREE } from "./tree.definition.js";

export function resolveRelevantNodes(userQuery) {
    const q = userQuery.toLowerCase();

    if (q.includes("delay") || q.includes("trip") || q.includes("manager")) {
        return ["trips.assignment", "trips.start"];
    }

    if (q.includes("reward")) {
        return ["driver.rewards"];
    }

    if (q.includes("ticket")) {
        return ["support.tickets"];
    }

    return ["driver.profile"];
}
