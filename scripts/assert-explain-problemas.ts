import assert from "node:assert/strict";
import { explainProblemaMatematico } from "../src/lib/psicotecnicas/explainProblemas";

const pipes = explainProblemaMatematico("A llena en 6 h y B en 8 h. ¿Cuánto tardan juntas?")!;
assert.ok(pipes.some((p) => /\(A × B\) ÷ \(A \+ B\)/.test(p)), pipes.join(" | "));
assert.ok(pipes.some((p) => /48/.test(p) && /14/.test(p)));
assert.ok(pipes.some((p) => /3,43/.test(p)));
assert.ok(!pipes.some((p) => /1\/6|inverso/i.test(p)));

const disc = explainProblemaMatematico(
  "Un artículo vale $50.000. Con 10% de descuento. ¿cuánto pagas?"
)!;
assert.ok(disc.some((p) => /÷ 10|10%/.test(p)));
assert.ok(disc.some((p) => /45\.000|45000/.test(p.replace(/\./g, "")) || /45.000/.test(p)));

console.log("explainProblemas ok");
