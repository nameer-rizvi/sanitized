"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const he_1 = __importDefault(require("he"));
const isomorphic_dompurify_1 = __importDefault(require("isomorphic-dompurify"));
function sanitized(input, options = {}) {
    if (Array.isArray(input)) {
        const results = [];
        for (const item of input)
            results.push(sanitized(item, options));
        return results;
    }
    if (input !== null && typeof input === "object") {
        const result = {};
        for (const [key, value] of Object.entries(input))
            result[key] = sanitized(value, options);
        return result;
    }
    if (typeof input === "string") {
        return he_1.default.decode(isomorphic_dompurify_1.default.sanitize(input, options));
    }
    return input;
}
module.exports = sanitized;
