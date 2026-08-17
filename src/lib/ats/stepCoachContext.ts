import type { AtsAnalyzeResult } from "@/lib/ats/engine";
import type { AtsScoreSummary } from "@/lib/ats/scoreSummary";

const PHASE_LABELS: Record<number, string> = {
  1: "Entender el puntaje",
  2: "Ver qué falta en el CV",
  3: "Ajustar hoja de vida",
  4: "Carta de postulación",
  5: "Guardar y descargar",
};

/** Contexto estructurado para que la IA responda acertada al paso actual. */
export function buildAtsStepCoachContext(opts: {
  step: 1 | 2 | 3 | 4;
  resultPhase?: number;
  atsProfile?: string;
  result?: AtsAnalyzeResult | null;
  summary?: AtsScoreSummary | null;
  cvText?: string;
  jobText?: string;
}): string {
  const lines: string[] = [`Wizard analizador ATS — paso ${opts.step} de 4.`];

  if (opts.step === 4 && opts.resultPhase) {
    lines.push(`Sub-paso del resultado: ${opts.resultPhase} (${PHASE_LABELS[opts.resultPhase] || "resultado"}).`);
  }

  if (opts.atsProfile) lines.push(`Perfil ATS seleccionado: ${opts.atsProfile}.`);

  if (opts.result && opts.summary) {
    lines.push(
      `Score: ${opts.result.score}%. Banda: ${opts.summary.bandLabel}.`,
      `Headline: ${opts.summary.headline}`,
      `Por qué: ${opts.summary.whyScore.join(" ")}`,
      `Must-have OK: ${(opts.result.mustHave?.matched || []).slice(0, 8).join(", ") || "ninguno"}.`,
      `Must-have faltantes: ${(opts.result.mustHave?.missing || []).slice(0, 8).join(", ") || "ninguno"}.`,
      `Keywords faltantes: ${opts.result.missingKeywords.slice(0, 10).join(", ") || "ninguna"}.`,
      `Excluyentes: ${opts.result.exclusiveGaps.join(" | ") || "ninguno"}.`,
      `Para llegar a 70%+: ${opts.summary.toReach70.join(" | ")}`,
      `Próximos pasos motor: ${(opts.result.nextSteps || opts.result.actions).slice(0, 4).join(" | ")}`
    );
  }

  if (opts.cvText && opts.cvText.trim().length > 20) {
    lines.push(`CV (extracto):\n${opts.cvText.trim().slice(0, 1200)}`);
  }
  if (opts.jobText && opts.jobText.trim().length > 20) {
    lines.push(`Oferta (extracto):\n${opts.jobText.trim().slice(0, 900)}`);
  }

  lines.push(
    "Reglas: responde en español LATAM, solo sobre este paso y estos datos. No inventes experiencia, cargos ni logros. Si falta info, dilo."
  );
  return lines.join("\n");
}

export function atsStepCoachPlaceholder(step: 1 | 2 | 3 | 4, resultPhase?: number): string {
  if (step === 1) return "Ej.: ¿mi CV en dos columnas pasa el filtro ATS?";
  if (step === 2) return "Ej.: ¿qué partes del aviso debo copiar aquí?";
  if (step === 3) return "Ej.: ¿Workday vs Taleo — cuál elijo si no estoy seguro?";
  if (resultPhase === 2) return "Ej.: ¿cómo agrego un must-have que sí tengo sin sonar falso?";
  if (resultPhase === 3) return "Ej.: ¿qué debe cambiar el ajuste automático del CV?";
  if (resultPhase === 4) return "Ej.: ¿qué enfatizar en la carta según mi score?";
  return "Ej.: ¿por qué salió este puntaje y qué hago primero para subirlo?";
}
