/**
 * Limpia cálculo mental: quita basura de transcripción, borra irrecuperables/duplicados,
 * verifica/corrige respuestas numéricas.
 *
 * Uso: npx tsx scripts/cleanup-calculo-mental.ts
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

type Item = { enunciado: string; respuesta: string; pasos: string[]; figura?: string };

const META =
  /\[(?:Solo EXPLICACI[ÓO]N[^\]]*|Opciones \+ explicación[^\]]*|Expresión en imagen[^\]]*|Pregunta no visible[^\]]*)\]\s*/gi;
const UI_LINE = /\n?(?:Opciones numeradas A–E;\s*)?UI marca[^\n]*/gi;
const RECUP =
  /\[(?:Expresión en imagen;?\s*)?recuperada[^\]]*\]\s*/gi;
const PREG_NO =
  /\[Pregunta no visible[^\]]*\]\s*/gi;

function stripMeta(s: string): string {
  return s
    .replace(META, "")
    .replace(RECUP, "")
    .replace(PREG_NO, "")
    .replace(UI_LINE, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function isIrrecuperable(enunciado: string): boolean {
  const e = enunciado.toLowerCase();
  if (/pareja de|pareja simplificada|enunciado en \d+/.test(e)) return true;
  if (/solo explicaci|ui marca|pregunta no visible|enunciado no visible/.test(e)) return true;
  if (!/[0-9]/.test(enunciado)) return true;
  return false;
}

function wasPairOrGhost(raw: string): boolean {
  // Duplicados explícitos "pareja de N" o referencias a otro ítem
  if (/pareja de|pareja simplificada|enunciado en \d+/i.test(raw)) return true;
  // Sin ninguna expresión numérica recuperable
  if (/pregunta no visible/i.test(raw) && !/\d/.test(raw.replace(/\[\d+[^\]]*\]/g, ""))) return true;
  return false;
}

/** Extrae valor numérico de respuesta tipo "E) 22" o "−449" o "1/2". */
function parseAnswer(r: string): { kind: "num" | "frac" | "text"; value: number; raw: string } | null {
  const s = String(r)
    .trim()
    .replace(/^[A-E]\)\s*/i, "")
    .replace(/,/g, "")
    .replace(/−/g, "-")
    .trim();
  if (/^-?\d+\/\d+$/.test(s)) {
    const [a, b] = s.split("/").map(Number);
    return { kind: "frac", value: a / b, raw: s };
  }
  if (/^-?\d+(\.\d+)?$/.test(s)) return { kind: "num", value: Number(s), raw: s };
  return { kind: "text", value: NaN, raw: s };
}

/** Evalúa expresiones simples del banco (cuidado: solo para verificación). */
function tryEvalExpression(enunciado: string): number | null {
  // Busca patrones "Evalúa/Calcula/Simplifica EXPR" o línea con = ?
  let expr =
    enunciado.match(
      /(?:Evalúa|Calcula|Simplifica)\s+(.+?)(?:\n|$)/i,
    )?.[1] ||
    enunciado.match(/([^\n]+?)\s*=\s*\?/)?.[1] ||
    enunciado.match(/Si el desconocido es X:\s*(.+?)(?:\n|$)/i)?.[1];

  if (!expr) return null;
  expr = expr
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/–/g, "-")
    .replace(/\{/g, "(")
    .replace(/\}/g, ")")
    .replace(/,/g, "")
    .replace(/\s+/g, "");

  // Ecuaciones con X: resolver casos lineales comunes
  if (/x/i.test(expr)) {
    return solveLinear(expr);
  }

  // Solo dígitos y operadores seguros
  if (!/^[-+*/().0-9]+$/.test(expr)) return null;
  try {
    // eslint-disable-next-line no-new-func
    const v = Function(`"use strict"; return (${expr});`)();
    return typeof v === "number" && Number.isFinite(v) ? v : null;
  } catch {
    return null;
  }
}

function solveLinear(expr: string): number | null {
  // Formas: aX/b=c | aX=b | X=a/b | aX-b+c=d | a÷X=b | a/X=b
  const e = expr.replace(/X/gi, "x");

  let m = e.match(/^(\d+(?:\.\d+)?)x\/(\d+(?:\.\d+)?)=(\d+(?:\.\d+)?)$/);
  if (m) return (Number(m[3]) * Number(m[2])) / Number(m[1]);

  m = e.match(/^(\d+(?:\.\d+)?)x=([-+]?[\d.]+(?:[-+][\d.]+)*)$/);
  if (m) {
    const rhs = safeEval(m[2]);
    if (rhs == null) return null;
    return rhs / Number(m[1]);
  }

  m = e.match(/^x=(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
  if (m) return Number(m[1]) / Number(m[2]);

  m = e.match(/^([-+]?[\d.]+)[-+](\d+(?:\.\d+)?)[-+]?x=([-+]?[\d.]+)$/);
  // 1820-64+x=829
  m = e.match(/^([\d.]+)([-−]\d+(?:\.\d+)?)?\+x=([-+]?[\d.]+)$/);
  if (m) {
    const a = Number(m[1]);
    const b = m[2] ? Number(m[2].replace("−", "-")) : 0;
    return Number(m[3]) - (a + b);
  }
  m = e.match(/^([\d.]+)-(\d+(?:\.\d+)?)\+x=([-+]?[\d.]+)$/);
  if (m) return Number(m[3]) - (Number(m[1]) - Number(m[2]));

  m = e.match(/^(\d+(?:\.\d+)?)(?:÷|\/)x=([-+]?[\d.]+(?:[-+][\d.]+)*)$/);
  if (m) {
    const rhs = safeEval(m[2].replace(/−/g, "-"));
    if (rhs == null || rhs === 0) return null;
    return Number(m[1]) / rhs;
  }

  m = e.match(/^(\d+(?:\.\d+)?)x([-+]\d+(?:\.\d+)?)=([-+]?[\d.]+)$/);
  if (m) return (Number(m[3]) - Number(m[2])) / Number(m[1]);

  return null;
}

function safeEval(s: string): number | null {
  const e = s.replace(/−/g, "-");
  if (!/^[-+*/().0-9]+$/.test(e)) {
    // allow 79-11
    if (!/^[-+0-9.]+$/.test(e.replace(/-/g, "+").replace(/\+/g, ""))) {
      try {
        if (!/^[-+0-9.]+$/.test(e) && !/^[\d+\-*/.()]+$/.test(e)) return null;
      } catch {
        return null;
      }
    }
  }
  try {
    if (!/^[\d+\-*/.()]+$/.test(e)) return null;
    const v = Function(`"use strict"; return (${e});`)();
    return typeof v === "number" && Number.isFinite(v) ? v : null;
  } catch {
    return null;
  }
}

function almostEq(a: number, b: number): boolean {
  return Math.abs(a - b) < 1e-6 || Math.abs(a - b) / Math.max(1, Math.abs(b)) < 1e-6;
}

function formatCleanEnunciado(rawClean: string, numericAnswer: string): string {
  let body = rawClean
    .replace(/^Elija la respuesta correcta\.\s*/i, "")
    .replace(/^Si el desconocido es X:\s*/i, "")
    .trim();

  // Si ya tiene opciones, conservar estilo MC
  if (/Opciones:/i.test(body)) {
    if (!/^Elija/i.test(rawClean)) {
      return `Elija la respuesta correcta.\n\n${body}`;
    }
    return `Elija la respuesta correcta.\n\n${body.replace(/^Elija la respuesta correcta\.\s*/i, "").trim()}`;
  }

  // Convertir "Evalúa/Calcula X" → expresión = ?
  body = body
    .replace(/^Evalúa\s+/i, "")
    .replace(/^Calcula\s+/i, "")
    .replace(/^Simplifica\s+/i, "")
    .replace(/[.\s]+$/g, "")
    .trim();

  if (/=\s*\?\s*$/m.test(body) || body.includes("= ?")) {
    return `Calcula:\n\n${body}`;
  }

  // Ecuaciones con X
  if (/x/i.test(body) && /=/.test(body)) {
    return `Halla el valor de X:\n\n${body}`;
  }

  // Simplificar fracción
  if (/^\d+\/\d+$/.test(body.replace(/\s/g, ""))) {
    return `Simplifica la fracción:\n\n${body}\n\nEscribe el resultado en forma reducida.`;
  }

  return `Calcula:\n\n${body} = ?`;
}

function cleanPasos(pasos: string[]): string[] {
  return pasos
    .map((p) =>
      p
        .replace(/\s*UI marca[^.]*\.?/gi, "")
        .replace(/\s*Atajo:\s*/i, " Atajo: ")
        .trim(),
    )
    .filter((p) => p.length > 0 && !/^ui marca/i.test(p));
}

function main() {
  const path = join(process.cwd(), "src/lib/psicotecnicas/bancoTipos.json");
  const banco = JSON.parse(readFileSync(path, "utf8"));
  const tipo = banco.tipos.find((t: { id: string }) => t.id === "calculo-mental");
  if (!tipo) throw new Error("calculo-mental no encontrado");

  const before = tipo.items.length;
  const kept: Item[] = [];
  const report: string[] = [];
  let deleted = 0;
  let cleaned = 0;
  let fixedAns = 0;

  for (const raw of tipo.items as Item[]) {
    const original = raw.enunciado;
    const pair = wasPairOrGhost(original);

    // Borrar duplicados "pareja de" y fantasmas sin enunciado real
    if (pair) {
      deleted++;
      report.push(`DEL pair/ghost: ${original.slice(0, 80)}`);
      continue;
    }

    let enunciado = stripMeta(original);

    // Si tras limpiar sigue basura meta → borrar
    if (isIrrecuperable(enunciado) || /solo explicaci|ui marca|pregunta no visible|enunciado no visible/i.test(enunciado)) {
      deleted++;
      report.push(`DEL dirty: ${original.slice(0, 80)}`);
      continue;
    }

    // Limpiar restos tipo "recuperada de EXPLICACIÓN"
    enunciado = enunciado
      .replace(/\[[^\]]*EXPLICACI[ÓO]N[^\]]*\]\s*/gi, "")
      .replace(/\[[^\]]*imagen[^\]]*\]\s*/gi, "")
      .trim();

    if (enunciado.length < 6 || !/[0-9]/.test(enunciado)) {
      deleted++;
      report.push(`DEL empty: ${original.slice(0, 80)}`);
      continue;
    }

    const parsed = parseAnswer(raw.respuesta);
    let respuesta = parsed?.raw ?? String(raw.respuesta).replace(/^[A-E]\)\s*/i, "").trim();

    // Verificar / corregir si podemos evaluar
    const computed = tryEvalExpression(enunciado);
    if (computed != null && parsed && (parsed.kind === "num" || parsed.kind === "frac")) {
      if (!almostEq(computed, parsed.value)) {
        if (Number.isInteger(computed) || almostEq(computed, Math.round(computed))) {
          respuesta = String(Math.round(computed));
        } else {
          respuesta = String(Math.round(computed * 1000) / 1000);
        }
        fixedAns++;
        report.push(`FIX ans: ${enunciado.slice(0, 60)} → ${parsed.raw} => ${respuesta}`);
      } else {
        respuesta = parsed.raw;
      }
    } else if (parsed) {
      respuesta = parsed.raw;
    }

    const hadMeta = original !== enunciado || /^\[/.test(original) || /UI marca/i.test(original);
    if (hadMeta) {
      enunciado = formatCleanEnunciado(enunciado, respuesta);
      cleaned++;
    } else {
      enunciado = enunciado.replace(/\[[^\]]+\]\s*/g, "").trim();
      if (!/^Elija|^Calcula|^Halla|^Simplifica/i.test(enunciado) && /Opciones:/i.test(enunciado)) {
        enunciado = `Elija la respuesta correcta.\n\n${enunciado}`;
      }
    }

    let pasos = Array.isArray(raw.pasos)
      ? [...raw.pasos]
      : String(raw.pasos || "")
          .split(/(?=\d+\))/)
          .map((s) => s.trim())
          .filter(Boolean);
    if (pasos.length === 1 && /\d+\)/.test(pasos[0])) {
      const bits = pasos[0].split(/(?=\d+\)\s)/).map((s) => s.trim()).filter(Boolean);
      if (bits.length > 1) pasos = bits;
    }
    pasos = cleanPasos(pasos);
    if (pasos.length === 0) pasos = [`Resultado: ${respuesta}.`];

    kept.push({
      enunciado,
      respuesta,
      pasos,
      ...(raw.figura ? { figura: raw.figura } : {}),
    });
  }

  // Deduplicar por enunciado normalizado
  const seen = new Set<string>();
  const deduped: Item[] = [];
  for (const it of kept) {
    const key = it.enunciado.replace(/\s+/g, " ").toLowerCase();
    if (seen.has(key)) {
      deleted++;
      report.push(`DEL dup: ${it.enunciado.slice(0, 80)}`);
      continue;
    }
    seen.add(key);
    deduped.push(it);
  }

  tipo.items = deduped;
  writeFileSync(path, JSON.stringify(banco, null, 2) + "\n", "utf8");
  console.log(`calculo-mental: ${before} → ${deduped.length} (deleted=${deleted}, cleaned=${cleaned}, fixedAns=${fixedAns})`);
  console.log(report.join("\n"));
}

main();
