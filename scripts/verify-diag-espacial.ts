import { readFileSync } from "fs";

const b = JSON.parse(readFileSync("src/lib/psicotecnicas/bancoTipos.json", "utf8"));
const figs = readFileSync("src/components/psicotecnicas/AbstractFigures.tsx", "utf8");
const d = b.tipos.find((t: { id: string }) => t.id === "razonamiento-diagramatico");
const e = b.tipos.find((t: { id: string }) => t.id === "razonamiento-espacial");

const pairs = [...d.items, ...e.items].map((i: { figura?: string; enunciado: string; pasos: string[] }) => ({
  figura: i.figura,
  q: i.enunciado.split("\n")[0].slice(0, 70),
  paso0: i.pasos[0]?.slice(0, 80),
}));

const ids = [...new Set(pairs.map((p) => p.figura).filter(Boolean))];
const miss = ids.filter((id) => !figs.includes(`"${id}"`));

const letter = d.items.find((i: { enunciado: string }) => /A→C/i.test(i.enunciado));
console.log("LETTER CASE:", { figura: letter?.figura, paso0: letter?.pasos[0], q: letter?.enunciado.split("\n")[0] });
console.log("ESP MAP:", e.items.find((i: { enunciado: string }) => /Mapa/i.test(i.enunciado))?.figura);
console.log("ESP ARISTAS:", e.items.find((i: { enunciado: string }) => /aristas/i.test(i.enunciado))?.figura);
console.log("ESP 2CUBOS:", e.items.find((i: { enunciado: string }) => /2 cubos/i.test(i.enunciado))?.figura);
console.log({ miss, idsCount: ids.length });
if (miss.length || letter?.figura !== "diag-letras") process.exit(1);
