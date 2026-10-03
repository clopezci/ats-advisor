import { readFileSync } from "fs";

const b = JSON.parse(readFileSync("src/lib/psicotecnicas/bancoTipos.json", "utf8"));
const figsSrc = readFileSync("src/components/psicotecnicas/AbstractFigures.tsx", "utf8");
const e = b.tipos.find((t: { id: string }) => t.id === "razonamiento-espacial");
const d = b.tipos.find((t: { id: string }) => t.id === "razonamiento-diagramatico");

const stems = e.items.map((i: { enunciado: string }) => i.enunciado.split("\n")[0]);
const unique = new Set(stems).size;
const figs = [...new Set(e.items.map((i: { figura?: string }) => i.figura).filter(Boolean))];
const miss = figs.filter((id) => !figsSrc.includes(`"${id}"`));
const netish = e.items.filter((i: { enunciado: string; figura?: string }) =>
  /net|desarm|dado|opuesta|2×2|en T|cruz|hexomin/i.test(i.enunciado + " " + (i.figura || ""))
).length;

console.log({
  espacial: { total: e.items.length, unique, miss, netish },
  diagramatico: d.items.length,
});
if (unique !== e.items.length || miss.length || e.items.length < 40) process.exit(1);
