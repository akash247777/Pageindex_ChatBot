export function logInfo(message, data = {}) {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, Object.keys(data).length ? data : "");
}

export function logError(message, error = null) {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error || "");
}

export function logDebug(message, data = {}) {
    if (process.env.NODE_ENV === "development") {
        console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`, Object.keys(data).length ? data : "");
    }
}
