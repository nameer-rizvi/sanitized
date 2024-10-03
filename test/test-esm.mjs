import sanitized from "../dist/index.js";
import sample from "./sample.json" assert { type: "json" };
console.log(sanitized(sample));
