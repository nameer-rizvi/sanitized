import he from "he";
import DOMPurify from "isomorphic-dompurify";

type Config = Omit<
  Parameters<typeof DOMPurify.sanitize>[1] & object,
  "RETURN_TRUSTED_TYPE"
>;

/**
 * Recursively sanitizes an input value against XSS attacks and decodes HTML entities.
 * Arrays and plain objects are traversed and sanitized deeply.
 * Non-string primitives are returned as-is.
 * @example
 * sanitized("<img src=x onerror=alert(1)//>")                                         // '<img src="x">'
 * sanitized(["<svg><g/onload=alert(2)//<p>"])                                         // ['<svg><g></g></svg>']
 * sanitized([["<p>abc<iframe//src=jAva&Tab;script:alert(3)>def</p>"]])                // [['<p>abc</p>']]
 * sanitized({test:'<math><mi//xlink:href="data:x,<script>alert(4)</script>">'})       // {test:'<math><mi></mi></math>'}
 * sanitized([{ test: "<TABLE><tr><td>HELLO</tr></TABL>" }])                           // [{test:'<table><tbody><tr><td>HELLO</td></tr></tbody></table>'}]
 * sanitized([[{test:[[{test:"<UL><li><A HREF=//google.com>click</UL>"}]]}]])          // [[{test:[[{test:'<ul><li><a href="//google.com">click</a></li></ul>'}]]}]]
 * sanitized(42)                                                                       // 42
 * sanitized(null)                                                                     // null
 * sanitized(undefined)                                                                // undefined
 */
function sanitized<T>(input: T, options: Config = {}): T {
  if (Array.isArray(input)) {
    const result = [];
    for (const item of input) result.push(sanitized(item, options));
    return result as T;
  }

  if (input !== null && typeof input === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input))
      result[key] = sanitized(value, options);
    return result as T;
  }

  if (typeof input === "string") {
    return he.decode(DOMPurify.sanitize(input, options)) as T;
  }

  return input;
}

export default sanitized;
