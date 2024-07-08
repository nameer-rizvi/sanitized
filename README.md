# sanitized

sanitized() is a recursive function that'll sanitize a string or ALL strings in a json input. It's great for sanitizing form data before it gets submitted to the back-end (re: protection against XSS attacks).

It accepts two params the first being the value to sanitize, and the second being options to pass to [DOMPurify](https://www.npmjs.com/package/dompurify).

## Installation

```console
npm i sanitized
```

### Node v16 Support

```console
npm i sanitized@1.2.1
```

## Usage

```javascript
const sanitized = require("sanitized");
// or,
// import sanitized from "sanitized"

const test = [
  "<svg><g/onload=alert(2)//<p>",
  {
    name1: [
      '<math><mi//xlink:href="data:x,<script>alert(4)</script>">',
      { name2: "<p>abc<iframe//src=jAva&Tab;script:alert(3)>def" },
    ],
  },
];

sanitized(test);

// Result:
//
// [
//  "<svg><g></g></svg>",
//  { name1: ["<math><mi></mi></math>", { name2: "<p>abc</p>" }] }
// ];
```
