/**
 * Segunda pasada cálculo mental: quita "EXPLICACIÓN/Solución UI" del enunciado,
 * elimina duplicados "mismo ítem que", normaliza opciones.
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

type Item = { enunciado: string; respuesta: string; pasos: string[]; figura?: string };

function extractExpression(enunciado: string): string | null {
  const lines = enunciado
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean)
    .filter(
      (l) =>
        !/^Elija/i.test(l) &&
        !/^EXPLICACI/i.test(l) &&
        !/^Soluci[oó]n UI/i.test(l) &&
        !/^Opciones/i.test(l) &&
        !/^Si el desconocido/i.test(l) &&
        !/mismo [ií]tem que/i.test(l),
    );

  // Prefer line with = ? or clear arithmetic
  const withQ = lines.find((l) => /=\s*\?/.test(l) || /\?\s*[÷×*/=]/.test(l) || /[÷×*/].*=/.test(l));
  if (withQ) return withQ.replace(/\([^)]*o\s*\?[^)]*\)/gi, "").trim();

  // Fallback: first math-looking line
  const math = lines.find((l) => /\d/.test(l) && /[+\-−×÷*/()=?]/.test(l) && l.length < 120);
  return math || null;
}

function extractOptions(enunciado: string): string[] | null {
  const m = enunciado.match(/Opciones:\s*([^\n]+)/i);
  if (!m) return null;
  let raw = m[1]
    .replace(/[….]/g, " ")
    .replace(/[A-E]\)\s*/gi, "")
    .trim();
  // Patterns like "B) 5" already stripped letters
  const parts = raw
    .split(/[|,]/)
    .map((p) => p.trim())
    .filter((p) => p && !/^opcion/i.test(p) && p !== "…" && p.length < 40);
  const nums = parts.filter((p) => /^[-−]?\d+(\.\d+)?$|^[-−]?\d+\/\d+$/.test(p.replace(/,/g, "")));
  if (nums.length >= 3) return nums.slice(0, 5);
  return null;
}

function normalizeAnswer(r: string): string {
  return String(r)
    .replace(/^[A-E]\)\s*/i, "")
    .replace(/,/g, "")
    .replace(/−/g, "-")
    .trim();
}

function main() {
  const path = join(process.cwd(), "src/lib/psicotecnicas/bancoTipos.json");
  const banco = JSON.parse(readFileSync(path, "utf8"));
  const tipo = banco.tipos.find((t: { id: string }) => t.id === "calculo-mental");
  const before = tipo.items.length;
  const out: Item[] = [];
  const report: string[] = [];
  let deleted = 0;
  let cleaned = 0;

  for (const raw of tipo.items as Item[]) {
    const e = raw.enunciado;
    const dirty =
      /EXPLICACI[ÓO]N\s*\(/i.test(e) ||
      /Soluci[oó]n UI/i.test(e) ||
      /mismo [ií]tem que/i.test(e) ||
      /enunciado reconstruido/i.test(e);

    if (/mismo [ií]tem que/i.test(e)) {
      deleted++;
      report.push(`DEL mismo-item: ${e.slice(0, 90)}`);
      continue;
    }

    if (!dirty) {
      out.push(raw);
      continue;
    }

    const expr = extractExpression(e);
    if (!expr) {
      deleted++;
      report.push(`DEL no-expr: ${e.slice(0, 90)}`);
      continue;
    }

    const opts = extractOptions(e);
    const respuesta = normalizeAnswer(raw.respuesta);
    let enunciado: string;
    if (opts && opts.length >= 3) {
      // Ensure answer is among options; if not, still keep open? Prefer MC
      enunciado = `Elija la respuesta correcta.\n\n${expr.replace(/=\s*\?\s*$/, "").trim()} = ?\n\nOpciones: ${opts.join(" | ")}`;
    } else {
      const body = /=\s*\?/.test(expr) ? expr : `${expr.replace(/[.\s]+$/, "")} = ?`;
      enunciado = `Calcula:\n\n${body}`;
    }

    // Strip spoiler pasos that only say Solución UI
    let pasos = (raw.pasos || []).filter((p) => !/^Soluci[oó]n UI/i.test(p));
    if (pasos.length === 0) pasos = [`Resultado: ${respuesta}.`];

    out.push({ enunciado, respuesta, pasos, ...(raw.figura ? { figura: raw.figura } : {}) });
    cleaned++;
    report.push(`CLEAN: ${expr.slice(0, 60)} => ${respuesta}`);
  }

  // Dedup
  const seen = new Set<string>();
  const deduped: Item[] = [];
  for (const it of out) {
    const key = it.enunciado.replace(/\s+/g, " ").toLowerCase();
    if (seen.has(key)) {
      deleted++;
      report.push(`DEL dup: ${it.enunciado.slice(0, 60)}`);
      continue;
    }
    seen.add(key);
    deduped.push(it);
  }

  tipo.items = deduped;
  writeFileSync(path, JSON.stringify(banco, null, 2) + "\n", "utf8");
  console.log(`${before} → ${deduped.length} (deleted=${deleted}, cleaned=${cleaned})`);
  console.log(report.join("\n"));
}

main();
