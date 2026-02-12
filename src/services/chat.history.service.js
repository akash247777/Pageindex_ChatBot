import ClientChat from "../models/chats.model.js";
import mongoose from "mongoose";

/**
 * Saves a chat message to the ClientChats collection
 */
export async function saveChatMessage({ sessionId, userId, role, message }) {
    try {
        const chat = new ClientChat({
            sessionId,
            user: typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId,
            role,
            message,
            timestamp: new Date()
        });
        return await chat.save();
    } catch (error) {
        console.error("[ChatHistoryService] Error saving message:", error);
        throw error;
    }
}

/**
 * Retrieves the recent chat history for a session
 */
export async function getChatHistory(sessionId, limit = 10) {
    try {
        return await ClientChat.find({ sessionId })
            .sort({ timestamp: -1 })
            .limit(limit)
            .lean();
    } catch (error) {
        console.error("[ChatHistoryService] Error fetching history:", error);
        return [];
    }
}
