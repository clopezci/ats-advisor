/** Qué alcanza a ver un reclutador en los primeros ~8 segundos del CV. */

export type RecruiterSkim = {
  seconds: number;
  firstGlance: string[];
  redFlags: string[];
  greenFlags: string[];
  verdict: string;
  fixNow: string[];
};

function fold(s: string): string {
  return s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

const ROLE_LINE =
  /^(gerente|director[a]?|analista|ingenier[oa]|l[ií]der|jefe|jefa|coordinador[a]?|especialista|consultor[a]?|head|manager|vp|vicepresidente|subgerente)\b/i;

/** Cargo de la oferta, no una palabra clave suelta. */
export function guessJobRole(jobText: string): string {
  const lines = jobText
    .split("\n")
    .map((l) => l.replace(/^[#*\-\d.)\s]+/, "").trim())
    .filter(Boolean);
  const hit = lines.find(
    (l) => l.length >= 8 && l.length <= 80 && ROLE_LINE.test(l) && !/[.!?]/.test(l)
  );
  return hit || "";
}

function titleCoverage(head: string, title: string): "full" | "partial" | "missing" {
  const stop = new Set(["para", "con", "del", "los", "las", "una", "uno", "the", "and"]);
  const words = fold(title)
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stop.has(w));
  if (!words.length) return "missing";
  const h = fold(head);
  const hits = words.filter((w) => h.includes(w));
  if (hits.length === words.length) return "full";
  if (hits.length > 0) return "partial";
  return "missing";
}

export function recruiterSkim(cvText: string, jobText = ""): RecruiterSkim {
  const lines = cvText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const head = lines.slice(0, 12).join("\n");
  const firstGlance: string[] = [];
  const redFlags: string[] = [];
  const greenFlags: string[] = [];
  const fixNow: string[] = [];

  const name = lines[0]?.slice(0, 80) || "";
  if (name && name.length < 60 && !/@/.test(name) && !/^\d/.test(name)) {
    greenFlags.push(`Se ve tu nombre arriba: “${name}”.`);
  } else {
    redFlags.push("No se ve un nombre claro en la primera línea.");
    fixNow.push("Pon tu nombre completo en la primera línea, solo, sin diseño.");
  }

  if (/@|linkedin\.com|\+\d|\b(cel|tel|m[oó]vil|whatsapp)\b/i.test(head)) {
    greenFlags.push("Se ve cómo contactarte (correo, celular o LinkedIn) en las primeras líneas.");
  } else {
    redFlags.push("En las primeras líneas no se ve correo, celular ni LinkedIn.");
    fixNow.push("Deja correo, celular y LinkedIn justo debajo del nombre.");
  }

  const hasImpact = /\d+\s*%|\$\s*\d|\d+\s*(personas|usuarios|clientes|millones)/i.test(head);
  if (hasImpact) {
    greenFlags.push("Hay un logro con cifra en lo primero que se lee (un %, plata o personas).");
  } else {
    redFlags.push(
      "En lo primero que se lee no hay un logro con cifra. El celular y los años de experiencia no cuentan como logro."
    );
    fixNow.push(
      "Sube 1 o 2 logros con cifra a las primeras viñetas: un porcentaje, plata ahorrada o cuántas personas."
    );
  }

  const role = guessJobRole(jobText);
  if (role) {
    const cover = titleCoverage(head, role);
    if (cover === "full") {
      greenFlags.push(`El cargo de la vacante se lee arriba: ${role}.`);
    } else if (cover === "partial") {
      redFlags.push(
        `Se lee el tema de la vacante, pero no el cargo completo “${role}”.`
      );
      fixNow.push(`En la línea bajo tu nombre escribe el cargo al que aplicas: ${role}.`);
    } else {
      redFlags.push(`El cargo de esta vacante no aparece arriba: “${role}”.`);
      fixNow.push(`En la línea bajo tu nombre escribe el cargo al que aplicas: ${role}.`);
    }
  }

  if (cvText.length > 9000) {
    redFlags.push("La hoja es muy larga para una primera mirada.");
    fixNow.push("Déjala en 1 o 2 páginas, solo con lo que pide esta vacante.");
  }

  if (/\t{2,}/.test(head)) {
    redFlags.push("El encabezado parece ir en columnas. Un reclutador y el filtro ATS leen mal ese formato.");
    fixNow.push("Pasa el encabezado a una sola columna: nombre, cargo, contacto, uno debajo del otro.");
  }

  const verdict =
    redFlags.length === 0
      ? "En esos 8 segundos se ve quién eres, a qué cargo vas y un logro con cifra. Lo normal es que el reclutador siga leyendo."
      : greenFlags.length >= 2 && redFlags.length <= 2
        ? "Se entiende quién eres, pero en la primera pantalla falta algo para que siga leyendo."
        : "En esos 8 segundos no queda claro quién eres o por qué seguir leyendo. Arregla primero lo de abajo.";

  firstGlance.push(...greenFlags.slice(0, 2));

  return {
    seconds: 8,
    firstGlance: firstGlance.slice(0, 4),
    redFlags,
    greenFlags,
    verdict,
    fixNow: fixNow.slice(0, 5),
  };
}
