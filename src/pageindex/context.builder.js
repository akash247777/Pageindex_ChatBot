import mongoose from "mongoose";
import { PAGEINDEX_TREE } from "./tree.definition.js";

// Import models to ensure they are registered
import "../models/users.model.js";
import "../models/clientprofiles.model.js";
import "../models/chats.model.js";
import "../models/sessions.model.js";
import "../models/assignevheicles.model.js";
import "../models/driverdetails.model.js";

export async function buildContext(nodes, identifiers) {
    const context = {};

    console.log("[ContextBuilder] Starting resolution for nodes:", nodes);

    for (const nodeKey of nodes) {
        const node = PAGEINDEX_TREE[nodeKey];
        if (!node || !node.collection) continue;

        try {
            const Model = mongoose.model(node.collection);
            let queryValue = identifiers[node.match];

            // ── Special handling for driver lookup based on assigned vehicles ──
            if (nodeKey === "trips.drivers" && !queryValue && identifiers.userId) {
                console.log("[ContextBuilder] Resolving drivers from assigned vehicles...");

                // 1. Fetch trips for this client if not already in context
                let assignedTrips = context["trips.assigned"];
                if (!assignedTrips) {
                    const TripsModel = mongoose.model("assignevheicles");
                    let uid = identifiers.userId;
                    if (typeof uid === "string" && uid.length === 24) {
                        uid = new mongoose.Types.ObjectId(uid);
                    }
                    assignedTrips = await TripsModel.find({ userId: uid }, "driverId").lean();
                }

                // 2. Extract unique driver IDs
                const driverIds = [...new Set(assignedTrips.map(t => t.driverId).filter(Boolean).map(id => id.toString()))];

                if (driverIds.length > 0) {
                    const objectIds = driverIds.map(id => new mongoose.Types.ObjectId(id));
                    const data = await Model.find({ _id: { $in: objectIds } }, node.fields.join(" ")).lean();
                    context[nodeKey] = data;
                    console.log(`[ContextBuilder] Found ${data.length} driver(s)`);
                    continue;
                }
            }

            // Standard query
            if (typeof queryValue === "string" && queryValue.length === 24) {
                try {
                    queryValue = new mongoose.Types.ObjectId(queryValue);
                } catch (e) { }
            }

            const queryKey = node.queryKey || node.match;
            console.log(`[ContextBuilder] ${nodeKey}: Querying ${node.collection} by ${queryKey}=${queryValue}`);

            const data = await Model.find({ [queryKey]: queryValue }, node.fields.join(" ")).lean();
            console.log(`[ContextBuilder] ${nodeKey}: Found ${data.length} records`);

            context[nodeKey] = data;
        } catch (error) {
            console.error(`[ContextBuilder] Error resolving node ${nodeKey}:`, error.message);
            context[nodeKey] = [];
        }
    }

    return context;
}
