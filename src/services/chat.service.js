import { geminiModel } from "../config/gemini.js";
import { resolveRelevantNodes } from "../pageindex/index.navigator.js";
import { buildContext } from "../pageindex/context.builder.js";

export async function processChat({ message, driverId, sessionId }) {
    const nodes = resolveRelevantNodes(message);

    const context = await buildContext(nodes, {
        driverId,
        sessionId
    });

    const prompt = `
You are an AI Driver Support Assistant for "PageIndex".
Your goal is to provide accurate, helpful, and concise answers to drivers based on their profile and trip data.

GUIDELINES:
- Use the provided DATA to answer the driver's QUESTION.
- If the DATA is empty or does not contain the answer, politely tell the driver you don't have that information.
- Be friendly but professional.
- Refer to the driver by their name if available.

DATA (JSON):
${JSON.stringify(context, null, 2)}

DRIVER QUESTION:
"${message}"
`;

    const result = await geminiModel.generateContent(prompt);
    return result.response.text();
}
