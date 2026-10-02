/**
 * Regenera pasos de cálculo mental (× ÷ y %) con técnicas.
 * Uso: npx tsx scripts/patch-calculo-mental-explain.ts
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { explainCalculoMental } from "../src/lib/psicotecnicas/explainMentalMul";

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
  const next = explainCalculoMental(item.enunciado);
  if (!next) {
    skipped += 1;
    continue;
  }
  const before = item.pasos.join(" | ");
  item.pasos = next;
  if (before !== next.join(" | ")) patched += 1;
}

writeFileSync(path, JSON.stringify(bank, null, 2) + "\n", "utf8");
console.log(`patched ${patched}; skipped ${skipped}; total ${tipo.items.length}`);

for (const sample of [
  "5% de 120 = ?",
  "15% de 80 = ?",
  "12,5% de 80 = ?",
  "75% de 48 = ?",
  "9% de 80 = ?",
  "125 × 0,4 = ?",
]) {
  console.log("\n" + sample);
  console.log((explainCalculoMental(sample) || []).map((p, i) => `${i + 1}. ${p}`).join("\n"));
}
