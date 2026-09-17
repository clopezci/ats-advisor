import type { AtsAnalyzeResult } from "@/lib/ats/engine";
import { isJunkPhrase } from "@/lib/ats/phraseFilter";

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
