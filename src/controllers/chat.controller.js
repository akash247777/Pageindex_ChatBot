import { processChat } from "../services/chat.service.js";

export async function chatHandler(req, res) {
    const { message, driverId, sessionId } = req.body;

    const reply = await processChat({
        message,
        driverId,
        sessionId
    });

    res.json({ reply });
}
