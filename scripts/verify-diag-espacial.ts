import { readFileSync } from "fs";

const b = JSON.parse(readFileSync("src/lib/psicotecnicas/bancoTipos.json", "utf8"));
const figsSrc = readFileSync("src/components/psicotecnicas/AbstractFigures.tsx", "utf8");
const d = b.tipos.find((t: { id: string }) => t.id === "razonamiento-diagramatico");

const stems = d.items.map((i: { enunciado: string }) => i.enunciado.split("\n")[0]);
const unique = new Set(stems).size;
const figs = [...new Set(d.items.map((i: { figura?: string }) => i.figura).filter(Boolean))];
const miss = figs.filter((id) => !figsSrc.includes(`"${id}"`));

console.log({
  total: d.items.length,
  unique,
  miss,
  first: stems[0],
  item7: stems[6],
  last: stems[stems.length - 1],
});

if (unique !== d.items.length) {
  console.error("Hay repeticiones");
  process.exit(1);
}
if (miss.length) {
  console.error("Figuras faltantes", miss);
  process.exit(1);
}
if (d.items.length < 40) {
  console.error("Demasiados pocos ítems");
  process.exit(1);
}
