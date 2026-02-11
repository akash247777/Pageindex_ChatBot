import mongoose from "mongoose";
import { PAGEINDEX_TREE } from "./tree.definition.js";

export async function buildContext(nodes, identifiers) {
    const context = {};

    for (const nodeKey of nodes) {
        const node = PAGEINDEX_TREE[nodeKey];
        const collection = mongoose.connection.collection(node.collection);

        let queryValue = identifiers[node.match];

        // Convert string ID to ObjectId if it's a valid hex string for a MongoDB ID
        if (typeof queryValue === 'string' && queryValue.length === 24) {
            try {
                queryValue = new mongoose.Types.ObjectId(queryValue);
            } catch (e) {
                // Not a valid ObjectId, keep as string
            }
        }

        const queryKey = node.queryKey || node.match;

        const data = await collection.find(
            { [queryKey]: queryValue },
            { projection: node.fields.reduce((a, f) => ({ ...a, [f]: 1 }), {}) }
        ).toArray();

        context[nodeKey] = data;
    }

    return context;
}
