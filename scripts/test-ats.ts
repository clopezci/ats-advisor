import { analyzeAts } from "../src/lib/ats/engine";

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

const cv = `
Juan Pérez
Analista financiero con 5 años de experiencia en excel avanzado, sap y tesorería.
Logré reducir el ciclo de cobranza 18% y mejorar el flujo de caja.
Inglés B2. Liderazgo de equipo de 4 personas.
`;

const job = `
Buscamos analista financiero con 4 años de experiencia, excel avanzado, sap, tesorería,
flujo de caja, inglés B2 y liderazgo. Trabajo en equipo y Power BI deseable.
`;

const result = analyzeAts({ cvText: cv, jobText: job, atsProfile: "workday" });
assert(result.score > 40, `score bajo: ${result.score}`);
assert(result.matchedKeywords.length > 0, "sin matches");
assert(Array.isArray(result.actions), "sin actions");

const weak = analyzeAts({
  cvText: "Hola soy candidato",
  jobText: job,
  atsProfile: "taleo",
});
assert(weak.score < result.score, "weak debería puntuar menos");

console.log("ats engine tests ok", { strong: result.score, weak: weak.score });
