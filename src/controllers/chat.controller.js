import { processChat } from "../services/chat.service.js";
import { saveChatMessage } from "../services/chat.history.service.js";

export async function chatHandler(req, res) {
    const { message, userId, sessionId } = req.body;

    if (!message || !userId || !sessionId) {
        return res.status(400).json({ error: "Missing required fields: message, userId, or sessionId" });
    }

    try {
        // 1. Save user message
        await saveChatMessage({
            sessionId,
            userId,
            role: "user",
            message
        });

        // 2. Process chat with AI
        const reply = await processChat({
            message,
            userId,
            sessionId
        });

        // 3. Save assistant response
        await saveChatMessage({
            sessionId,
            userId,
            role: "assistant",
            message: reply
        });

        res.json({ reply });
    } catch (error) {
        console.error("Chat error:", error);
        res.status(500).json({ error: "Failed to process your request" });
    }
}
