const sanitizer = require("./sanitizer");

module.exports = (value) => {
  const handle = {
    string: (str) => (str ? sanitizer(str).trim() : ""),
    array: (arr) => {
      var clone = [].concat(arr);
      for (var i = clone.length - 1; i >= 0; i--) {
        clone[i] = module.exports(clone[i]);
      }
      return clone;
    },
    object: (obj) => {
      var clone = JSON.parse(JSON.stringify(obj));
      const cloneKeys = Object.keys(clone);
      for (var i = cloneKeys.length - 1; i >= 0; i--) {
        const cloneKey = cloneKeys[i];
        clone[cloneKey] = module.exports(clone[cloneKey]);
      }
      return clone;
    },
  };
  return value
    ? value.constructor === String
      ? handle.string(value)
      : value.constructor === Array
      ? handle.array(value)
      : value.constructor === Object
      ? handle.object(value)
      : value
    : value;
};
