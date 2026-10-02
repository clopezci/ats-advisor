import assert from "node:assert/strict";
import { explainProblemaMatematico } from "../src/lib/psicotecnicas/explainProblemas";

const pipes = explainProblemaMatematico("A llena en 6 h y B en 8 h. ¿Cuánto tardan juntas?")!;
assert.ok(pipes.some((p) => /\(A × B\) ÷ \(A \+ B\)/.test(p)), pipes.join(" | "));
assert.ok(pipes.some((p) => /48/.test(p) && /14/.test(p)));
assert.ok(pipes.some((p) => /3,43/.test(p)));
assert.ok(!pipes.some((p) => /1\/6|inverso →/i.test(p)));

const workers = explainProblemaMatematico(
  "Si 10 obreros terminan en 8 días, ¿cuántos días tardan 14 (mismo ritmo)?"
)!;
assert.ok(workers.some((p) => /regla de 3 inversa/i.test(p)), workers.join(" | "));
assert.ok(workers.some((p) => /obreros viejos ÷ obreros nuevos|10 ÷ 14/.test(p)));
assert.ok(!workers.some((p) => /obrero-días/i.test(p)));

const disc = explainProblemaMatematico(
  "Un artículo vale $50.000. Con 10% de descuento. ¿cuánto pagas?"
)!;
assert.ok(disc.some((p) => /÷ 10|10%/.test(p)));

const dist = explainProblemaMatematico(
  "Recorres 4 km en 40 min. ¿Cuántos km en 1 hora al mismo ritmo?"
)!;
assert.ok(dist.some((p) => /regla de 3 directa/i.test(p)), dist.join(" | "));

console.log("explainProblemas ok");
