/**
 * Auditoría de VALOR del ATS (no solo “no basura”).
 * Genera artefactos reales y falla si no sirven para postular.
 * Run: npm run test:ats-value
 */
import { analyzeAts } from "../src/lib/ats/engine";
import { isJunkPhrase, filterSkillTerms } from "../src/lib/ats/phraseFilter";
import { buildLocalCoverLetter, isFakeCoverLetter } from "../src/lib/ats/coverLetter";
import {
  buildLocalApplicationTips,
  buildLocalBulletRewrites,
  isLeakedAiFallback,
} from "../src/lib/ats/localAiFallbacks";
import {
  applyLocalSurgicalPatch,
  buildCvPatchPlan,
  isFakeCvRewrite,
} from "../src/lib/ats/cvPatch";

const JOB_FINTECH = `¡Estamos buscando un/a GERENTE DE PLATAFORMA DIGITAL E INFRAESTRUCTURA TI.
Nuestro cliente, una importante compañía del sector financiero, busca un/a líder tecnológico/a.
¿Qué experiencia debes tener?
Gestión de operaciones TI de misión crítica 24/7
ITIL 4 y gestión integral de servicios
DevOps FinOps AIOps y automatización con IA
Certificación en AWS, Azure o GCP
Observabilidad, monitoreo y KPIs / SLAs / OKRs
Será un plus si tienes experiencia en SRE y sector financiero
¿Qué te ofrecemos?
Salario: $26.000.000 integral
Auxilio de salud`;

/** CV sintético (sin PII real). */
const CV_STRONG = `ANA MARÍA RIVERA TORRES
Líder TI | Operaciones | Transformación Digital
ana.rivera.demo@example.com
Medellín, Colombia

Perfil Ejecutivo
Ejecutiva senior en operaciones TI e ITIL, con más de 15 años liderando equipos.
Experiencia en AWS, Azure, continuidad del negocio e infraestructura.

Experiencia Profesional
DIRECTORA DE OPERACIONES — EMPRESA DEMO SAS — 2020-2024
- Lideré equipos multidisciplinarios y un presupuesto superior a COP 50 MM.
- Impulsé automatización RPA y analítica de datos para eficiencia operativa.
- Gestioné continuidad operativa y gobierno de procesos con ITIL.

Habilidades
ITIL, AWS, Azure, liderazgo, cloud, automatización, Scrum, Lean`;

const CV_WEAK = `PEDRO DEMO
Analista junior
pedro.demo@example.com
Bogotá

Perfil
Recién egresado de sistemas. Conocimientos básicos de Office y soporte N1.

Experiencia
SOPORTE MESA DE AYUDA — TI DEMO — 2023-2024
- Atendí tickets de contraseñas y correo.
- Documenté procedimientos simples.

Habilidades
Office, Windows, atención al cliente`;

type Fail = { name: string; detail: string };
const fails: Fail[] = [];
const passes: string[] = [];

function assert(name: string, cond: boolean, detail: string) {
  if (cond) passes.push(name);
  else fails.push({ name, detail });
}

function dump(title: string, body: string) {
  console.log(`\n======== ${title} ========`);
  console.log(body.slice(0, 1800));
  if (body.length > 1800) console.log(`… (+${body.length - 1800} chars)`);
}

// —— Escenario A: CV alineado ——
const strong = analyzeAts({ cvText: CV_STRONG, jobText: JOB_FINTECH });
const weak = analyzeAts({ cvText: CV_WEAK, jobText: JOB_FINTECH });

const allTerms = [
  ...strong.mustHave.missing,
  ...strong.mustHave.matched,
  ...strong.missingKeywords,
  ...strong.matchedKeywords,
  ...strong.hardSkills.missing,
  ...strong.hardSkills.matched,
];
const junkHits = allTerms.filter((t) => isJunkPhrase(t));
assert("value:no-junk", junkHits.length === 0, `basura: ${junkHits.join(" | ")}`);

const matchedReal = [...strong.mustHave.matched, ...strong.hardSkills.matched].filter((t) =>
  /aws|azure|itil|automat|cloud|lider/i.test(t)
);
assert(
  "value:strong-matches-real-skills",
  matchedReal.length >= 2,
  `matched útiles=${matchedReal.join(",") || "(vacío)"}`
);

const missingReal = [...strong.mustHave.missing, ...strong.hardSkills.missing].filter((t) =>
  /gcp|devops|finops|aiops|observ|sre|sla|okr|kpi|monitoreo/i.test(t)
);
assert(
  "value:strong-missing-are-real-gaps",
  missingReal.length >= 2,
  `gaps útiles=${missingReal.join(",") || "(vacío)"} · mustMissing=${strong.mustHave.missing.join(",")}`
);

assert(
  "value:score-differentiation",
  strong.score - weak.score >= 12,
  `strong=${strong.score} weak=${weak.score} delta=${strong.score - weak.score}`
);
assert("value:weak-score-low", weak.score < 55, `weak score demasiado alto: ${weak.score}`);
assert("value:strong-score-usable", strong.score >= 28, `strong score bajo: ${strong.score}`);

const letter = buildLocalCoverLetter({
  cvText: CV_STRONG,
  jobText: JOB_FINTECH,
  matched: filterSkillTerms(strong.mustHave.matched),
  missing: filterSkillTerms(strong.mustHave.missing),
});
dump("CARTA (CV fuerte)", letter);
assert("value:letter-not-fake", !isFakeCoverLetter(letter), "carta fake");
assert("value:letter-not-leak", !isLeakedAiFallback(letter), "carta leak");
assert("value:letter-length", letter.length >= 280 && letter.length <= 2500, `len=${letter.length}`);
assert("value:letter-name", /ANA MAR[IÍ]A|RIVERA/i.test(letter), "sin nombre del CV");
assert("value:letter-role", /gerente|plataforma|infraestructura|vacante/i.test(letter), "sin rol");
assert(
  "value:letter-cites-strength",
  filterSkillTerms(strong.mustHave.matched).some((s) => new RegExp(s, "i").test(letter)) ||
    /ITIL|AWS|Azure/i.test(letter),
  "carta no cita fortalezas del match"
);
assert(
  "value:letter-has-metric-or-logro",
  /\d|presupuesto|equipo|lider/i.test(letter),
  "carta sin logro/métrica del CV"
);
assert("value:letter-honest-tone", /no invent|si aplica|entrevista|honest/i.test(letter), "sin honestidad");

const tips = buildLocalApplicationTips(strong);
dump("TIPS", tips);
assert("value:tips-not-leak", !isLeakedAiFallback(tips), "tips leak");
assert("value:tips-checklist", /1\)|2\)|3\)/.test(tips), "tips sin pasos");
assert(
  "value:tips-reference-gaps",
  missingReal.some((g) => new RegExp(g.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(tips)) ||
    /Si son verdad|No inventes/i.test(tips),
  "tips no mencionan gaps reales"
);
assert("value:tips-score", new RegExp(String(strong.score)).test(tips), "tips sin score");

const bullets = buildLocalBulletRewrites({ result: strong, cvText: CV_STRONG });
dump("VIÑETAS", bullets);
assert("value:bullets-not-leak", !isLeakedAiFallback(bullets), "bullets leak");
assert("value:bullets-has-original", /Original:|Lideré|Impulsé|Gestioné/i.test(bullets), "sin ancla al CV");
assert(
  "value:bullets-has-rewrite-example",
  /Ejemplo|Patrón|Plantilla|Si aplica/i.test(bullets),
  "sin guía de reescritura"
);
assert("value:bullets-no-jd-junk", !/estamos buscando|auxilio de salud|26\.000/i.test(bullets), "basura JD");

const plan = buildCvPatchPlan(strong);
const patch = applyLocalSurgicalPatch(CV_STRONG, plan);
dump("PARCHE CV (extracto)", patch.cv.slice(0, 900));
dump("CHANGELOG", patch.changelog);
assert("value:patch-is-cv", !isFakeCvRewrite(patch.cv, CV_STRONG), "parche no es CV");
assert("value:patch-keeps-name", /ANA MAR[IÍ]A RIVERA/i.test(patch.cv), "borró nombre");
assert("value:patch-keeps-job", /DIRECTORA DE OPERACIONES|EMPRESA DEMO/i.test(patch.cv), "borró experiencia");
assert(
  "value:patch-keeps-length",
  patch.cv.length >= CV_STRONG.length - 40,
  `acortó CV: ${patch.cv.length} vs ${CV_STRONG.length}`
);
assert(
  "value:patch-adds-visible-skills",
  patch.applied.length >= 1 ||
    patch.omitted.some((o) => /manual:/i.test(o)) ||
    plan.items.filter((i) => i.kind !== "bullet" && i.kind !== "format").length === 0,
  `applied=${patch.applied.length} omitted=${patch.omitted.length}`
);
assert(
  "value:patch-skills-section",
  /Habilidades/i.test(patch.cv),
  "perdió sección habilidades"
);
assert(
  "value:patch-no-fake-gcp",
  !patch.applied.some((a) => /\bgcp\b/i.test(a)) || /gcp|google cloud/i.test(CV_STRONG),
  "inventó GCP"
);

// Escenario B: CV débil no debe inventar seniority en carta
const weakLetter = buildLocalCoverLetter({
  cvText: CV_WEAK,
  jobText: JOB_FINTECH,
  matched: filterSkillTerms(weak.mustHave.matched),
  missing: filterSkillTerms(weak.mustHave.missing).slice(0, 4),
});
dump("CARTA (CV débil)", weakLetter);
assert("value:weak-letter-name", /PEDRO DEMO/i.test(weakLetter), "carta débil sin nombre");
assert(
  "value:weak-letter-no-fake-senior",
  !/15 a[nñ]os|directora de operaciones|presupuesto superior a COP 50/i.test(weakLetter),
  "carta débil inventó logros del CV fuerte"
);

console.log(
  JSON.stringify(
    {
      pass: passes.length,
      fail: fails.length,
      strongScore: strong.score,
      weakScore: weak.score,
      mustMatched: strong.mustHave.matched,
      mustMissing: strong.mustHave.missing,
      patchApplied: patch.applied,
    },
    null,
    2
  )
);

if (fails.length) {
  console.error("\nVALUE FAILURES:");
  for (const f of fails) console.error(`- ${f.name}: ${f.detail}`);
  process.exit(1);
}
console.log("\nE2E ATS VALUE OK — artefactos útiles, diferenciación real, sin basura.");
