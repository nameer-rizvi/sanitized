import DOMPurify from "isomorphic-dompurify";
declare function sanitized(input: any, options?: DOMPurify.Config): any;
export = sanitized;
