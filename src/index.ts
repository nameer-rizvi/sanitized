import he from "he";
import DOMPurify from "isomorphic-dompurify";

function sanitized(input: any, options: DOMPurify.Config = {}): any {
  if (Array.isArray(input)) {
    const results = [];
    for (const item of input) results.push(sanitized(item, options));
    return results;
  }

  if (input !== null && typeof input === "object") {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(input))
      result[key] = sanitized(value, options);
    return result;
  }

  if (typeof input === "string") {
    return he.decode(DOMPurify.sanitize(input, options));
  }

  return input;
}

export = sanitized;
