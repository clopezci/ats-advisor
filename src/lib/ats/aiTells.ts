/** Detectores de “AI-tells” y stuffing — ATS-2.0 (Greenhouse/Ashby/Workday semántico). */

const AI_TELLS_ES =
  /\b(leverage|leveraging|robust[oa]?|orquest[ée]|sinergias?|paradigm[ao]|hol[ií]stic[oa]?|cutting[- ]edge|best[- ]in[- ]class|results?[- ]driven|detail[- ]oriented|passionate about|dedicated professional|proven track record|fast[- ]paced environment|go[- ]getter|think outside the box|synerg|stakeholder alignment|drive impact|unlock value|end[- ]to[- ]end solutions?)\b/i;

const AI_TELLS_ES_LOCAL =
  /\b(apasionad[oa] por|profesional dedicad[oa]|amplia trayectoria comprobada|entorno din[aá]mico|pensar fuera de la caja|generar impacto|desbloquear valor|soluciones integrales|alto impacto|proactiv[oa] y din[aá]mic[oa]|excelentes habilidades de comunicaci[oó]n)\b/i;

const FILLER_SOFT =
  /\b(proactiv[oa]|din[aá]mic[oa]|responsable|orientad[oa] a resultados|trabajo bajo presi[oó]n|f[aá]cil adaptaci[oó]n)\b/gi;

export type AiTellHit = {
  phrase: string;
  severity: "high" | "medium";
  tip: string;
};

export type AuthenticityReport = {
  aiTellHits: AiTellHit[];
  stuffingScore: number; // 0–100 (alto = malo)
  fillerSoftCount: number;
  alerts: string[];
  authenticityScore: number; // 0–100 (alto = bien)
};

export function detectAiTells(cvText: string): AiTellHit[] {
  const hits: AiTellHit[] = [];
  const lower = cvText;
  const patterns: { re: RegExp; severity: "high" | "medium"; tip: string }[] = [
    {
      re: AI_TELLS_ES,
      severity: "high",
      tip: "Suenan a texto IA genérico en inglés; los ATS-2.0 y reclutadores lo penalizan. Reescribe con tu verbo + métrica real.",
    },
    {
      re: AI_TELLS_ES_LOCAL,
      severity: "medium",
      tip: "Frase cliché LATAM/IA. Sustitúyela por un logro concreto de tu experiencia.",
    },
  ];
  for (const p of patterns) {
    const m = lower.match(new RegExp(p.re.source, "gi"));
    if (m) {
      for (const phrase of [...new Set(m.map((x) => x.toLowerCase()))].slice(0, 6)) {
        hits.push({ phrase, severity: p.severity, tip: p.tip });
      }
    }
  }
  return hits.slice(0, 10);
}

export function analyzeAuthenticity(cvText: string): AuthenticityReport {
  const aiTellHits = detectAiTells(cvText);
  const words = cvText
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .split(/[^a-z0-9+#]+/)
    .filter((w) => w.length > 2);
  const freq = new Map<string, number>();
  for (const w of words) freq.set(w, (freq.get(w) || 0) + 1);
  const stuffed = [...freq.entries()].filter(([, c]) => c > 12);
  const stuffingScore = Math.min(100, stuffed.length * 15 + Math.max(0, ...stuffed.map(([, c]) => c - 12)) * 5);

  const fillerSoftCount = (cvText.match(FILLER_SOFT) || []).length;

  const alerts: string[] = [];
  if (aiTellHits.length) {
    alerts.push(
      `Detectamos ${aiTellHits.length} “AI-tell(s)” (${aiTellHits
        .slice(0, 3)
        .map((h) => h.phrase)
        .join(", ")}). Reescribe en lenguaje humano con logros medibles.`
    );
  }
  if (stuffingScore >= 40) {
    alerts.push(
      `Posible keyword stuffing (score ${stuffingScore}/100). Los ATS semánticos (Workday/Greenhouse) pueden bajar tu ranking.`
    );
  }
  if (fillerSoftCount >= 4) {
    alerts.push(
      `Muchas soft skills vacías (${fillerSoftCount}). Demuéstralas en viñetas, no en listas de adjetivos.`
    );
  }

  let authenticityScore = 85;
  authenticityScore -= aiTellHits.filter((h) => h.severity === "high").length * 12;
  authenticityScore -= aiTellHits.filter((h) => h.severity === "medium").length * 6;
  authenticityScore -= Math.min(40, stuffingScore * 0.35);
  authenticityScore -= Math.min(15, fillerSoftCount * 3);
  authenticityScore = Math.max(5, Math.min(100, Math.round(authenticityScore)));

  return { aiTellHits, stuffingScore, fillerSoftCount, alerts, authenticityScore };
}
