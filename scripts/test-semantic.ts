import { semanticOverlapScore, cosineSimilarity, tokenFrequency } from "../src/lib/ats/semantic";

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

const a = tokenFrequency("analista financiero excel sap tesoreria");
const b = tokenFrequency("analista financiero excel sap flujo de caja");
const sim = cosineSimilarity(a, b);
assert(sim > 0.3, `cosine too low ${sim}`);

const score = semanticOverlapScore(
  "Desarrollador react typescript con 3 años",
  "Buscamos desarrollador react typescript senior"
);
assert(score > 20, `semantic score low ${score}`);

const low = semanticOverlapScore("cocina pasta", "ingeniero de datos spark");
assert(low < score, "unrelated should score lower");

console.log("semantic tests ok", { sim, score, low });
