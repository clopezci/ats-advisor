/**
 * Regenera pasos de cálculo mental a×b / a÷b con técnicas (no «multiplica y ya»).
 * Uso: npx tsx scripts/patch-calculo-mental-explain.ts
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import {
  explainSimpleBinary,
  isWeakMulExplain,
} from "../src/lib/psicotecnicas/explainMentalMul";

const path = join(process.cwd(), "src/lib/psicotecnicas/bancoTipos.json");
const bank = JSON.parse(readFileSync(path, "utf8")) as {
  tipos: Array<{
    id: string;
    items: Array<{ enunciado: string; respuesta: string; pasos: string[] }>;
  }>;
};

const tipo = bank.tipos.find((t) => t.id === "calculo-mental");
if (!tipo) {
  console.error("No calculo-mental");
  process.exit(1);
}

let patched = 0;
let skipped = 0;
for (const item of tipo.items) {
  const next = explainSimpleBinary(item.enunciado);
  if (!next) {
    skipped += 1;
    continue;
  }
  // Siempre regenerar ops simples; mejora también las que ya tenían un atajo flojo
  if (isWeakMulExplain(item.pasos) || true) {
    const before = item.pasos.join(" | ");
    item.pasos = next;
    if (before !== next.join(" | ")) patched += 1;
  }
}

writeFileSync(path, JSON.stringify(bank, null, 2) + "\n", "utf8");
console.log(`patched ${patched} items; non-binary skipped ${skipped}; total ${tipo.items.length}`);

// Spot-check
for (const sample of ["15 × 14 = ?", "125 × 0,4 = ?", "64 × 0,25 = ?", "36 × 1,5 = ?", "9 × 6 = ?"]) {
  console.log("\n" + sample);
  console.log((explainSimpleBinary(sample) || []).map((p, i) => `${i + 1}. ${p}`).join("\n"));
}
