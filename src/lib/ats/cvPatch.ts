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
    "- No inventes cargos, fechas, empresas ni herramientas que no estén en el CV.",
    "- Reescribe los párrafos que ya existen, en tono de logro (verbo + lo que ya dice el CV).",
    "- La única cifra inventada permitida es un ejemplo entre corchetes, así: [18%] o [12]. No uses otros corchetes.",
    "- Si el párrafo ya trae un número real, consérvalo y no lo pongas entre corchetes.",
    "- Si un término de la oferta no está en el CV, puedes meterlo en una frase existente solo si encaja con lo que ya hizo. Si no encaja, no lo agregues.",
    "- Conserva el orden de secciones.",
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

const SECTION_LINE =
  /^(experiencia|experience|educaci[oó]n|estudios|formaci[oó]n|habilidades|skills|competencias|resumen|perfil(\s+ejecutivo|\s+profesional)?|objetivo|idiomas|certificaciones|contacto|proyectos)\b/i;

function isSectionLine(s: string) {
  const t = s.trim();
  return t.length > 0 && t.length < 42 && SECTION_LINE.test(t);
}

function isBulletLine(s: string) {
  return /^[-•●▪◦*]\s+/.test(s.trim()) || /^\d+[.)]\s+/.test(s.trim());
}

function isContactLine(s: string) {
  return /@|linkedin|https?:|\+\d{2}/i.test(s) && s.trim().length < 140;
}

/**
 * El texto sacado de un PDF corta el renglón a la mitad del párrafo.
 * Une esas líneas y deja títulos, viñetas y contacto en su propio renglón.
 */
export function reflowExtractedCv(raw: string): string {
  const lines = (raw || "").replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];

  const joinInto = (prev: string, cur: string) => `${prev} ${cur}`.replace(/[ \t]{2,}/g, " ").trim();

  for (const line of lines) {
    const cur = line.trim();
    if (!out.length) {
      out.push(cur);
      continue;
    }
    const prev = out[out.length - 1] || "";
    if (!prev || !cur) {
      out.push(cur);
      continue;
    }
    if (isSectionLine(cur) || isContactLine(cur) || isSectionLine(prev) || isContactLine(prev)) {
      out.push(cur);
      continue;
    }
    if (isBulletLine(cur)) {
      out.push(cur);
      continue;
    }
    if (isBulletLine(prev)) {
      const body = prev.replace(/^[-•●▪◦*]\s+/, "").replace(/^\d+[.)]\s+/, "");
      if (/[,;:]$/.test(body) || /^[a-záéíóúñ(]/.test(cur) || body.length > 55) {
        out[out.length - 1] = joinInto(prev, cur);
        continue;
      }
      out.push(cur);
      continue;
    }
    if (prev.length < 55 && !/[,;:]$/.test(prev)) {
      out.push(cur);
      continue;
    }
    if (/[,;:]$/.test(prev) || /^[a-záéíóúñ(]/.test(cur) || prev.length > 68) {
      out[out.length - 1] = joinInto(prev, cur);
      continue;
    }
    out.push(cur);
  }

  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

export type PatchSuggestion = {
  id: string;
  where: string;
  /** Frase tal como está hoy en la hoja. */
  before?: string;
  paste: string;
  example: boolean;
};

const ACHIEVEMENT_OPEN =
  /^(lider[eé]|dirig[ií]|implement[eé]|diseñ[eé]|coordin[eé]|gestion[eé]|impuls[eé]|desarroll[eé]|particip[eé]|defin[ií]|reduj[eé]|aument[eé]|apliqu[eé]|consolid[eé]|estructur[eé])(?=\s|$)/i;

function hasImpactMetric(s: string) {
  return /\d+\s*%|\$\s*\d|\bCOP\s*\d|\d+\s*MM\b|\d+\s*(personas|usuarios|clientes|millones)|\[\d/i.test(s);
}

function isRoleHeader(s: string) {
  return s.length < 100 && /\b(19|20)\d{2}\b/.test(s) && !/[.]$/.test(s.trim());
}

function isHeaderLine(s: string) {
  const t = s.trim();
  if (!t) return true;
  if (isSectionLine(t) || isContactLine(t) || isRoleHeader(t)) return true;
  if (/www\.|https?:|@[a-z0-9.-]+\.[a-z]{2,}/i.test(t)) return true;
  if (/\b(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)\b.+\d{4}|\d{4}\s*[–—-]\s*(actual|presente|\d{4})/i.test(t)) return true;
  if (/[|·]/.test(t) && t.length < 140 && !/[.]$/.test(t)) return true;
  if (/^[A-ZÁÉÍÓÚÑ0-9][A-ZÁÉÍÓÚÑ0-9\s|/·—–.-]{12,}$/.test(t)) return true;
  return false;
}

/** Corta en la última coma si la frase quedó a medias (p. ej. «definiendo»). */
function tidyClause(raw: string): string {
  let t = raw
    .replace(/^[-•●▪◦*]\s+/, "")
    .replace(/\s+/g, " ")
    .replace(/[…]+$/, "")
    .replace(/\.{3}$/, "")
    .trim();
  if (t.length > 200) t = t.slice(0, 200).replace(/\s+\S*$/, "");
  if (!/[.!?]$/.test(t) && /,/.test(t)) {
    const parts = t.split(",");
    const last = (parts[parts.length - 1] || "").trim();
    if (
      /^(definiendo|incluyendo|liderando|gestionando|asegurando|optimizando|desarrollando|implementando)\b/i.test(last) ||
      last.split(/\s+/).length < 4
    ) {
      parts.pop();
      t = parts.join(",").trim();
    }
  }
  return t.replace(/[.,;:\s]+$/, "");
}

/**
 * Ejemplo suelto, para mirar. No se escribe en la hoja.
 * No repite el mismo cierre en todas las frases.
 */
export function exampleAdjustment(original: string, variant: number, extraTerm?: string): string {
  let body = tidyClause(original);
  if (!body || isHeaderLine(body)) return "";

  body = body
    .replace(/^responsable de liderar /i, "Lideré ")
    .replace(/^responsable de /i, "Lideré ")
    .replace(/^encargad[oa] de /i, "Lideré ");

  const term = (extraTerm || "").replace(/\s+/g, " ").trim();
  if (variant === 0 && term && term.length <= 40 && !body.toLowerCase().includes(term.toLowerCase())) {
    return `${body}. Si es verdad en tu trabajo, en esta viñeta nombra «${term}».`;
  }
  if (variant === 1 && !hasImpactMetric(body)) {
    return `${body} y el alcance fue de [12] personas.`;
  }
  if (!hasImpactMetric(body)) {
    return `${body}, con un ahorro de [18%] en ese proceso.`;
  }
  return `${body}.`;
}

export const EXAMPLE_MARK = "[[EJEMPLO]]";

/** Quita ejemplos para medir el puntaje solo con texto que ya es del candidato. */
export function cvTextForRescore(text: string): string {
  return text
    .split("\n")
    .filter((l) => !l.includes(EXAMPLE_MARK))
    .filter((l) => !/^Ajustes sugeridos para esta vacante/i.test(l.trim()))
    .filter((l) => !/^Las líneas con \[\[EJEMPLO\]\]/i.test(l.trim()))
    .join("\n")
    .replace(/\[[^\]]+\]/g, "")
    .trim();
}

/** Texto plano para pegar en Word, con el aviso de la cifra de ejemplo. */
export function cvTextForClipboard(text: string): string {
  const body = text.replace(/\[\[EJEMPLO\]\]\s*/g, "");
  if (!/\[\d/.test(body)) return body;
  return (
    "Cambia solo el número o el % entre corchetes por tu dato real. Si no tienes esa cifra, borra esa parte. El resto debe ser algo que sí hiciste.\n\n" +
    body
  );
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
 * No toca la hoja. Devuelve hasta 3 ejemplos sueltos para mirar.
 */
export function applyLocalSurgicalPatch(
  cvText: string,
  plan: CvPatchPlan
): { cv: string; changelog: string; applied: string[]; omitted: string[]; suggestions: PatchSuggestion[] } {
  const applied: string[] = [];
  const omitted: string[] = [];
  const suggestions: PatchSuggestion[] = [];
  const cv = cvText;

  const skillLabels = plan.items
    .filter((i) => i.kind === "hard_skill" || i.kind === "keyword" || i.kind === "must_have")
    .map((i) => i.label.trim())
    .filter((l) => l.length >= 2 && l.length <= 40 && !isJunkPhrase(l));

  const cvNorm = cv
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
  const missingTerms: string[] = [];
  for (const label of skillLabels) {
    if (cv.toLowerCase().includes(label.toLowerCase()) || textHasTerm(cvNorm, label)) continue;
    omitted.push(`${label} (manual: úsalo en un ejemplo solo si es verdad)`);
    missingTerms.push(label);
  }

  const lines = cv
    .split("\n")
    .map((l) => l.replace(/^[-•●▪◦*]\s+/, "").trim())
    .filter((l) => l.length > 40 && !isHeaderLine(l));

  const sources: string[] = [];
  for (const line of lines) {
    if (sources.length >= 2) break;
    if (!ACHIEVEMENT_OPEN.test(line) && !/^(responsable|encargad|fund[eé]|defin[ií]|particip)/i.test(line)) continue;
    if (sources.some((s) => s.slice(0, 24).toLowerCase() === line.slice(0, 24).toLowerCase())) continue;
    sources.push(line);
  }
  for (const line of lines) {
    if (sources.length >= 2) break;
    if (isHeaderLine(line) || sources.includes(line)) continue;
    sources.push(line);
  }

  sources.slice(0, 2).forEach((original, idx) => {
    const paste = exampleAdjustment(original, idx);
    if (!paste) return;
    suggestions.push({
      id: `ex_${idx}`,
      where: "Ejemplo",
      paste,
      example: true,
    });
  });

  const term = missingTerms.find((t) => !suggestions.some((s) => s.paste.toLowerCase().includes(t.toLowerCase())));
  if (term && suggestions.length < 3) {
    suggestions.push({
      id: "ex_term",
      where: "Ejemplo",
      paste: `Lideré un proyecto en el que usé ${term}.`,
      example: true,
    });
  }

  const changelog = [
    "=== CAMBIOS ===",
    ...applied.map((a) => `- Hecho: ${a}`),
    ...omitted.map((o) => `- Omitido / manual: ${o}`),
    applied.length === 0
      ? "- Hecho: ninguno automático (revisa la lista y edita a mano)."
      : "",
    "",
    "Nota: la hoja no se modificó. Los ejemplos quedan aparte.",
  ]
    .filter(Boolean)
    .join("\n");

  return { cv: cv.trim() + "\n", changelog, applied, omitted, suggestions };
}

