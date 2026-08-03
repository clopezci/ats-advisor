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

/** Vista “cómo te parsea el ATS”: campos estructurados aproximados. */
export function parseCvPreview(cv: string): {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  summary: string;
  skills: string[];
  experienceSnippets: string[];
  educationSnippets: string[];
} {
  const email = (cv.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i) || [])[0] || "";
  const phone = (cv.match(/(?:\+?\d{1,3}[\s-]?)?(?:\(?\d{2,3}\)?[\s-]?)?\d{3}[\s-]?\d{4}|\+\d{10,15}/) || [])[0] || "";
  const linkedin = (cv.match(/linkedin\.com\/in\/[a-z0-9\-_%]+/i) || [])[0] || "";
  const firstLines = cv
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const name =
    firstLines.find(
      (l) =>
        l.length > 3 &&
        l.length < 60 &&
        !/@/.test(l) &&
        !/experiencia|educaci|skills|perfil|resumen|objetivo/i.test(l)
    ) || "";

  const summaryMatch = cv.match(
    /(?:resumen|perfil\s+profesional|objetivo|summary)[:\s]*([\s\S]{40,500}?)(?=\n\s*(?:experiencia|experience|educaci|skills|habilidades)|$)/i
  );
  const skillsMatch = cv.match(
    /(?:skills|habilidades|competencias|tecnolog[ií]as)[:\s]*([\s\S]{20,500}?)(?=\n\s*(?:experiencia|educaci|idiomas|certific)|$)/i
  );
  const skills = (skillsMatch?.[1] || "")
    .split(/[,|•\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1 && s.length < 40)
    .slice(0, 24);

  const expMatch = cv.match(
    /(?:experiencia|experience|historial\s+laboral)[:\s]*([\s\S]{80,2500}?)(?=\n\s*(?:educaci[oó]n|estudios|skills|habilidades|certific)|$)/i
  );
  const experienceSnippets = (expMatch?.[1] || "")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 20)
    .slice(0, 8);

  const eduMatch = cv.match(
    /(?:educaci[oó]n|estudios|formaci[oó]n)[:\s]*([\s\S]{20,800}?)(?=\n\s*(?:skills|habilidades|experiencia|idiomas|certific)|$)/i
  );
  const educationSnippets = (eduMatch?.[1] || "")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 8)
    .slice(0, 5);

  return {
    name,
    email,
    phone,
    linkedin,
    summary: (summaryMatch?.[1] || firstLines.slice(1, 4).join(" ")).slice(0, 400).trim(),
    skills,
    experienceSnippets,
    educationSnippets,
  };
}

export { SECTION_SPLIT };
