/**
 * Prueba de valor con CV + oferta REALES (scripts/.tmp-cv.txt y .tmp-job.txt).
 * No se commitean (gitignore). Run: npm run test:ats-real
 */
import { existsSync, readFileSync } from "fs";
import { analyzeAts } from "../src/lib/ats/engine";
import { filterSkillTerms, isJunkPhrase } from "../src/lib/ats/phraseFilter";
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

const cvPath = "scripts/.tmp-cv.txt";
const jobPath = "scripts/.tmp-job.txt";

if (!existsSync(cvPath) || !existsSync(jobPath)) {
  console.error("Faltan fixtures reales (scripts/.tmp-cv.txt y .tmp-job.txt). Omite en CI.");
  process.exit(0);
}

const CV = readFileSync(cvPath, "utf8");
const JOB = readFileSync(jobPath, "utf8");
if (CV.length < 200 || JOB.length < 200) {
  console.error("Fixtures demasiado cortos");
  process.exit(1);
}

const fails: string[] = [];
function assert(name: string, cond: boolean, detail: string) {
  if (!cond) fails.push(`${name}: ${detail}`);
  else console.log("OK", name);
}

const r = analyzeAts({ cvText: CV, jobText: JOB });
const junk = [
  ...r.mustHave.missing,
  ...r.mustHave.matched,
  ...r.hardSkills.missing,
  ...r.hardSkills.matched,
  ...r.missingKeywords,
].filter((t) => isJunkPhrase(t));

assert("no-junk", junk.length === 0, junk.join("|"));
assert("score-credible", r.score >= 45, `score=${r.score} (CV senior vs rol plataforma debería ser usable)`);
assert(
  "matches-core",
  [...r.mustHave.matched, ...r.hardSkills.matched].some((t) => /itil|aws|azure|liderazgo|automat/i.test(t)),
  `matched=${r.mustHave.matched.join(",")}`
);
assert(
  "gaps-are-skills",
  r.mustHave.missing.every((t) => !/estamos|buscando|cliente|salario/i.test(t)),
  r.mustHave.missing.join(",")
);

const letter = buildLocalCoverLetter({
  cvText: CV,
  jobText: JOB,
  matched: filterSkillTerms(r.mustHave.matched),
  missing: filterSkillTerms(r.mustHave.missing),
});
console.log("\n--- CARTA ---\n", letter, "\n");
assert("letter-ok", !isFakeCoverLetter(letter) && !isLeakedAiFallback(letter), "carta");
assert("letter-name", /CARLOS|LÓPEZ|Lopez/i.test(letter), "sin nombre");
assert("letter-role", /gerente|plataforma|infraestructura/i.test(letter), "sin rol");
assert("letter-not-cliente-raw", !/selección \/ cliente,/i.test(letter), letter.slice(0, 80));

const tips = buildLocalApplicationTips(r);
console.log("--- TIPS ---\n", tips, "\n");
assert("tips-ok", !isLeakedAiFallback(tips) && /1\)/.test(tips), "tips");

const bullets = buildLocalBulletRewrites({ result: r, cvText: CV });
console.log("--- VIÑETAS ---\n", bullets.slice(0, 900), "\n");
assert("bullets-ok", !isLeakedAiFallback(bullets) && /Original:|Ejemplo/i.test(bullets), "bullets");

const plan = buildCvPatchPlan(r);
const patch = applyLocalSurgicalPatch(CV, plan);
console.log("--- PARCHE applied ---\n", patch.applied);
console.log("--- changelog ---\n", patch.changelog.slice(0, 800), "\n");
assert("patch-cv", !isFakeCvRewrite(patch.cv, CV) && /CARLOS EMILIO/i.test(patch.cv) && /VANTI/i.test(patch.cv), "parche");
assert(
  "patch-no-invent-gcp",
  !patch.applied.some((a) => /\bgcp\b/i.test(a)) || /gcp|google cloud/i.test(CV),
  "no debe inventar GCP"
);

console.log(JSON.stringify({ score: r.score, mustMatched: r.mustHave.matched, mustMissing: r.mustHave.missing }, null, 2));

if (fails.length) {
  console.error("FAILURES:\n", fails.join("\n"));
  process.exit(1);
}
console.log("REAL CV+JD VALUE OK");
