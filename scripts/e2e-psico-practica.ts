/**
 * Perfil, alcance de la práctica y precio. No llama a la IA.
 * Run: npx tsx scripts/e2e-psico-practica.ts
 */
import { BLOQUES_PERFIL, PARES_CALIBRACION } from "../src/lib/psicotecnicas/cuestionario";
import { buildPersonalidadMd, perfilListo } from "../src/lib/psicotecnicas/perfil";
import {
  assessPracticeQuestion,
  parseCaso,
  parseHint,
  parsePracticeAnswer,
} from "../src/lib/psicotecnicas/practicaScope";
import { PSICO_PRACTICA_MONTHLY_CAP, PSICO_PRACTICA_PRICE_COP } from "../src/lib/psicotecnicas/practicaAccess";
import { parseCheckoutPlan } from "../src/lib/validation";

const fails: string[] = [];
function assert(name: string, cond: boolean, detail = "") {
  if (!cond) fails.push(detail ? `${name}: ${detail}` : name);
  else console.log("OK", name);
}

assert("bloques", BLOQUES_PERFIL.length >= 12, String(BLOQUES_PERFIL.length));
assert("calibracion", PARES_CALIBRACION.length === 12);
assert("precio", PSICO_PRACTICA_PRICE_COP === 39000);
assert("cupo", PSICO_PRACTICA_MONTHLY_CAP === 180);
assert("checkout", parseCheckoutPlan("psico_practica") === "psico_practica");

const answers: Record<string, string> = {
  "trayectoria-1": "Ana Demo",
  "liderazgo-1": "Construyo con el equipo y busco la causa.",
  "valores-1": "Relaciones primero. Ejemplo: frené un despido injusto.",
  "cal-2": "B",
  historia: "En un incidente escalé con datos y seguí acompañando al equipo.",
};
for (let i = 0; i < 12; i++) answers[`trayectoria-${i + 1}`] = answers[`trayectoria-${i + 1}`] || "dato";
assert("perfil-listo", perfilListo(answers));
const md = buildPersonalidadMd(answers);
assert("md-nombre", md.includes("Ana Demo"));
assert("md-equipo", md.includes("Convocar al equipo"));
assert("md-no-inventa", !/virtud perfecta|candidato ideal/i.test(md));

assert("on-serie", assessPracticeQuestion("¿Qué número sigue? 3, 6, 12, 24", false).ok);
assert("on-foto", assessPracticeQuestion("", true).ok);
assert(
  "off-receta",
  !assessPracticeQuestion("Pásame la receta de bandeja paisa con ingredientes", false).ok
);
const off = assessPracticeQuestion("Cuéntame un chiste de animales por favor", false);
assert("off-texto", !off.ok && "reply" in off && off.reply.length > 20);

const parsed = parsePracticeAnswer("RESPUESTA: B\nPOR QUÉ: Coincide con construir en equipo.\nTIPO: situacional");
assert("parse", parsed?.respuesta === "B" && parsed.porque.includes("equipo") && parsed.tipo === "situacional");
assert("pista", parseHint("PISTA: Mira si la serie se duplica.\nTIPO: numerico")?.pista.includes("duplica") === true);
assert("pista-sin-respuesta", parseHint("PISTA: RESPUESTA: B\nTIPO: otro") === null);
const caso = parseCaso(
  "ENUNCIADO: ¿Qué número sigue?\n3, 6, 12, 24\nA) 30\nB) 48\nTIPO: numerico"
);
assert("caso", caso?.tipo === "numerico" && caso.enunciado.includes("48") && !/RESPUESTA/i.test(caso.enunciado));
assert(
  "caso-sin-respuesta",
  parseCaso("ENUNCIADO: corto\nRESPUESTA: B\nTIPO: otro") === null
);

if (fails.length) {
  console.error("\nFAIL", fails.length);
  for (const f of fails) console.error(" -", f);
  process.exit(1);
}
console.log("\nPSICO PRACTICA OK");
