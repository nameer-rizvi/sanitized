const { decode } = require("he");
const DOMPurify = require("dompurify");

module.exports = (value) => {
  const sanitizer = (str) =>
    str
      ? DOMPurify.sanitize
        ? decode(DOMPurify.sanitize(str))
        : (() => {
            const { window } = new require("jsdom").JSDOM("");
            const DOMPurifyWindow = DOMPurify(window);
            return decode(DOMPurifyWindow.sanitize(str));
          })()
      : "";

  const handlers = [
    {
      constructor: String,
      handler: sanitizer,
    },
    {
      constructor: Array,
      handler: (arr) => {
        var clone = [].concat(arr);
        for (var i = clone.length - 1; i >= 0; i--) {
          clone[i] = module.exports(clone[i]);
        }
        return clone;
      },
    },
    {
      constructor: Object,
      handler: (obj) => {
        var clone = JSON.parse(JSON.stringify(obj));
        const cloneKeys = Object.keys(clone);
        for (var i = cloneKeys.length - 1; i >= 0; i--) {
          const cloneKey = cloneKeys[i];
          clone[cloneKey] = module.exports(clone[cloneKey]);
        }
        return clone;
      },
    },
  ];

  let handler;

  for (var i = handlers.length - 1; i >= 0; i--) {
    if (value && value.constructor === handlers[i]["constructor"]) {
      handler = handlers[i].handler;
    }
  }

  return handler ? handler(value) : value;
};
