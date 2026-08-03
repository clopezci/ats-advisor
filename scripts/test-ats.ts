import { analyzeAts } from "../src/lib/ats/engine";
import { detectAtsProfile } from "../src/lib/ats/detectAts";
import { localTfidfScore } from "../src/lib/ats/embeddings";
import { compareAtsResults } from "../src/lib/ats/compare";
import { analyzeBullets } from "../src/lib/ats/bulletQuality";

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

const cv = `
Juan Pérez
juan@mail.com · +57 300 123 4567 · linkedin.com/in/juanperez
Resumen profesional
Analista financiero con 5 años de experiencia en excel avanzado, sap y tesorería.
Experiencia
- Lideré el cierre mensual en SAP FI reduciendo el ciclo de cobranza 18%.
- Mejoré el flujo de caja coordinando tesorería con un equipo de 4 personas.
Skills
Excel, SAP, Tesorería, Power BI, Inglés B2, Liderazgo
Educación
Profesional en Finanzas
`;

const job = `
Buscamos analista financiero con 4 años de experiencia, excel avanzado, sap, tesorería,
flujo de caja, inglés B2 y liderazgo. Trabajo en equipo y Power BI deseable.
Requisitos
- 4 años de experiencia
- Excel y SAP
- Inglés B2
Deseable
- Power BI
`;

const result = analyzeAts({ cvText: cv, jobText: job, atsProfile: "workday" });
assert(typeof result.semanticScore === "number", "sin semanticScore");
assert(result.score > 40, `score bajo: ${result.score}`);
assert(result.matchedKeywords.length > 0, "sin matches");
assert(Array.isArray(result.actions), "sin actions");
assert(result.mustHave && Array.isArray(result.mustHave.matched), "sin mustHave");
assert(result.atsInsights?.length > 0, "sin atsInsights");
assert(result.nextSteps?.length > 0, "sin nextSteps");
assert(result.applicationTips?.length > 0, "sin applicationTips");
assert(result.heatmap?.length > 0, "sin heatmap");
assert(result.embeddingProvider, "sin embeddingProvider");
assert(Array.isArray(result.sectionHits), "sin sectionHits");
assert(result.bulletQuality && typeof result.bulletQuality.avgScore === "number", "sin bulletQuality");
assert(Array.isArray(result.placementGuide), "sin placementGuide");
assert(result.parsePreview?.email, "sin parse email");

const weak = analyzeAts({
  cvText: "Hola soy candidato",
  jobText: job,
  atsProfile: "taleo",
});
assert(weak.score < result.score, "weak debería puntuar menos");

const improved = analyzeAts({
  cvText: cv + "\nPower BI dashboards para gerencia.",
  jobText: job,
  atsProfile: "workday",
});
const delta = compareAtsResults(result, improved);
assert(typeof delta.delta === "number", "sin delta");

const det = detectAtsProfile({
  jobUrl: "https://company.wd5.myworkdayjobs.com/en-US/External/job/Analyst",
});
assert(det.profile === "workday", `detect workday got ${det.profile}`);
assert(det.confidence === "high", "detect confidence");

assert(localTfidfScore(cv, job) > 0, "tfidf");
assert(analyzeBullets(cv).total > 0, "bullets");

console.log("ats engine tests ok", {
  strong: result.score,
  weak: weak.score,
  semantic: result.embeddingProvider,
  detect: det.profile,
  bullets: result.bulletQuality.avgScore,
});
