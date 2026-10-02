/**
 * Regenera explicaciones de problemas-matematicos con atajos.
 * Uso: npx tsx scripts/patch-problemas-matematicos-explain.ts
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { explainProblemaMatematico } from "../src/lib/psicotecnicas/explainProblemas";

const path = join(process.cwd(), "src/lib/psicotecnicas/bancoTipos.json");
const bank = JSON.parse(readFileSync(path, "utf8")) as {
  tipos: Array<{
    id: string;
    descripcion?: string;
    items: Array<{ enunciado: string; respuesta: string; pasos: string[] }>;
  }>;
};

const tipo = bank.tipos.find((t) => t.id === "problemas-matematicos");
if (!tipo) {
  console.error("No problemas-matematicos");
  process.exit(1);
}

tipo.descripcion =
  "Enunciado con datos. Usa el atajo del tipo (descuento, grifos, obreros…) y comprueba.";

let patched = 0;
let failed = 0;
for (const item of tipo.items) {
  const next = explainProblemaMatematico(item.enunciado);
  if (!next) {
    failed += 1;
    console.warn("NO MATCH:", item.enunciado.split("\n")[0]);
    continue;
  }
  const before = item.pasos.join("|");
  item.pasos = next;
  if (before !== next.join("|")) patched += 1;
}

writeFileSync(path, JSON.stringify(bank, null, 2) + "\n", "utf8");
console.log(`patched ${patched}; unmatched ${failed}; total ${tipo.items.length}`);

const sample = tipo.items.find((i) => /A llena en 6 h y B en 8/.test(i.enunciado));
if (sample) {
  console.log("\n" + sample.enunciado.split("\n")[0]);
  console.log(sample.pasos.map((p, i) => `${i + 1}. ${p}`).join("\n"));
}
