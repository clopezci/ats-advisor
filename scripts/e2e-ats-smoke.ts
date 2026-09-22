/**
 * Smoke E2E local del ATS: valor usable, cero basura/prompts filtrados.
 * Run: npm run test:ats-smoke
 */
import { analyzeAts } from "../src/lib/ats/engine";
import { isJunkPhrase, filterSkillTerms } from "../src/lib/ats/phraseFilter";
import { normalizeJobText } from "../src/lib/ats/jdNormalize";
import { splitJobSections } from "../src/lib/ats/jdParse";
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

const JOB = `¡Estamos buscando un/a GERENTE DE PLATAFORMA DIGITAL E INFRAESTRUCTURA TI .
Nuestro cliente, una importante compañía del sector financiero, busca un/a líder tecnológico/a.
🔑 ¿Qué experiencia debes tener?
Gestión de operaciones TI de misión crítica 24/7ITIL 4 y gestión integral de servicios
DevOpsFinOpsAIOps y automatización con IA
Certificación en AWS, Azure o GCP
Observabilidad, monitoreo y KPIs / SLAs / OKRs
⭐ Será un plus si tienes experiencia en:
SRE – Site Reliability Engineering
Sector financiero
💼 ¿Que te ofrecemos?
💰 Salario: $26.000.000 integral
🏥 Auxilio de salud`;

const CV = `ANA MARÍA RIVERA TORRES
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

type Fail = { name: string; detail: string };
const fails: Fail[] = [];
const passes: string[] = [];

function assert(name: string, cond: boolean, detail: string) {
  if (cond) passes.push(name);
  else fails.push({ name, detail });
}

for (const j of [
  "estamos buscando",
  "buscando un/a",
  "nuestro cliente",
  "que ofrecemos",
  "salario 26.000.000",
  "auxilio salud",
  "ui",
]) {
  assert(`junk:${j}`, isJunkPhrase(j), `debió ser basura`);
}
assert("keep:devops", !isJunkPhrase("devops"), "devops no debe ser basura");
assert("keep:itil", !isJunkPhrase("itil"), "itil no debe ser basura");

const norm = normalizeJobText(JOB);
assert("normalize:splits-devops", /\bDevOps\b/i.test(norm) && !/DevOpsFinOps/i.test(norm), "skills pegadas");
const parts = splitJobSections(norm);
assert("sections:must-has-content", parts.must.length > 40, `must len=${parts.must.length}`);
assert("sections:must-not-intro", !/estamos buscando/i.test(parts.must), "must no debe ser intro");

const r = analyzeAts({ cvText: CV, jobText: JOB });
const allTerms = [
  ...r.mustHave.missing,
  ...r.mustHave.matched,
  ...r.missingKeywords,
  ...r.matchedKeywords,
  ...r.hardSkills.missing,
  ...r.hardSkills.matched,
  ...(r.niceToHave?.missing || []),
];
const junkHits = allTerms.filter((t) => isJunkPhrase(t));
assert("analyze:no-junk-terms", junkHits.length === 0, `basura: ${junkHits.join(" | ")}`);
assert(
  "analyze:has-real-skills",
  [...r.mustHave.matched, ...r.hardSkills.matched].some((t) => /aws|itil|azure|devops|liderazgo/i.test(t)),
  "debería matchear skills reales"
);
assert("analyze:score-range", r.score >= 0 && r.score <= 100, `score=${r.score}`);

const letter = buildLocalCoverLetter({
  cvText: CV,
  jobText: JOB,
  matched: filterSkillTerms(r.mustHave.matched),
  missing: filterSkillTerms(r.mustHave.missing),
});
assert("letter:not-fake", !isFakeCoverLetter(letter), "carta marcada fake");
assert("letter:not-leak", !isLeakedAiFallback(letter), "carta con leak");
assert("letter:has-name", /ANA|RIVERA/i.test(letter), "sin nombre");
assert("letter:has-saludo", /estimad|saludos/i.test(letter), "sin saludo/cierre");

const tips = buildLocalApplicationTips(r);
assert("tips:not-leak", !isLeakedAiFallback(tips) && !/contexto:\s*eres/i.test(tips), "tips leak");
assert("tips:actionable", /1\)|2\)/.test(tips), "tips sin checklist");

const bullets = buildLocalBulletRewrites({ result: r, cvText: CV });
assert("bullets:not-leak", !isLeakedAiFallback(bullets), "bullets leak");
assert("bullets:no-junk-phrase", !/estamos buscando|buscando un\/a/i.test(bullets), "bullets con basura JD");

const plan = buildCvPatchPlan(r);
const patch = applyLocalSurgicalPatch(CV, plan);
assert("patch:is-cv", !isFakeCvRewrite(patch.cv, CV), "parche no parece CV");
assert("patch:keeps-name", /ANA MAR[IÍ]A/i.test(patch.cv), "parche borró nombre");
assert("patch:keeps-experience", /DIRECTORA DE OPERACIONES|Experiencia/i.test(patch.cv), "parche borró experiencia");
assert("patch:longer-or-equal", patch.cv.length >= CV.length - 20, "parche acortó demasiado el CV");
assert(
  "patch:honest-changelog",
  /manual:|Hecho:|Omitido/i.test(patch.changelog),
  "changelog vacío"
);

assert(
  "leak-detect:old-fallback",
  isLeakedAiFallback("Sugerencia local (sin claves IA): Pedido: Eres coach ATS LATAM."),
  "detector falló"
);
assert(
  "leak-detect:contexto",
  isLeakedAiFallback("Checklist\n\nContexto: Eres coach de postulaciones LATAM."),
  "detector falló contexto"
);
assert(
  "fake-cv:tip-text",
  isFakeCvRewrite("Sin claves IA online, aplica este patrón", CV),
  "no detectó tip como fake CV"
);

console.log(
  JSON.stringify(
    {
      pass: passes.length,
      fail: fails.length,
      score: r.score,
      mustMatched: r.mustHave.matched,
      mustMissing: r.mustHave.missing,
      hardMissing: r.hardSkills.missing,
    },
    null,
    2
  )
);
if (fails.length) {
  console.error("FAILURES:");
  for (const f of fails) console.error(`- ${f.name}: ${f.detail}`);
  process.exit(1);
}
console.log("E2E ATS smoke OK");
