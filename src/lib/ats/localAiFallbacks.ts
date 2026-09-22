import type { AtsAnalyzeResult } from "@/lib/ats/engine";
import { filterSkillTerms } from "@/lib/ats/phraseFilter";
import { buildLocalCoverLetter } from "@/lib/ats/coverLetter";

/** Borrador de viñeta anclado al texto original (sin inventar métricas nuevas). */
function draftBulletExample(original: string, skillHint: string): string {
  const base = original.replace(/^[-•●*]\s*/, "").replace(/\s+/g, " ").trim().replace(/\.$/, "");
  const skill = (skillHint || "").trim();
  if (!skill || new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(base)) {
    return `${base} (añade un número concreto si lo tienes: %, COP, personas o tiempo).`;
  }
  return `${base}, integrando ${skill} cuando haya evidencia real en tu rol.`;
}

/** Tips de postulación accionables (sin filtrar system prompts). */
export function buildLocalApplicationTips(result: AtsAnalyzeResult): string {
  const must = filterSkillTerms(result.mustHave?.missing || []).slice(0, 5);
  const hard = filterSkillTerms(result.hardSkills?.missing || []).slice(0, 5);
  const matched = filterSkillTerms([
    ...(result.mustHave?.matched || []),
    ...(result.hardSkills?.matched || []),
  ]).slice(0, 5);

  return [
    "Plan de postulación (local — accionable):",
    "",
    "1) CV: una columna, PDF con texto seleccionable o DOCX.",
    matched.length
      ? `2) Enfatiza en logros lo que ya cubres: ${matched.join(", ")}.`
      : "2) Enfatiza 2–3 logros con número (%, COP, personas, operaciones).",
    must.length || hard.length
      ? `3) Si son verdad, haz visibles en Skills/logros: ${[...must, ...hard].slice(0, 6).join(", ")}. Si no, no los inventes.`
      : "3) No inventes skills: solo términos que puedas defender en entrevista.",
    "4) Completa el formulario del portal con las MISMAS palabras que tu CV.",
    "5) Mensaje corto: encaje al rol + 1 logro real + disponibilidad.",
    "6) Prepara 2 historias STAR ligadas a responsabilidades del aviso.",
    "7) Canales: portal de la empresa + 1 contacto de red + postulación formal.",
    "",
    `Score actual ${result.score}% · umbral típico visible ~70%+.`,
  ].join("\n");
}

/**
 * 5 reescrituras locales de viñetas débiles + patrón para skills faltantes.
 * Nunca incluye el prompt del sistema ni bigramas basura.
 */
export function buildLocalBulletRewrites(opts: {
  result: AtsAnalyzeResult;
  cvText: string;
}): string {
  const { result, cvText } = opts;
  const missing = filterSkillTerms([
    ...(result.mustHave?.missing || []),
    ...(result.hardSkills?.missing || []),
    ...(result.missingKeywords || []),
  ]).slice(0, 6);

  const weak = (result.bulletQuality?.weakest || []).slice(0, 5);
  const lines: string[] = [
    "Reescrituras locales (sin IA online) — solo patrón; no inventamos hechos:",
    "",
  ];

  if (weak.length === 0) {
    const bullets = cvText
      .split("\n")
      .map((l) => l.replace(/^[-•●*]\s*/, "").trim())
      .filter((l) => l.length > 45 && l.length < 200)
      .slice(0, 3);
    for (let i = 0; i < bullets.length; i++) {
      const b = bullets[i];
      const kw = missing[i] || missing[0] || "herramienta del aviso";
      lines.push(`${i + 1}) Original: ${b}`);
      lines.push(
        `   Ejemplo (edítalo; no inventes): ${draftBulletExample(b, kw)}`
      );
      lines.push("");
    }
  } else {
    weak.forEach((b, i) => {
      const kw = missing[i] || missing[0];
      const original = b.text.slice(0, 140) + (b.text.length > 140 ? "…" : "");
      lines.push(`${i + 1}) Original: ${original}`);
      if (b.tips?.[0]) lines.push(`   Tip: ${b.tips[0]}`);
      lines.push(
        kw
          ? `   Ejemplo (edítalo; solo si es verdad): ${draftBulletExample(b.text, kw)}`
          : "   Añade un número (% / COP / personas / tiempo) si lo tienes."
      );
      lines.push("");
    });
  }

  if (missing.length) {
    lines.push("Skills a hacer visibles (solo si son ciertas):");
    lines.push(missing.map((m) => `- ${m}`).join("\n"));
    lines.push("");
  }

  lines.push(
    "Plantilla: «Lideré [acción] con [skill real], logrando [métrica].» — borra lo que no puedas demostrar."
  );
  return lines.join("\n");
}

export function isLeakedAiFallback(text: string): boolean {
  const t = (text || "").trim();
  if (!t) return true;
  return (
    /sin claves ia|sugerencia local \(sin|pedido:\s*eres |contexto:\s*eres |ATS_LOCAL_|modo local\)/i.test(
      t
    ) || /eres coach|eres experto en ATS/i.test(t)
  );
}

export function buildLocalCoverFromResult(
  result: AtsAnalyzeResult,
  cvText: string,
  jobText: string,
  companyName?: string
) {
  return buildLocalCoverLetter({
    cvText,
    jobText,
    matched: filterSkillTerms([
      ...(result.mustHave?.matched || []),
      ...(result.hardSkills?.matched || []),
    ]).slice(0, 8),
    missing: filterSkillTerms([
      ...(result.mustHave?.missing || []),
      ...(result.hardSkills?.missing || []),
    ]).slice(0, 5),
    companyHint: companyName,
  });
}
