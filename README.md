# sanitized

sanitized is a recursive function that'll sanitize a string or ALL values in an object or array. It's great for sanitizing form data before it gets submitted to the back-end (re: protection against XSS attacks).

It only accepts one param, no matter the constructor, and will return a sanitized version of that one param.

## Installation

```
$ npm i sanitized
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
