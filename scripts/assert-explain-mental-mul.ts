import assert from "node:assert/strict";
import {
  explainSimpleBinary,
  parseSimpleBinaryOp,
} from "../src/lib/psicotecnicas/explainMentalMul";

const mul15 = explainSimpleBinary("15 × 14 = ?")!;
assert.ok(mul15.some((p) => /mitad|dobla|15/i.test(p)), mul15.join(" | "));
assert.ok(mul15.some((p) => /210/.test(p)));

const dec = explainSimpleBinary("125 × 0,4 = ?")!;
assert.ok(dec.some((p) => /2\/5|÷ 5|0,4/i.test(p)), dec.join(" | "));
assert.ok(dec.some((p) => /\b50\b/.test(p)));

const q = explainSimpleBinary("64 × 0,25 = ?")!;
assert.ok(q.some((p) => /÷ 4|1\/4/.test(p)));
assert.ok(q.some((p) => /\b16\b/.test(p)));

const oneFive = explainSimpleBinary("36 × 1,5 = ?")!;
assert.ok(oneFive.some((p) => /mitad/i.test(p)));
assert.ok(oneFive.some((p) => /\b54\b/.test(p)));

assert.equal(parseSimpleBinaryOp("80 × 0,4 = ?\n\nA) 1")?.b, 0.4);
assert.equal(explainSimpleBinary("12 ÷ 3 + 4 × 2 = ?"), null);

console.log("explainMentalMul ok");
