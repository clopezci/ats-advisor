import type { AtsAnalyzeResult } from "@/lib/ats/engine";

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

/**
 * Lista cerrada de cambios a aplicar — solo gaps del análisis, no reescritura libre.
 */
export function buildCvPatchPlan(result: AtsAnalyzeResult): CvPatchPlan {
  const items: CvPatchItem[] = [];
  let n = 0;

  for (const t of (result.mustHave?.missing || []).slice(0, 8)) {
    n += 1;
    items.push({
      id: `mh_${n}`,
      kind: "must_have",
      label: t,
      detail: "Requisito indispensable detectado en la oferta y no visible en el CV. Solo intégralo si ya lo tienes.",
    });
  }

  for (const t of result.hardSkills.missing.slice(0, 6)) {
    if (items.some((i) => i.label.toLowerCase() === t.toLowerCase())) continue;
    n += 1;
    items.push({
      id: `hs_${n}`,
      kind: "hard_skill",
      label: t,
      detail: "Habilidad técnica nombrada en la oferta. Agrégala en Skills o en una viñeta real.",
    });
  }

  for (const t of result.missingKeywords.slice(0, 8)) {
    if (items.some((i) => i.label.toLowerCase() === t.toLowerCase())) continue;
    n += 1;
    items.push({
      id: `kw_${n}`,
      kind: "keyword",
      label: t,
      detail: "Palabra de la oferta poco visible. Úsala solo si es verdad en tu experiencia.",
    });
  }

  for (const b of (result.bulletQuality?.weakest || []).slice(0, 3)) {
    n += 1;
    items.push({
      id: `bu_${n}`,
      kind: "bullet",
      label: b.text.slice(0, 80) + (b.text.length > 80 ? "…" : ""),
      detail: b.tips[0] || "Refuerza verbo + resultado medible (sin inventar).",
    });
  }

  for (const a of (result.formatAlerts || []).slice(0, 3)) {
    n += 1;
    items.push({
      id: `fm_${n}`,
      kind: "format",
      label: a.slice(0, 90),
      detail: "Ajuste de formato ATS (una columna, secciones claras, sin tablas).",
    });
  }

  const capped = items.slice(0, 14);
  const summary =
    capped.length === 0
      ? "No hay gaps fuertes: solo pulido menor si quieres."
      : `${capped.length} cambios concretos del análisis (must-haves, skills, keywords y viñetas débiles).`;

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
    .map((i, idx) => `${idx + 1}. [${i.kind}] ${i.label} — ${i.detail}`)
    .join("\n");

  return [
    `Modo CIRUGÍA de CV (no reescritura total). Perfil ATS: ${opts.atsProfile}. Score actual: ${opts.score}%.`,
    "",
    "LISTA CERRADA DE CAMBIOS PERMITIDOS (solo estos):",
    list || "(ninguno crítico)",
    "",
    `OFERTA (extracto):\n${opts.jobText.slice(0, 1400)}`,
    "",
    `CV ACTUAL (base a preservar):\n${opts.cvText.slice(0, 6500)}`,
    "",
    "REGLAS OBLIGATORIAS:",
    "1) Devuelve el CV COMPLETO en texto plano listo para Word, partiendo del CV actual.",
    "2) Aplica ÚNICAMENTE los cambios de la lista. No reordenes secciones, no cambies el tono global, no borres logros.",
    "3) No inventes experiencia, cargos, fechas, métricas ni herramientas. Si un ítem no está soportado por el CV, déjalo igual y márcalo en el changelog como OMITIDO.",
    "4) Keywords: intégralas en Skills o en viñetas existentes solo si el CV ya lo sostiene.",
    "5) Formato: una columna, secciones claras, viñetas con - ",
    "6) NO escribas títulos como «Resumen de cambios», «CV reescrito» dentro del cuerpo del CV.",
    "",
    "Al FINAL del mensaje (después del CV), agrega exactamente este bloque:",
    "=== CAMBIOS ===",
    "- APLICADO: …",
    "- OMITIDO: … (si aplica)",
  ].join("\n");
}

/** Separa CV plano del bloque CAMBIOS al final. */
export function splitSurgicalCvResponse(raw: string): { cv: string; changelog: string } {
  const text = (raw || "").replace(/\r\n/g, "\n").trim();
  const marker = text.search(/\n===\s*CAMBIOS\s*===\s*\n/i);
  if (marker < 0) {
    return { cv: text, changelog: "" };
  }
  return {
    cv: text.slice(0, marker).trim(),
    changelog: text.slice(marker).replace(/^\n===\s*CAMBIOS\s*===\s*\n/i, "").trim(),
  };
}

export function kindLabel(kind: CvPatchItem["kind"]): string {
  switch (kind) {
    case "must_have":
      return "Indispensable";
    case "hard_skill":
      return "Skill técnica";
    case "keyword":
      return "Palabra clave";
    case "bullet":
      return "Viñeta";
    case "format":
      return "Formato";
    default:
      return kind;
  }
}
