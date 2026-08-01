import { listJobs } from "@/lib/tracker/jobs";
import { readProgress } from "@/lib/progress/courses";
import { readStreak } from "@/lib/engagement/streak";
import { seatStats, listSeats } from "@/lib/b2b/org";

export type AnalyticsProInsight = {
  id: string;
  title: string;
  detail: string;
  severity: "info" | "good" | "warn";
};

type Point = { at: number; score: number };

function pearson(xs: number[], ys: number[]): number | null {
  const n = Math.min(xs.length, ys.length);
  if (n < 3) return null;
  const x = xs.slice(0, n);
  const y = ys.slice(0, n);
  const mx = x.reduce((a, b) => a + b, 0) / n;
  const my = y.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let dx = 0;
  let dy = 0;
  for (let i = 0; i < n; i++) {
    const a = x[i] - mx;
    const b = y[i] - my;
    num += a * b;
    dx += a * a;
    dy += b * b;
  }
  if (!dx || !dy) return null;
  return num / Math.sqrt(dx * dy);
}

function linearForecast(scoresChrono: number[]): { next: number; slope: number } | null {
  const n = scoresChrono.length;
  if (n < 3) return null;
  const xs = scoresChrono.map((_, i) => i);
  const ys = scoresChrono;
  const mx = (n - 1) / 2;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    den += (xs[i] - mx) ** 2;
  }
  const slope = den ? num / den : 0;
  const next = Math.round(Math.max(0, Math.min(100, my + slope * (n - mx))));
  return { next, slope };
}

/** Client-side Analytics Pro over local device data (cloud later via Supabase). */
export function buildAnalyticsPro(points: Point[]): {
  insights: AnalyticsProInsight[];
  forecast: number | null;
  corrScoreVsInterviews: number | null;
  funnel: { interes: number; aplicado: number; entrevista: number; oferta: number };
} {
  const insights: AnalyticsProInsight[] = [];
  const jobs = listJobs();
  const streak = readStreak().count;
  const modules = Object.values(readProgress()).reduce((a, p) => a + (p.completed?.length || 0), 0);
  const b2b = seatStats(listSeats());

  const chrono = [...points].reverse().map((p) => p.score);
  const forecast = linearForecast(chrono);

  const withScore = jobs.filter((j) => typeof j.score === "number");
  const interviewish = withScore.map((j) =>
    j.status === "entrevista" || j.status === "oferta" ? 1 : 0
  );
  const corr = pearson(
    withScore.map((j) => Number(j.score)),
    interviewish
  );

  const funnel = {
    interes: jobs.filter((j) => j.status === "interes").length,
    aplicado: jobs.filter((j) => j.status === "aplicado").length,
    entrevista: jobs.filter((j) => j.status === "entrevista").length,
    oferta: jobs.filter((j) => j.status === "oferta").length,
  };

  if (forecast) {
    insights.push({
      id: "forecast",
      title: "Previsión próximo score ATS",
      detail: `Estimado ~${forecast.next}% (pendiente ${forecast.slope >= 0 ? "+" : ""}${forecast.slope.toFixed(1)} pts/análisis).`,
      severity: forecast.slope >= 0 ? "good" : "warn",
    });
  } else {
    insights.push({
      id: "forecast-need",
      title: "Previsión",
      detail: "Necesitas al menos 3 análisis ATS para proyectar.",
      severity: "info",
    });
  }

  if (corr !== null) {
    insights.push({
      id: "corr",
      title: "Correlación score ↔ entrevistas/ofertas",
      detail: `r ≈ ${corr.toFixed(2)}. ${
        corr > 0.3
          ? "Scores altos tienden a avanzar en el funnel."
          : corr < -0.2
            ? "Patrón raro: revisa si guardas scores en el tracker."
            : "Aún débil; vincula más vacantes con score ATS."
      }`,
      severity: corr > 0.3 ? "good" : "info",
    });
  }

  if (streak >= 3 && modules < 2) {
    insights.push({
      id: "streak-modules",
      title: "Racha sin cápsulas",
      detail: `Llevas ${streak} días de racha pero solo ${modules} cápsulas. Empuja outplacement.`,
      severity: "warn",
    });
  } else if (modules >= 5) {
    insights.push({
      id: "modules-ok",
      title: "Constancia de aprendizaje",
      detail: `${modules} cápsulas completadas · racha ${streak}.`,
      severity: "good",
    });
  }

  const applied = funnel.aplicado + funnel.entrevista + funnel.oferta;
  if (applied >= 3 && funnel.entrevista === 0 && funnel.oferta === 0) {
    insights.push({
      id: "funnel",
      title: "Funnel frío",
      detail: `${applied} postulaciones sin entrevista registrada. Usa filtro predictivo y carta.`,
      severity: "warn",
    });
  }

  if (b2b.total > 0) {
    insights.push({
      id: "b2b",
      title: "Cohorte B2B",
      detail: `${b2b.active} activos / ${b2b.total} asientos · avg ${b2b.avgModules} módulos.`,
      severity: "info",
    });
  }

  return { insights, forecast: forecast?.next ?? null, corrScoreVsInterviews: corr, funnel };
}
