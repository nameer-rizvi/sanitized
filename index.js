const he = require("he");
const DOMPurify = require("dompurify");

module.exports = value => {
  function sanitizeStr(str) {
    return str ? sanitized(str).trim() : "";
  }

  function sanitizeArr(arr) {
    var clone = [].concat(arr);

    clone.forEach((item, index) => {
      clone[index] = module.exports(item);
    });

    return clone;
  }

  function sanitizeObj(obj) {
    var clone = JSON.parse(JSON.stringify(obj));

    for (const prop in clone) {
      clone[prop] = module.exports(clone[prop]);
    }

    return clone;
  }

  return value
    ? value.constructor === String
      ? sanitizeStr(value)
      : value.constructor === Array
      ? sanitizeArr(value)
      : value.constructor === Object
      ? sanitizeObj(value)
      : value
    : value;
};

function sanitized(value) {
  return DOMPurify.sanitize
    ? he.decode(DOMPurify.sanitize(value))
    : jsdom({ createDOMPurify: DOMPurify, value });
}

function jsdom({ createDOMPurify, value }) {
  const { JSDOM } = require("jsdom");

  const window = new JSDOM("").window;
  const DOMPurify = createDOMPurify(window);

  return he.decode(DOMPurify.sanitize(value));
}
