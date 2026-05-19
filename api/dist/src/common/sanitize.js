"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeText = sanitizeText;
exports.sanitizePayload = sanitizePayload;
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;
const HTML_TAGS = /<[^>]*>/g;
function sanitizeText(value) {
    if (typeof value !== "string") {
        return value;
    }
    return value.replace(CONTROL_CHARS, " ").replace(HTML_TAGS, "").trim();
}
function sanitizePayload(payload) {
    return Object.entries(payload).reduce((acc, [key, value]) => {
        if (Array.isArray(value)) {
            acc[key] = value.map((item) => typeof item === "object" && item !== null
                ? sanitizePayload(item)
                : sanitizeText(item));
            return acc;
        }
        if (typeof value === "object" && value !== null && !(value instanceof Date)) {
            acc[key] = sanitizePayload(value);
            return acc;
        }
        acc[key] = sanitizeText(value);
        return acc;
    }, {});
}
//# sourceMappingURL=sanitize.js.map