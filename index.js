const DOMPurify = require("dompurify");
const he = require("he");

let sanitizer = (dirty) => dirty;

if (DOMPurify.sanitize) {
  sanitizer = (dirty, options) => he.decode(DOMPurify.sanitize(dirty, options));
} else {
  try {
    const jsdom = require("jsdom");
    const JSDOM = new jsdom.JSDOM("<!DOCTYPE html>");
    const DOMPurifyWindow = DOMPurify(JSDOM.window);
    sanitizer = (dirty, options) =>
      he.decode(DOMPurifyWindow.sanitize(dirty, options));
  } catch (error) {
    console.error(error);
  }
}

function sanitized(dirty, DOMPurifyOptions, errorCallback) {
  try {
    let clone = JSON.parse(JSON.stringify(dirty));

    if (typeof clone === "string") clone = sanitizer(clone, DOMPurifyOptions);

    if (clone instanceof Array)
      for (let i = 0; i < clone.length; i++)
        clone[i] = sanitized(clone[i], DOMPurifyOptions);

    if (clone instanceof Object)
      for (let cloneKey of Object.keys(clone))
        clone[cloneKey] = sanitized(clone[cloneKey], DOMPurifyOptions);

    return clone;
  } catch (err) {
    if (errorCallback) errorCallback(err);

    return dirty;
  }
}

module.exports = sanitized;
