import { RIASEC_LABELS, type RiasecResult } from "@/lib/outplacement/riasec";

export type CareerBriefInput = {
  name: string;
  targetRole?: string;
  city?: string;
  riasec: RiasecResult | null;
  strengths?: string;
  gaps?: string;
  next30?: string;
};

export function buildCareerBriefHtml(input: CareerBriefInput) {
  const date = new Date().toLocaleDateString("es-CO", { dateStyle: "long" });
  const holland = input.riasec?.holland || "—";
  const topCodes = (input.riasec?.ranked || []).slice(0, 3);
  const labels = topCodes.map((c) => `${c} · ${RIASEC_LABELS[c].name}`).join(" · ");
  const roles =
    input.riasec?.roles
      .slice(0, 4)
      .map((r) => `<li><strong>${r.title}</strong> — ${r.note} (${r.sectors.slice(0, 2).join(", ")})</li>`)
      .join("") || "<li>Completa el assessment RIASEC para sugerencias de roles.</li>";

  return `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"/><title>Career Brief · ${input.name}</title>
<style>
  body{font-family:Georgia,serif;max-width:720px;margin:2rem auto;padding:0 1rem;color:#1a1a1a;line-height:1.45}
  h1{font-size:1.5rem;margin:0 0 .25rem}
  .meta{color:#555;font-size:.85rem;margin-bottom:1.25rem}
  h2{font-size:1rem;text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid #ccc;padding-bottom:.25rem;margin-top:1.4rem}
  ul{padding-left:1.2rem}
  .pill{display:inline-block;border:1px solid #333;padding:.15rem .5rem;border-radius:999px;font-size:.75rem;margin-right:.35rem}
  footer{margin-top:2rem;font-size:.7rem;color:#777}
  @media print{body{margin:0}}
</style></head><body>
  <p class="pill">ATSAdvisor · LOTIC</p>
  <h1>Career Brief — ${escapeHtml(input.name || "Candidato")}</h1>
  <p class="meta">${date}${input.city ? ` · ${escapeHtml(input.city)}` : ""}${input.targetRole ? ` · Objetivo: ${escapeHtml(input.targetRole)}` : ""}</p>

  <h2>Perfil Holland (RIASEC)</h2>
  <p><strong>Código:</strong> ${escapeHtml(holland)}</p>
  <p>${escapeHtml(labels || "Sin assessment")}</p>
  ${topCodes
    .map((c) => `<p><strong>${c}</strong> — ${escapeHtml(RIASEC_LABELS[c].blurb)} (score ${input.riasec?.scores[c] ?? 0}%)</p>`)
    .join("")}

  <h2>Roles LATAM alineados</h2>
  <ul>${roles}</ul>

  <h2>Fortalezas a comunicar</h2>
  <p>${escapeHtml(input.strengths || "Define 3 evidencias STAR que demuestren tu valor en el rol target.")}</p>

  <h2>Gaps a cerrar (30–60 días)</h2>
  <p>${escapeHtml(input.gaps || "Lista 1–2 skills excluyentes de ofertas reales y un plan de práctica semanal.")}</p>

  <h2>Plan 30 días</h2>
  <p>${escapeHtml(input.next30 || "5 postulaciones/semana · 3 contactos de networking · 1 simulación de filtro · CV iterado con ATSAdvisor.")}</p>

  <footer>Documento orientativo generado en ATSAdvisor. No sustituye asesoría laboral ni psicometría clínica. · ${date}</footer>
  <script>window.onload=()=>setTimeout(()=>window.print(),400)</script>
</body></html>`;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function openCareerBriefPrint(input: CareerBriefInput) {
  const html = buildCareerBriefHtml(input);
  const w = window.open("", "_blank", "noopener,noreferrer,width=800,height=900");
  if (!w) return false;
  w.document.write(html);
  w.document.close();
  return true;
}
