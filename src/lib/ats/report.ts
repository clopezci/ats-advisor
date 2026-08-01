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

/** Abre una ventana imprimible para “Guardar como PDF” del navegador. */
export function openPrintableReport(result: AtsAnalyzeResult, meta?: { profile?: string }) {
  const text = buildAtsReport(result, meta);
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"/><title>Informe ATSAdvisor</title>
  <style>
    body{font-family:Segoe UI,sans-serif;max-width:720px;margin:2rem auto;padding:0 1rem;color:#1f1630;line-height:1.45}
    h1{color:#7c3aed;font-size:1.4rem}
    pre{white-space:pre-wrap;font-family:inherit;font-size:0.95rem}
    @media print{body{margin:0}}
  </style></head><body>
  <h1>ATSAdvisor — Informe</h1>
  <pre>${text.replace(/</g, "&lt;")}</pre>
  <script>window.onload=()=>setTimeout(()=>window.print(),200)</script>
  </body></html>`;
  const w = window.open("", "_blank");
  if (!w) {
    downloadText("informe-atsadvisor.txt", text);
    return;
  }
  w.document.write(html);
  w.document.close();
}
