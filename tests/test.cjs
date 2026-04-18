const sanitized = require("../dist/cjs/index.js");

console.log([
  sanitized("<img src=x onerror=alert(1)//>"),
  sanitized(["<svg><g/onload=alert(2)//<p>"]),
  sanitized([["<p>abc<iframe//src=jAva&Tab;script:alert(3)>def</p>"]]),
  sanitized({
    test: '<math><mi//xlink:href="data:x,<script>alert(4)</script>">',
  }),
  sanitized([{ test: "<TABLE><tr><td>HELLO</tr></TABL>" }]),
  sanitized([
    [{ test: [[{ test: "<UL><li><A HREF=//google.com>click</UL>" }]] }],
  ]),
  sanitized(42),
  sanitized(null),
  sanitized(undefined),
]);
