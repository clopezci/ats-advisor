import type { AtsAnalyzeResult } from "@/lib/ats/engine";

export function buildAtsReport(result: AtsAnalyzeResult, meta?: { profile?: string }) {
  const lines = [
    "ATSAdvisor — Informe de compatibilidad Pro",
    `Fecha: ${new Date().toLocaleString("es-CO")}`,
    `Perfil ATS: ${meta?.profile || "generic"}`,
    "",
    `Score: ${result.score}%`,
    `Probabilidad de entrevista: ${result.interviewProbability}%`,
    `Solape semántico: ${result.semanticScore}% (${result.embeddingProvider || "local"})`,
    `Autenticidad / anti-IA: ${result.authenticityScore ?? "—"}%`,
    "",
    "Ojo del reclutador (8s):",
    `- Veredicto: ${result.recruiterSkim?.verdict || "—"}`,
    ...(result.recruiterSkim?.fixNow || []).map((e) => `- Arregla: ${e}`),
    ...(result.authenticityAlerts || []).map((e) => `- Alerta autenticidad: ${e}`),
    "",
    "Heatmap keywords (oferta vs CV):",
    ...(result.heatmap || []).map(
      (h) => `- [${h.status}] ${h.term}: oferta×${h.jobCount} · CV×${h.cvCount}`
    ),
    "",
    "Calidad de viñetas:",
    `- Promedio: ${result.bulletQuality?.avgScore ?? "—"}% (${result.bulletQuality?.total ?? 0} viñetas)`,
    ...(result.bulletQuality?.weakest || []).map(
      (b) => `- [${b.score}%] ${b.text.slice(0, 100)}… → ${b.tips[0] || ""}`
    ),
    "",
    "Dónde colocar keywords:",
    ...(result.placementGuide || []).map((p) => `- ${p.term} → ${p.where}: ${p.pattern}`),
    "",
    "Parse preview:",
    `- Nombre: ${result.parsePreview?.name || "—"}`,
    `- Email: ${result.parsePreview?.email || "—"}`,
    `- Skills: ${(result.parsePreview?.skills || []).join(", ") || "—"}`,
    "",
    "Keywords por sección del CV:",
    ...(result.sectionHits || []).map(
      (s) => `- ${s.section}: ${s.hits} hits (${s.sample.join(", ") || "—"})`
    ),
    "",
    "Cómo filtra este ATS:",
    ...(result.atsInsights || []).map((e) => `- ${e}`),
    "",
    "Explicación del score:",
    ...result.explanation.map((e) => `- ${e}`),
    "",
    "Próximos pasos:",
    ...(result.nextSteps || result.actions).map((e) => `- ${e}`),
    "",
    "Must-have presentes:",
    ...((result.mustHave?.matched?.length ? result.mustHave.matched : ["(ninguno)"]).map((e) => `- ${e}`)),
    "",
    "Must-have faltantes:",
    ...((result.mustHave?.missing?.length ? result.mustHave.missing : ["(ninguno)"]).map((e) => `- ${e}`)),
    "",
    "Hard skills faltantes:",
    ...(result.hardSkills.missing.length ? result.hardSkills.missing.map((e) => `- ${e}`) : ["- Ninguna"]),
    "",
    "Keywords faltantes:",
    ...result.missingKeywords.map((e) => `- ${e}`),
    "",
    "Keywords presentes:",
    ...result.matchedKeywords.slice(0, 30).map((e) => `- ${e}`),
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
    "Tips reclutador humano:",
    ...(result.recruiterTips || []).map((e) => `- ${e}`),
    "",
    "Checklist postulación:",
    ...(result.applicationTips || []).map((e) => `- ${e}`),
    "",
    "Formación sugerida:",
    ...(result.trainingSuggestions.length
      ? result.trainingSuggestions.map((e) => `- ${e}`)
      : ["- Sin sugerencias"]),
    "",
    "AVISO: Las sugerencias de ajuste de HV son un apoyo. Debes revisar y validar según tu experiencia real.",
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
