import { geminiModel } from "../config/gemini.js";
import { resolveRelevantNodes } from "../pageindex/index.navigator.js";
import { buildContext } from "../pageindex/context.builder.js";
import { getChatHistory } from "./chat.history.service.js";

export async function processChat({ message, userId, sessionId }) {
    // 1. Resolve nodes and build context from DB
    const nodes = resolveRelevantNodes(message);
    console.log("[ChatService] Resolved nodes:", nodes, "| userId:", userId);

    const context = await buildContext(nodes, {
        userId,
        sessionId
    });

    // 2. Fetch recent chat history for conversation continuity
    const rawHistory = await getChatHistory(sessionId, 6);
    const history = rawHistory.reverse().map(h => `${h.role}: ${h.message}`).join("\n");

    console.log("[ChatService] Context data fetched for matching nodes");

    const currentDate = new Date().toISOString().split("T")[0];

    const prompt = `
You are an AI Client Support Assistant for "PageIndex".
Your goal is to provide accurate, helpful, and concise answers to clients regarding their profile, account, drivers, and company information.

SCHEMA DEFINITIONS
------------------------------------

1. COLLECTION: clientprofiles
Purpose: Client company information and contact details
Fields: user (userId ref), companyInfo (registeredCompanyName, brandName, authorizedName, contactNumber, emailAddress, address, pincode), locations (pickupLocations: [{address, latitude, longitude}], dropLocations: [{address, latitude, longitude}])

2. COLLECTION: users
Purpose: User profile and identity
Fields: _id (userId), mobileNumber (array), email, name, walletBalance (number)

3. COLLECTION: assignevheicles
Purpose: Maps clients to their assigned drivers and vehicles.
Fields: userId (client), driverId (ref to driverdetails), tripId, deliveryStatus

4. COLLECTION: driverdetails
Purpose: Driver contact and identity details.
Fields: _id (driverId), name, phoneNumber, city, address

5. COLLECTION: ClientChats
Purpose: Client support chat history
Fields: sessionId, user (userId ref), role (user/assistant), message, timestamp

------------------------------------
INPUT CONTEXT
------------------------------------
user_id: ${userId}
current_date: ${currentDate}
history: 
${history}

DATA (JSON):
${JSON.stringify(context, null, 2)}

GUIDELINES:
- Use the provided DATA and HISTORY to answer the client's question.
- To identify drivers, match "driverId" in "trips.assigned" with "_id" in "trips.drivers".
- If a client asks for their driver's name, look through the "trips.drivers" data.
- If the DATA is empty or does not contain the answer, politely tell the client you don't have that information.
- Do NOT include the client's name or company name in your response.
- Never hallucinate data. Only use what is provided.
- Be concise and clear.

CLIENT QUESTION:
"${message}"
`;

    const result = await geminiModel.generateContent(prompt);
    return result.response.text();
}
