const sanitizer = require("./sanitizer");

module.exports = (value) => {
  const handlers = {
    string: (str) => (str ? sanitizer(str).trim() : ""),
    array: (arr) => {
      var clone = [].concat(arr);
      clone.forEach((item, index) => (clone[index] = module.exports(item)));
      return clone;
    },
    object: (obj) => {
      var clone = JSON.parse(JSON.stringify(obj));
      Object.keys(clone).forEach(
        (key) => (clone[key] = module.exports(clone[key]))
      );
      return clone;
    },
  };
  return value
    ? value.constructor === String
      ? handlers.string(value)
      : value.constructor === Array
      ? handlers.array(value)
      : value.constructor === Object
      ? handlers.object(value)
      : value
    : value;
};
