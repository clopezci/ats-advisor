import type { AtsAnalyzeResult } from "@/lib/ats/engine";

export function buildAtsReport(result: AtsAnalyzeResult, meta?: { profile?: string }) {
  const lines = [
    "ATSAdvisor — Informe de compatibilidad",
    `Fecha: ${new Date().toLocaleString("es-CO")}`,
    `Perfil ATS: ${meta?.profile || "generic"}`,
    "",
    `Score: ${result.score}%`,
    `Probabilidad de entrevista: ${result.interviewProbability}%`,
    "",
    "Explicación:",
    ...result.explanation.map((e) => `- ${e}`),
    "",
    "Acciones prioritarias:",
    ...result.actions.map((e) => `- ${e}`),
    "",
    "Palabras/conceptos faltantes:",
    ...result.missingKeywords.map((e) => `- ${e}`),
    "",
    "Requisitos excluyentes:",
    ...(result.exclusiveGaps.length ? result.exclusiveGaps.map((e) => `- ${e}`) : ["- Ninguno detectado"]),
    "",
    "Alertas de formato:",
    ...(result.formatAlerts.length ? result.formatAlerts.map((e) => `- ${e}`) : ["- Sin alertas"]),
    "",
    "Riesgos / trampas:",
    ...(result.trapAlerts.length ? result.trapAlerts.map((e) => `- ${e}`) : ["- Sin alertas"]),
    "",
    "Formación sugerida:",
    ...(result.trainingSuggestions.length
      ? result.trainingSuggestions.map((e) => `- ${e}`)
      : ["- Sin sugerencias"]),
    "",
    "Generado por ATSAdvisor · LOTIC Soluciones",
  ];
  return lines.join("\n");
}

export function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
