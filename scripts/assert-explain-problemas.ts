import assert from "node:assert/strict";
import { explainProblemaMatematico } from "../src/lib/psicotecnicas/explainProblemas";

const pipes = explainProblemaMatematico("A llena en 6 h y B en 8 h. ¿Cuánto tardan juntas?")!;
assert.ok(pipes.some((p) => /\(A × B\) ÷ \(A \+ B\)/.test(p)));

const workers = explainProblemaMatematico(
  "Si 10 obreros terminan en 8 días, ¿cuántos días tardan 16 (mismo ritmo)?"
)!;
assert.ok(workers.some((p) => /regla de 3 inversa/i.test(p)));
assert.ok(workers.some((p) => /\b5\b/.test(p)));

const avg = explainProblemaMatematico("Las notas 3, 4 y 5. ¿Promedio?")!;
assert.ok(avg.some((p) => /4/.test(p)));

const meet = explainProblemaMatematico(
  "Dos trenes a 60 y 40 km/h se acercan desde 200 km. ¿En cuántas horas se encuentran?"
)!;
assert.ok(meet.some((p) => /100/.test(p) && /2/.test(p)));

const age = explainProblemaMatematico(
  "Hoy Ana tiene 20 y su madre 44. ¿En cuántos años la madre tendrá el doble de la edad de Ana?"
)!;
assert.ok(age.some((p) => /\bx = 4\b|\b4\./.test(p) || /x = 4/.test(p)));

console.log("explainProblemas ok");
