import assert from "node:assert/strict";
import {
  explainCalculoMental,
  explainSimpleBinary,
  parsePercentOf,
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

const five = explainCalculoMental("5% de 120 = ?")!;
assert.ok(five.some((p) => /10%/.test(p)), five.join(" | "));
assert.ok(five.some((p) => /÷ 2|mitad/i.test(p)), five.join(" | "));
assert.ok(!five.some((p) => /0,05/.test(p)), "no usar 0,05: " + five.join(" | "));
assert.ok(five.some((p) => /\b6\b/.test(p)));

assert.equal(parsePercentOf("12,5% de 80 = ?")?.pct, 12.5);
const p125 = explainCalculoMental("12,5% de 80 = ?")!;
assert.ok(p125.some((p) => /÷ 8|25%/.test(p)));
assert.ok(p125.some((p) => /\b10\b/.test(p)));

console.log("explainMentalMul ok");
