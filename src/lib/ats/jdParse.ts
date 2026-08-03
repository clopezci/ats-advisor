/** Extrae requisitos must-have vs nice-to-have de una oferta (heurística LATAM/ES). */

const MUST_HEADERS =
  /requisitos?\s*(excluyentes?|obligatorios?|indispensables?)|experiencia\s+requerida|obligatorio|imprescindible|must[- ]have|required\s+qualifications?|requirements?|perfil\s+buscado|qué\s+buscamos|que\s+buscamos/i;

const NICE_HEADERS =
  /deseable|plus|nice[- ]to[- ]have|valoraremos|se\s+valora|preferible|idealmente|optional|ventaja|conocimientos?\s+adicionales/i;

const SECTION_SPLIT = /\n(?=[A-ZÁÉÍÓÚÑÜ][^\n]{0,60}:?\s*$)|(?=requisitos|funciones|responsabilidades|ofrecemos|beneficios)/i;

export function splitJobSections(jobText: string): { must: string; nice: string; rest: string } {
  const text = jobText.replace(/\r/g, "\n");
  const lines = text.split("\n");
  let mode: "must" | "nice" | "rest" = "rest";
  const must: string[] = [];
  const nice: string[] = [];
  const rest: string[] = [];

  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    if (MUST_HEADERS.test(t) && t.length < 80) {
      mode = "must";
      continue;
    }
    if (NICE_HEADERS.test(t) && t.length < 80) {
      mode = "nice";
      continue;
    }
    if (/^(funciones|responsabilidades|qué harás|que haras|actividades|beneficios|ofrecemos)/i.test(t) && t.length < 80) {
      mode = "rest";
      continue;
    }
    if (mode === "must") must.push(t);
    else if (mode === "nice") nice.push(t);
    else rest.push(t);
  }

  // Si no hubo sección must, usa requisitos genéricos del cuerpo
  if (!must.length) {
    const blob = text;
    const m = blob.match(
      /(?:requisitos?|requirements?|perfil)[:\s]+([\s\S]{80,1200}?)(?=\n\s*(?:beneficios|ofrecemos|funciones|responsabilidades)|$)/i
    );
    if (m) must.push(m[1]);
  }

  return {
    must: must.join("\n") || text.slice(0, 800),
    nice: nice.join("\n"),
    rest: rest.join("\n"),
  };
}

export function detectCvSections(cv: string): {
  experience: boolean;
  education: boolean;
  skills: boolean;
  contact: boolean;
  summary: boolean;
} {
  const n = cv.toLowerCase();
  return {
    experience: /experiencia|experience|historial\s+laboral|empleo/.test(n),
    education: /educaci[oó]n|estudios|formación|formacion|education|universidad|t[ií]tulo/.test(n),
    skills: /habilidades|skills|competencias|conocimientos\s+t[eé]cnicos|tecnolog[ií]as/.test(n),
    contact: /@|whatsapp|tel[eé]fono|linkedin\.com|celular|\+\d{2}/.test(n),
    summary: /resumen|perfil\s+profesional|objetivo|summary|acerca\s+de\s+m[ií]/.test(n),
  };
}

export { SECTION_SPLIT };
