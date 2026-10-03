import { readFileSync } from "fs";

const b = JSON.parse(readFileSync("src/lib/psicotecnicas/bancoTipos.json", "utf8"));
const figsSrc = readFileSync("src/components/psicotecnicas/AbstractFigures.tsx", "utf8");

const ids = [
  "razonamiento-inductivo",
  "razonamiento-numerico",
  "razonamiento-verbal",
  "secuencias-numericas",
  "razonamiento-diagramatico",
  "razonamiento-espacial",
];

let bad = 0;
for (const id of ids) {
  const t = b.tipos.find((x: { id: string }) => x.id === id);
  const stems = t.items.map((i: { enunciado: string }) => i.enunciado.split("\n")[0]);
  const unique = new Set(stems).size;
  const figs = [...new Set(t.items.map((i: { figura?: string }) => i.figura).filter(Boolean))];
  const miss = figs.filter((f) => !figsSrc.includes(`"${f}"`));
  let dupOpts = 0;
  for (const it of t.items) {
    const opts = [...it.enunciado.matchAll(/([A-D])\)\s*([^/\n]+?)(?=\s{2,}[A-D]\)|$)/g)].map((m) =>
      m[2].trim()
    );
    // simpler split
    const m = it.enunciado.match(/\n\n(.+)$/s);
    if (m) {
      const parts = m[1].split(/\s{2,}/).map((p: string) => p.replace(/^[A-D]\)\s*/, "").trim());
      if (parts.length >= 4 && new Set(parts.slice(0, 4)).size < 4) dupOpts++;
    }
  }
  console.log(id, { total: t.items.length, unique, miss: miss.length, dupOpts });
  if (unique !== t.items.length || miss.length || dupOpts) bad++;
}
if (bad) process.exit(1);
