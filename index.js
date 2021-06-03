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
    console.error("[sanitized] " + error.toString());
  }
}

function handleDirtyValue(dirty, DOMPurifyOptions, callback) {
  try {
    if (dirty && dirty.constructor === String)
      return sanitizer(dirty, DOMPurifyOptions);

    if (dirty && dirty.constructor === Array) {
      let clone = [].concat(dirty);
      for (let i = 0; i < clone.length; i++) {
        clone[i] = handleDirtyValue(clone[i], DOMPurifyOptions);
      }
      return clone;
    }

    if (dirty && dirty.constructor === Object) {
      let clone = JSON.parse(JSON.stringify(dirty));
      let cloneKeys = Object.keys(clone);
      for (let j = 0; j < cloneKeys.length; j++) {
        const cloneKey = cloneKeys[j];
        clone[cloneKey] = handleDirtyValue(clone[cloneKey], DOMPurifyOptions);
      }
      return clone;
    }

    return dirty;
  } catch (err) {
    if (callback) callback(err);
    return dirty;
  }
}

module.exports = handleDirtyValue;
