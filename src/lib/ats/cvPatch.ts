import type { AtsAnalyzeResult } from "@/lib/ats/engine";
import { isJunkPhrase } from "@/lib/ats/phraseFilter";
import { textHasTerm } from "@/lib/ats/synonyms";

export type CvPatchItem = {
  id: string;
  kind: "must_have" | "keyword" | "hard_skill" | "bullet" | "format";
  label: string;
  detail: string;
};

export type CvPatchPlan = {
  items: CvPatchItem[];
  summary: string;
};

function cleanLabel(t: string) {
  return String(t || "").trim();
}

function isUsefulGap(t: string) {
  const s = cleanLabel(t);
  if (s.length < 2 || s.length > 60) return false;
  return !isJunkPhrase(s);
}

/**
 * Cambios puntuales a partir del análisis. Sin relleno.
 */
export function buildCvPatchPlan(result: AtsAnalyzeResult): CvPatchPlan {
  const items: CvPatchItem[] = [];
  let n = 0;

  for (const t of (result.mustHave?.missing || []).filter(isUsefulGap).slice(0, 6)) {
    n += 1;
    items.push({
      id: `mh_${n}`,
      kind: "must_have",
      label: cleanLabel(t),
      detail: "La oferta lo pide y en tu CV no se ve. Solo agrégalo si es cierto.",
    });
  }

  for (const t of (result.hardSkills?.missing || []).filter(isUsefulGap).slice(0, 5)) {
    if (items.some((i) => i.label.toLowerCase() === t.toLowerCase())) continue;
    n += 1;
    items.push({
      id: `hs_${n}`,
      kind: "hard_skill",
      label: cleanLabel(t),
      detail: "Herramienta o skill de la oferta. Ponla en Habilidades o en un logro real.",
    });
  }

  for (const t of (result.missingKeywords || []).filter(isUsefulGap).slice(0, 5)) {
    if (items.some((i) => i.label.toLowerCase() === t.toLowerCase())) continue;
    n += 1;
    items.push({
      id: `kw_${n}`,
      kind: "keyword",
      label: cleanLabel(t),
      detail: "Palabra de la oferta que no aparece. Úsala solo si ya la vives en el trabajo.",
    });
  }

  for (const b of (result.bulletQuality?.weakest || []).slice(0, 2)) {
    n += 1;
    items.push({
      id: `bu_${n}`,
      kind: "bullet",
      label: b.text.slice(0, 72) + (b.text.length > 72 ? "…" : ""),
      detail: b.tips[0] || "Hazla más concreta: verbo + qué hiciste + número si lo tienes.",
    });
  }

  for (const a of (result.formatAlerts || []).slice(0, 2)) {
    if (/must-have|keyword stuffing|semántic/i.test(a)) continue;
    n += 1;
    items.push({
      id: `fm_${n}`,
      kind: "format",
      label: a.slice(0, 90),
      detail: "Una columna, texto seleccionable, sin tablas raras.",
    });
  }

  const capped = items.slice(0, 12);
  const summary =
    capped.length === 0
      ? "Casi no hay huecos fuertes. Solo un repaso fino si quieres."
      : `${capped.length} ajustes puntuales (nada de reescribir el CV entero).`;

  return { items: capped, summary };
}

export function buildSurgicalCvPrompt(opts: {
  atsProfile: string;
  score: number;
  cvText: string;
  jobText: string;
  plan: CvPatchPlan;
}): string {
  const list = opts.plan.items
    .map((i, idx) => `${idx + 1}. ${i.label} — ${i.detail}`)
    .join("\n");

  return [
    "Edita este CV con cambios mínimos. No lo reescribas de cero.",
    `Perfil del portal: ${opts.atsProfile}. Puntaje actual: ${opts.score}%.`,
    "",
    "Solo puedes tocar estos puntos:",
    list || "Ninguno crítico.",
    "",
    `Oferta (recorte):\n${opts.jobText.slice(0, 1200)}`,
    "",
    `CV actual:\n${opts.cvText.slice(0, 6500)}`,
    "",
    "Cómo escribir:",
    "- Español claro, tono profesional humano (LATAM). Frases cortas.",
    "- Sin emojis, sin markdown, sin guiones tipográficos raros.",
    "- Evita clichés vacíos de LinkedIn o brochure corporativo.",
    "- No inventes cargos, fechas, logros, métricas ni herramientas.",
    "- Si un punto de la lista no se sostiene con el CV, no lo agregues; anótalo como omitido al final.",
    "- Conserva el orden de secciones y el estilo del CV original.",
    "- Viñetas con guion simple (-).",
    "",
    "Responde así:",
    "1) Primero el CV completo en texto plano (listo para Word).",
    "2) Al final, exactamente:",
    "=== CAMBIOS ===",
    "- Hecho: …",
    "- Omitido: … (si aplica)",
  ].join("\n");
}

/** Separa CV plano del bloque CAMBIOS al final. */
export function splitSurgicalCvResponse(raw: string): { cv: string; changelog: string } {
  const text = (raw || "").replace(/\r\n/g, "\n").trim();
  const marker = text.search(/\n===\s*CAMBIOS\s*===\s*\n/i);
  if (marker < 0) {
    return { cv: stripAiDecorations(text), changelog: "" };
  }
  return {
    cv: stripAiDecorations(text.slice(0, marker).trim()),
    changelog: text.slice(marker).replace(/^\n===\s*CAMBIOS\s*===\s*\n/i, "").trim(),
  };
}

/** Quita adornos típicos de respuestas IA en el cuerpo del CV. */
function stripAiDecorations(cv: string) {
  return cv
    .replace(/^#+\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/[“”«»]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/[^\S\n]{3,}/g, "  ")
    .trim();
}

export function kindLabel(kind: CvPatchItem["kind"]): string {
  switch (kind) {
    case "must_have":
      return "Indispensable";
    case "hard_skill":
      return "Skill";
    case "keyword":
      return "Palabra de la oferta";
    case "bullet":
      return "Viñeta";
    case "format":
      return "Formato";
    default:
      return kind;
  }
}

/** Detecta respuestas basura (fallback local / tips) que NO son un CV. */
export function isFakeCvRewrite(text: string, originalCv: string): boolean {
  const t = (text || "").trim();
  if (!t) return true;
  if (/sin claves ia online|aplica este patr[oó]n|disclaimer:\s*esto es un apoyo/i.test(t)) return true;
  if (/^checklist de buena postulación/i.test(t)) return true;
  // Muy corto vs el CV original → no es reescritura
  if (originalCv.length > 800 && t.length < Math.min(600, originalCv.length * 0.25)) return true;
  // No parece tener secciones de CV
  const looksLikeCv =
    /experiencia|educaci[oó]n|habilidades|skills|perfil|resumen|@|linkedin/i.test(t) &&
    t.split("\n").filter((l) => l.trim()).length >= 8;
  return !looksLikeCv;
}

/**
 * Parche local sin IA: inserta skills/keywords faltantes en bloque Habilidades
 * (solo términos que el plan marcó). No reescribe experiencia ni inventa logros.
 */
export function applyLocalSurgicalPatch(
  cvText: string,
  plan: CvPatchPlan
): { cv: string; changelog: string; applied: string[]; omitted: string[] } {
  const applied: string[] = [];
  const omitted: string[] = [];
  let cv = cvText.replace(/\r\n/g, "\n");

  const skillLabels = plan.items
    .filter((i) => i.kind === "hard_skill" || i.kind === "keyword" || i.kind === "must_have")
    .map((i) => i.label.trim())
    .filter((l) => l.length >= 2 && l.length <= 40 && !isJunkPhrase(l));

  const toInsert: string[] = [];
  const cvNorm = cv
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
  for (const label of skillLabels) {
    if (cv.toLowerCase().includes(label.toLowerCase())) {
      omitted.push(`${label} (ya aparece en el CV)`);
      continue;
    }
    if (label.split(/\s+/).length > 4) {
      omitted.push(`${label} (revisión manual: frase larga)`);
      continue;
    }
    // Solo hace visible el término del aviso si el CV YA tiene evidencia (sinónimo/relacionado).
    if (textHasTerm(cvNorm, label)) {
      toInsert.push(label);
      continue;
    }
    omitted.push(`${label} (manual: agrégalo solo si es verdad en tu experiencia)`);
  }

  for (const item of plan.items) {
    if (item.kind === "bullet" || item.kind === "format") {
      omitted.push(`${item.label.slice(0, 60)} (hazlo tú a mano)`);
    }
  }

  if (toInsert.length) {
    const skillsBlock = `\nHabilidades (alineadas a la vacante)\n${toInsert.map((s) => `- ${s}`).join("\n")}\n`;
    const skillsHeader =
      /(?:^|\n)(habilidades|skills|competencias|tecnolog[ií]as)([^\n]*)\n/i.exec(cv);
    if (skillsHeader && skillsHeader.index != null) {
      const insertAt = skillsHeader.index + skillsHeader[0].length;
      const existingLine = cv.slice(insertAt).split("\n")[0] || "";
      // Prefiere agregar al final del bloque skills (hasta próxima sección)
      const rest = cv.slice(insertAt);
      const nextSec = rest.search(
        /\n(?:experiencia|educaci[oó]n|estudios|idiomas|certific|proyectos|perfil)\b/i
      );
      const blockEnd = nextSec >= 0 ? insertAt + nextSec : cv.length;
      const addition = toInsert.map((s) => `- ${s}`).join("\n") + "\n";
      cv = cv.slice(0, blockEnd) + (cv[blockEnd - 1] === "\n" ? "" : "\n") + addition + cv.slice(blockEnd);
      applied.push(...toInsert.map((s) => `Añadido en Habilidades: ${s}`));
      void existingLine;
    } else {
      // Insertar antes de Educación o al final
      const edu = cv.search(/\n(?:educaci[oó]n|estudios|formaci[oó]n)\b/i);
      if (edu > 0) {
        cv = cv.slice(0, edu) + skillsBlock + cv.slice(edu);
      } else {
        cv = cv.trimEnd() + "\n" + skillsBlock;
      }
      applied.push(...toInsert.map((s) => `Bloque Habilidades nuevo: ${s}`));
    }
  }

  const changelog = [
    "=== CAMBIOS ===",
    ...applied.map((a) => `- Hecho: ${a}`),
    ...omitted.map((o) => `- Omitido / manual: ${o}`),
    applied.length === 0
      ? "- Hecho: ninguno automático (revisa la lista y edita a mano)."
      : "",
    "",
    "Nota: este parche es LOCAL (sin IA). No reescribe tus logros; solo hace visibles términos que ya puedes defender.",
  ]
    .filter(Boolean)
    .join("\n");

  return { cv: cv.trim() + "\n", changelog, applied, omitted };
}

