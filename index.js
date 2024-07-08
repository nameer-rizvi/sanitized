let dompurify = require("dompurify");
const he = require("he");

if (!dompurify.sanitize) {
  const jsdom = require("jsdom");

  const jsdomWindow = new jsdom.JSDOM("").window;

  dompurify = dompurify(jsdomWindow);
}

function sanitized(dirty, dompurifyOption) {
  if (Array.isArray(dirty)) {
    for (let i = 0; i < dirty.length; i++) {
      dirty[i] = sanitized(dirty[i], dompurifyOption);
    }
    return dirty;
  }

  if (typeof dirty === "object") {
    for (const key in dirty) {
      if (dirty.hasOwnProperty(key)) {
        dirty[key] = sanitized(dirty[key], dompurifyOption);
      }
    }
    return dirty;
  }

  if (typeof dirty === "string") {
    return he.decode(dompurify.sanitize(dirty, dompurifyOption));
  }

  return dirty;
}

module.exports = sanitized;
