/**
 * Casos reales: Repaso del rol (oferta de plataforma TI) + psicotécnicas.
 * Run: npx tsx scripts/e2e-modules-value.ts
 */
import { readFileSync } from "fs";
import { buildFallbackRoleReviewPlan, isUsableRolePlan, jdAnchorFromJob } from "../src/lib/roleReview/prompt";
import { detectRoleFamily } from "../src/lib/roleReview/templates";
import {
  answersMatch,
  PSICO_BANK_COUNTS,
  PSICO_PREVIEW_FICHAS,
  PSICO_TRIAL,
  trialExercises,
} from "../src/lib/psicotecnicas";
import catalog from "../src/lib/psicotecnicas/catalog.json";

const JOB = `GERENTE DE PLATAFORMA DIGITAL E INFRAESTRUCTURA TI.
Compañía del sector financiero. Operaciones TI de misión crítica 24/7.
ITIL 4, incidentes, problemas, cambios y continuidad (DRP).
DevOps, FinOps, AIOps, AWS, Azure o GCP.
Observabilidad, monitoreo, KPIs, SLAs y OKRs.
Plus: SRE y sector financiero.`;

const fails: string[] = [];
function assert(name: string, cond: boolean, detail: string) {
  if (!cond) fails.push(`${name}: ${detail}`);
  else console.log("OK", name);
}

const family = detectRoleFamily("Gerente de plataforma digital e infraestructura TI", JOB);
assert("repaso:family-ops", family === "ops", `family=${family}`);

const anchor = jdAnchorFromJob(JOB);
assert("repaso:anchor-not-intro", !/estamos buscando|nuestro cliente/i.test(anchor), anchor);
assert("repaso:anchor-has-skill", /itil|devops|observabilidad|misi[oó]n/i.test(anchor), anchor);

for (const mode of ["refuerzo", "total", "entrevista", "dia1"] as const) {
  const plan = buildFallbackRoleReviewPlan({
    mode,
    jobTitle: "Gerente de plataforma digital e infraestructura TI",
    company: "Sector financiero",
    jobText: JOB,
    learnTopics:
      mode === "refuerzo"
        ? [
            { term: "GCP", optIn: true, source: "ats_missing" },
            { term: "FinOps", optIn: true, source: "ats_missing" },
            { term: "SRE", optIn: false, source: "ats_missing" },
          ]
        : [],
    maxDays: mode === "refuerzo" ? 3 : 5,
    roleFamily: family,
  });
  assert(`${mode}:usable`, isUsableRolePlan(plan), "plan no usable");
  assert(`${mode}:days`, plan.days.length >= 3, `days=${plan.days.length}`);
  assert(
    `${mode}:challenges-match-days`,
    plan.challenges.length === plan.days.length,
    `${plan.challenges.length} vs ${plan.days.length}`
  );
  assert(`${mode}:tickets`, plan.tickets.length >= 1, "sin tickets");
  assert(`${mode}:star`, plan.starBank.length >= plan.days.length, "sin STAR");
  assert(`${mode}:week1`, plan.week1Checklist.length >= 3, "checklist corta");
  const blob = JSON.stringify(plan);
  assert(`${mode}:no-leak`, !/ATS_LOCAL_|eres un tutor de oficio/i.test(blob), "leak");
  assert(`${mode}:no-invent-cv`, !/clopezci|hotmail|70 MM/i.test(blob), "metió datos de CV");
  const anchors = plan.challenges.map((c) => c.jdAnchor).join(" ");
  assert(`${mode}:anchor-skill`, /itil|devops|observabilidad|misi[oó]n|GCP|FinOps/i.test(anchors), anchors.slice(0, 80));
  if (mode === "refuerzo") {
    assert("refuerzo:opt-in", /GCP|FinOps/.test(blob) && !plan.days.some((d) => /SRE/.test(d.title)), blob.slice(0, 200));
  }
  if (mode === "dia1") {
    assert("dia1:objective", /primera semana/i.test(plan.objective), plan.objective);
  }
  console.log(`  ${mode} día1: ${plan.days[0]?.title} · ticket: ${plan.tickets[0]?.title}`);
}

assert("psico:trial-3", trialExercises().length === 3, String(trialExercises().length));
const materias = new Set(trialExercises().map((t) => t.item.materia));
assert("psico:one-each", materias.size === 3, [...materias].join(","));
assert("psico:preview-3", PSICO_PREVIEW_FICHAS.length === 3, String(PSICO_PREVIEW_FICHAS.length));
assert(
  "psico:public-is-not-full-bank",
  PSICO_TRIAL.length === 3 && PSICO_BANK_COUNTS.ejercicios > 20,
  `trial=${PSICO_TRIAL.length} bank=${PSICO_BANK_COUNTS.ejercicios}`
);

const trialBlob = readFileSync("src/lib/psicotecnicas/trial.json", "utf8");
const hidden = catalog.ejercicios[8]?.enunciado?.slice(0, 40) || "";
assert(
  "psico:hidden-exercise-not-in-trial-file",
  hidden.length > 10 && !trialBlob.includes(hidden),
  "el trial público incluye un ejercicio del banco"
);

for (const row of catalog.ejercicios) {
  if (!row.enunciado || row.enunciado.length < 12 || !row.respuesta || row.pasos.length < 2) {
    fails.push(`psico:ejercicio-incompleto ${row.tema}`);
    break;
  }
}
assert("psico:ejercicios-completos", !fails.some((f) => f.startsWith("psico:ejercicio")), "hay ejercicios vacíos");

assert("psico:match-number", answersMatch("96", "96"), "96");
assert("psico:match-letter", answersMatch("A", "A) Peso"), "A");
assert("psico:match-word", answersMatch("peso", "A) Peso"), "peso");
assert("psico:reject-wrong", !answersMatch("12", "96"), "false positive");

const series = trialExercises()[0].item;
assert("psico:series-answer", answersMatch("96", series.respuesta), series.respuesta);
assert("psico:series-steps", series.pasos.length >= 3, String(series.pasos.length));

console.log(
  JSON.stringify(
    {
      family,
      anchor,
      trial: trialExercises().map((t) => t.item.tema),
      bank: PSICO_BANK_COUNTS,
    },
    null,
    2
  )
);

if (fails.length) {
  console.error("FAILURES:\n" + fails.join("\n"));
  process.exit(1);
}
console.log("MODULES VALUE OK");
