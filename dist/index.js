"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const isomorphic_dompurify_1 = __importDefault(require("isomorphic-dompurify"));
const he_1 = __importDefault(require("he"));
function sanitized(dirty, DOMPurifyOptions) {
    if (Array.isArray(dirty)) {
        for (let i = 0; i < dirty.length; i++) {
            dirty[i] = sanitized(dirty[i], DOMPurifyOptions);
        }
        return dirty;
    }
    if (typeof dirty === "object") {
        for (const key in dirty) {
            if (dirty.hasOwnProperty(key)) {
                dirty[key] = sanitized(dirty[key], DOMPurifyOptions);
            }
        }
        return dirty;
    }
    if (typeof dirty === "string") {
        return he_1.default.decode(isomorphic_dompurify_1.default.sanitize(dirty, DOMPurifyOptions));
    }
    return dirty;
}
module.exports = sanitized;
