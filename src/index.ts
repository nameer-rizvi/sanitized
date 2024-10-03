import DOMPurify from "isomorphic-dompurify";
import he from "he";

function sanitized(dirty: any, DOMPurifyOptions: { [key: string]: any }) {
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
    return he.decode(DOMPurify.sanitize(dirty, DOMPurifyOptions));
  }

  return dirty;
}

export = sanitized;
