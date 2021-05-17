const DOMPurify = require("dompurify");
const { decode } = require("he");

let sanitizer = (dirty) => dirty; // default || noop

const logError = (error) => console.error("[sanitized] " + error.toString());

if (DOMPurify.sanitize) {
  sanitizer = (dirty, options) => decode(DOMPurify.sanitize(dirty, options));
} else {
  try {
    const { JSDOM } = require("jsdom");
    const { window } = new JSDOM("<!DOCTYPE html>");
    DOMPurifyWindow = DOMPurify(window);
    sanitizer = (dirty, options) => {
      console.log({ options });
      return decode(DOMPurifyWindow.sanitize(dirty, options));
    };
  } catch (error) {
    logError(error);
  }
}

function handleDirtyValue(dirty, DOMPurifyOptions) {
  if (dirty) {
    if (dirty.constructor === String) {
      return sanitizer(dirty, DOMPurifyOptions);
    } else if (dirty.constructor === Array) {
      let clone = [].concat(dirty);
      for (let i = 0; i < clone.length; i++) {
        clone[i] = handleDirtyValue(clone[i], DOMPurifyOptions);
      }
      return clone;
    } else if (dirty.constructor === Object) {
      try {
        let clone = JSON.parse(JSON.stringify(dirty));
        let cloneKeys = Object.keys(clone);
        for (let j = 0; j < cloneKeys.length; j++) {
          const cloneKey = cloneKeys[j];
          clone[cloneKey] = handleDirtyValue(clone[cloneKey], DOMPurifyOptions);
        }
        return clone;
      } catch (error) {
        logError(error);
        return dirty;
      }
    }
  } else return dirty; // return original value (null || undefined || 0)
}

module.exports = handleDirtyValue;
