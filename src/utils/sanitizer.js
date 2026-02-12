export function sanitizeInput(text) {
    if (!text || typeof text !== "string") return "";
    return text
        .trim()
        .replace(/[<>]/g, "")
        .substring(0, 500);
}

export function isValidObjectId(id) {
    return /^[a-fA-F0-9]{24}$/.test(id);
}
