const DOMPurify = require("dompurify");
const { decode } = require("he");

let sanitizer = (dirty) => dirty;

if (DOMPurify.sanitize) {
  sanitizer = (dirty, options) => decode(DOMPurify.sanitize(dirty, options));
} else {
  try {
    const { JSDOM } = require("jsdom");
    const { window } = new JSDOM("<!DOCTYPE html>");
    DOMPurifyWindow = DOMPurify(window);
    sanitizer = (dirty, options) =>
      decode(DOMPurifyWindow.sanitize(dirty, options));
  } catch (error) {
    console.error(error);
  }
}

function sanitize(dirty, DOMPurifyOptions, callback) {
  try {
    if (typeof dirty === "string")
      return sanitizer(dirty, DOMPurifyOptions, callback);

    if (dirty && dirty.constructor === Array) {
      let clone = [].concat(dirty);
      for (let i = 0; i < clone.length; i++) {
        clone[i] = sanitize(clone[i], DOMPurifyOptions, callback);
      }
      return clone;
    }

    if (dirty && dirty.constructor === Object) {
      let clone = JSON.parse(JSON.stringify(dirty));
      let cloneKeys = Object.keys(clone);
      for (let i = 0; i < cloneKeys.length; i++) {
        const cloneKey = cloneKeys[i];
        clone[cloneKey] = sanitize(clone[cloneKey], DOMPurifyOptions, callback);
      }
      return clone;
    }

    if (callback) callback(null, dirty);

    return dirty;
  } catch (err) {
    if (callback) callback(err);

    return dirty;
  }
}

module.exports = sanitize;
