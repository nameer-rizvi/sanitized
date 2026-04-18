# sanitized

A recursive sanitizer for JSON inputs. Traverses nested arrays and objects, sanitizing every string value against XSS attacks using [DOMPurify](https://github.com/cure53/DOMPurify) and decoding HTML entities with [he](https://github.com/mathiasbynens/he). Ideal for sanitizing form data before submission to the back-end.

## Installation

```bash
npm install sanitized
# or
yarn add sanitized
```

### Node v16 Support

```console
npm install sanitized@1.2.1
# or
yarn add sanitized@1.2.1
```

## Usage

```javascript
const sanitized = require("sanitized").default; // commonjs
// or
import sanitized from "sanitized"; // esm
```

### Strings

```javascript
sanitized("<img src=x onerror=alert(1)//>");
// '<img src="x">'
```

### Arrays

```javascript
sanitized(["<svg><g/onload=alert(2)//<p>"]);
// ['<svg><g></g></svg>']
```

### Objects

```javascript
sanitized({
  test: '<math><mi//xlink:href="data:x,<script>alert(4)</script>">',
});
// { test: '<math><mi></mi></math>' }
```

### Nested

```javascript
sanitized([
  "<svg><g/onload=alert(2)//<p>",
  {
    name1: [
      '<math><mi//xlink:href="data:x,<script>alert(4)</script>">',
      { name2: "<p>abc<iframe//src=jAva&Tab;script:alert(3)>def" },
    ],
  },
]);
// [
//   "<svg><g></g></svg>",
//   { name1: ["<math><mi></mi></math>", { name2: "<p>abc</p>" }] }
// ]
```

### Non-string primitives

Non-string values (`number`, `boolean`, `null`, `undefined`) are returned as-is.

```javascript
sanitized(42); // 42
sanitized(null); // null
sanitized(undefined); // undefined
```

### DOMPurify options

The second parameter accepts any [DOMPurify config options](https://github.com/cure53/DOMPurify#can-i-configure-dompurify).

```javascript
sanitized("<b>hello</b>", { ALLOWED_TAGS: ["b"] }); // "<b>hello</b>"
```

## License

MIT
