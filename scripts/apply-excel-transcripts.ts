/**
 * Aplica transcripts del Excel (fotos → texto) al bancoTipos.json.
 * Uso: npx tsx scripts/apply-excel-transcripts.ts
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

type Raw = {
  enunciado: string;
  respuesta?: string;
  pasos?: string | string[];
  fuente?: string;
  figuraHint?: string;
};

type Item = { enunciado: string; respuesta: string; pasos: string[]; figura?: string };

function loadArr(file: string): Raw[] {
  const p = join(process.cwd(), "scripts/transcripts", file);
  if (!existsSync(p)) {
    console.warn("missing", file);
    return [];
  }
  return JSON.parse(readFileSync(p, "utf8")) as Raw[];
}

function normPasos(p: string | string[] | undefined): string[] {
  if (!p) return ["Revisa el enunciado.", "Aplica la regla paso a paso.", "Atajo: descarta opciones imposibles primero."];
  if (Array.isArray(p)) return p.length ? p : ["Atajo: lee con cuidado."];
  const parts = p
    .split(/(?<=\.)\s+|(?=Atajo:)/)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length ? parts : [p];
}

function normRespuesta(r: string, enunciado: string): string {
  const t = (r || "").trim();
  if (!t || /^N\/A$/i.test(t)) return "";
  if (/^[A-E]\)/i.test(t)) return t;
  const lines = enunciado.split("\n");
  for (const line of lines) {
    const m = line.match(/^([A-E])\)\s*(.+)$/i);
    if (m && (m[2].trim() === t || m[2].includes(t) || t.includes(m[2].trim()))) {
      return `${m[1].toUpperCase()}) ${m[2].trim()}`;
    }
  }
  if (/^[A-E]$/i.test(t)) {
    const re = new RegExp(`^${t}\\)\\s*(.+)$`, "im");
    const m = enunciado.match(re);
    if (m) return `${t.toUpperCase()}) ${m[1].trim()}`;
    return `${t.toUpperCase()})`;
  }
  return t;
}

function hintToFigura(hint?: string, block?: string): string | undefined {
  if (!hint) return undefined;
  const h = hint.toLowerCase();
  if (block === "espacial") {
    if (/net|despliegue|cruz/.test(h)) return "espacial-net-cruz";
    if (/dado|puntos/.test(h)) return "dado-opuestos-7";
    if (/pintad|3×3|3x3/.test(h)) return "espacial-cubo-pintado";
  }
  if (block === "diagramatico") {
    if (/reloj|manecilla/.test(h)) return "espacial-reloj";
    if (/operador|barra/.test(h)) return "diag-operador";
    if (/set a|set b/.test(h)) return "diag-impar";
  }
  if (block === "inductivo") return "seq-diferencias";
  if (block === "secuencias") return "seq-diferencias";
  return undefined;
}

function isInstructionOnly(enunciado: string, respuesta: string): boolean {
  if (!respuesta) return true;
  const e = enunciado.toLowerCase();
  if (/^descripci[oó]n\b/.test(e) && enunciado.length < 200) return true;
  if (/instrucciones del test|pantalla de instrucciones/.test(e) && enunciado.length < 300) return true;
  return false;
}

function toItems(raw: Raw[], block: string): Item[] {
  const out: Item[] = [];
  const seenFuente = new Set<string>();
  for (const r of raw) {
    const enunciado = (r.enunciado || "").trim();
    const respuesta = normRespuesta(r.respuesta || "", enunciado);
    if (isInstructionOnly(enunciado, respuesta)) continue;
    if (enunciado.length < 20) continue;
    const key = r.fuente || enunciado.slice(0, 200);
    if (seenFuente.has(key)) continue;
    seenFuente.add(key);
    out.push({
      enunciado,
      respuesta,
      pasos: normPasos(r.pasos),
      figura: hintToFigura(r.figuraHint, block),
    });
  }
  return out;
}

const blocks: Array<{ id: string; desc: string; files: string[]; tag: string }> = [
  {
    id: "razonamiento-inductivo",
    desc: "Transcrito del Excel (imágenes→texto): series de figuras y patrones. Sin fotos embebidas.",
    files: ["inductivo.json"],
    tag: "inductivo",
  },
  {
    id: "razonamiento-verbal",
    desc: "Transcrito del Excel: comprensión V/F/No se puede determinar.",
    files: ["verbal.json"],
    tag: "verbal",
  },
  {
    id: "secuencias-numericas",
    desc: "Transcrito del Excel: series numéricas de las capturas.",
    files: ["secuencias.json"],
    tag: "secuencias",
  },
  {
    id: "razonamiento-espacial",
    desc: "Transcrito del Excel: nets, dados y rotaciones en texto (+ figura cuando aplica).",
    files: ["espacial.json"],
    tag: "espacial",
  },
  {
    id: "razonamiento-diagramatico",
    desc: "Transcrito del Excel: sets, operadores y series diagramáticas en texto.",
    files: ["diagramatico.json"],
    tag: "diagramatico",
  },
  {
    id: "razonamiento-numerico",
    desc: "Transcrito del Excel: tablas, porcentajes y datos de las capturas.",
    files: ["numerico-01-40.json", "numerico-41-80.json"],
    tag: "numerico",
  },
  {
    id: "analogias",
    desc: "Transcrito del Excel: analogías.",
    files: ["analogias.json"],
    tag: "analogias",
  },
  {
    id: "antonimos",
    desc: "Transcrito del Excel: antónimos.",
    files: ["antonimos.json"],
    tag: "antonimos",
  },
  {
    id: "calculo-mental",
    desc: "Transcrito del Excel: cálculo mental.",
    files: ["calculo-01-51.json", "calculo-52-102.json"],
    tag: "calculo",
  },
  {
    id: "problemas-matematicos",
    desc: "Transcrito del Excel: problemas matemáticos.",
    files: ["problemas.json"],
    tag: "problemas",
  },
];

const path = join(process.cwd(), "src/lib/psicotecnicas/bancoTipos.json");
const bank = JSON.parse(readFileSync(path, "utf8")) as {
  tipos: Array<{ id: string; descripcion: string; items: Item[] }>;
};

const summary: Record<string, number> = {};
for (const b of blocks) {
  const raw = b.files.flatMap((f) => loadArr(f));
  const items = toItems(raw, b.tag);
  const t = bank.tipos.find((x) => x.id === b.id);
  if (!t) {
    console.warn("tipo no encontrado", b.id);
    continue;
  }
  t.descripcion = b.desc;
  t.items = items;
  summary[b.id] = items.length;
}

writeFileSync(path, JSON.stringify(bank, null, 2) + "\n", "utf8");
console.log(summary);
