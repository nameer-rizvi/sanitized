const he = require("he");
const DOMPurify = require("dompurify");

module.exports = (value) => {
  function jsdomSanitize(createDOMPurify, value) {
    const { JSDOM } = require("jsdom");
    const window = new JSDOM("").window;
    const DOMPurify = createDOMPurify(window);
    return he.decode(DOMPurify.sanitize(value));
  }
  return DOMPurify.sanitize
    ? he.decode(DOMPurify.sanitize(value))
    : jsdomSanitize(DOMPurify, value);
};
