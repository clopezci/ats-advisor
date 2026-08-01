/**
 * Smoke E2E-ish checks against plan §8 quality criteria (no browser).
 * Runs offline without secrets.
 */
import { analyzeAts } from "../src/lib/ats/engine";
import { OUTPLACEMENT_MODULES } from "../src/lib/outplacement/modules";
import { applyPromotion, defaultSettings } from "../src/lib/settings";
import { retrieveKnowledge } from "../src/lib/ai/knowledge";
import { canGenerateOut09, defaultEntitlement } from "../src/lib/entitlements";
import { semanticOverlapScore } from "../src/lib/ats/semantic";

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

const cv = `Ana López. Analista de datos con 4 años. Python, SQL, Power BI. Reduje el tiempo de reporting 35%. Inglés B2.`;
const job = `Buscamos analista de datos con Python, SQL, Power BI, 3 años e inglés.`;

const ats = analyzeAts({ cvText: cv, jobText: job, atsProfile: "greenhouse" });
assert(ats.score > 30, "ATS score");
assert(ats.explanation.length > 0, "explicabilidad");
assert(typeof ats.semanticScore === "number", "semantic");

assert(OUTPLACEMENT_MODULES.every((m) => m.capsules.every((c) => c.quiz)), "quizzes");

const settings = defaultSettings();
settings.promotions = [{ name: "Test", code: "TEST50", percent: 50, amount: 0, starts: "", ends: "" }];
const priced = applyPromotion(79000, "TEST50", settings.promotions);
assert(priced.amount === 39500, `coupon got ${priced.amount}`);

const kb = retrieveKnowledge("entrevista STAR negociación salarial", 3, 2000);
assert(kb.length > 100, "RAG retrieve");

assert(!canGenerateOut09(defaultEntitlement()).ok, "free paywall");
assert(semanticOverlapScore(cv, job) > 10, "semantic overlap");

console.log("smoke e2e ok", {
  ats: ats.score,
  modules: OUTPLACEMENT_MODULES.length,
  coupon: priced.amount,
  kbChars: kb.length,
});
