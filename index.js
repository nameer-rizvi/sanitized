let dompurify = require("dompurify");
const he = require("he");

if (!dompurify.sanitize) {
  const jsdom = require("jsdom");

  const jsdomWindow = new jsdom.JSDOM("").window;

  dompurify = dompurify(jsdomWindow);
}

function sanitized(dirty, dompurifyOption) {
  let clone = JSON.parse(JSON.stringify(dirty));

  if (clone instanceof Array) {
    for (let i = 0; i < clone.length; i++) {
      clone[i] = sanitized(clone[i], dompurifyOption);
    }
  } else if (clone instanceof Object) {
    for (let key of Object.keys(clone)) {
      clone[key] = sanitized(clone[key], dompurifyOption);
    }
  } else if (typeof clone === "string") {
    clone = he.decode(dompurify.sanitize(dirty, dompurifyOption));
  }

  return clone;
}

module.exports = sanitized;
