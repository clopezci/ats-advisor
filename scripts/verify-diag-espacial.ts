import { readFileSync } from "fs";

const b = JSON.parse(readFileSync("src/lib/psicotecnicas/bancoTipos.json", "utf8"));
const figs = readFileSync("src/components/psicotecnicas/AbstractFigures.tsx", "utf8");
const d = b.tipos.find((t: { id: string }) => t.id === "razonamiento-diagramatico");
const e = b.tipos.find((t: { id: string }) => t.id === "razonamiento-espacial");

const ids = [...new Set([...d.items, ...e.items].map((i: { figura?: string }) => i.figura).filter(Boolean))];
const miss = ids.filter((id) => !figs.includes(`"${id}"`));

console.log("net item figura:", e.items[14].figura);
console.log("escalera figura:", e.items[15].figura);
console.log({ ids, miss, descD: d.descripcion, descE: e.descripcion });
if (miss.length) process.exit(1);
