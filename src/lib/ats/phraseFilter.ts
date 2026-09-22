/** Filtro de frases basura en ofertas LATAM (stopwords + boilerplate JD). */

const STOP = new Set(
  [
    "a",
    "al",
    "ante",
    "bajo",
    "con",
    "contra",
    "de",
    "del",
    "desde",
    "durante",
    "en",
    "entre",
    "hacia",
    "hasta",
    "mediante",
    "para",
    "por",
    "según",
    "segun",
    "sin",
    "so",
    "sobre",
    "tras",
    "versus",
    "via",
    "el",
    "la",
    "los",
    "las",
    "un",
    "una",
    "unos",
    "unas",
    "un/a",
    "y",
    "o",
    "u",
    "e",
    "que",
    "qué",
    "como",
    "cómo",
    "donde",
    "dónde",
    "cuando",
    "cuándo",
    "cual",
    "cuál",
    "cuales",
    "cuáles",
    "quien",
    "quién",
    "esto",
    "esta",
    "este",
    "estos",
    "estas",
    "eso",
    "esa",
    "ese",
    "esos",
    "esas",
    "hay",
    "ser",
    "es",
    "son",
    "fue",
    "sera",
    "será",
    "sea",
    "siendo",
    "tiene",
    "tienen",
    "tener",
    "debe",
    "deben",
    "debes",
    "debera",
    "deberá",
    "puede",
    "pueden",
    "mas",
    "más",
    "muy",
    "tambien",
    "también",
    "solo",
    "sólo",
    "ya",
    "asi",
    "así",
    "aqui",
    "aquí",
    "allí",
    "alli",
    "nos",
    "les",
    "lo",
    "le",
    "se",
    "su",
    "sus",
    "nuestro",
    "nuestra",
    "nuestros",
    "nuestras",
    "tu",
    "tus",
    "mi",
    "mis",
    "acerca",
    "empleo",
    "importante",
    "aliada",
    "aliado",
    "requiere",
    "requerimos",
    "buscamos",
    "buscando",
    "busca",
    "estamos",
    "oferta",
    "vacante",
    "puesto",
    "cargo",
    "rol",
    "descripcion",
    "descripción",
    "detalle",
    "detalles",
    "informacion",
    "información",
    "empresa",
    "compania",
    "compañia",
    "compañía",
    "cliente",
    "equipo",
    "equipos",
    "trabajo",
    "personas",
    "persona",
    "experiencia",
    "años",
    "anos",
    "requisitos",
    "requisito",
    "funciones",
    "responsabilidades",
    "beneficios",
    "ofrecemos",
    "salario",
    "integral",
    "bono",
    "performance",
    "auxilio",
    "salud",
    "contrato",
    "directo",
    "indefinido",
    "modalidad",
    "oficina",
    "casa",
    "retom",
    "reto",
    "asumir",
    "combine",
    "combinar",
    "liderar",
    "evolucionar",
    "entorno",
    "alta",
    "criticidad",
    "transformacion",
    "transformación",
    "exigencia",
    "operativa",
    "operativo",
    "colombia",
    "bogota",
    "bogotá",
    "medellin",
    "medellín",
    "remoto",
    "presencial",
    "hibrido",
    "híbrido",
    "tiempo",
    "completo",
    "parcial",
    "the",
    "and",
    "for",
    "with",
    "our",
    "you",
    "your",
    "will",
    "are",
    "job",
    "about",
    "role",
    "team",
    "work",
    "company",
  ].map((s) => s.toLowerCase())
);

/** Bigramas / frases típicas de intros y CTAs de portales. */
const JUNK_PHRASE =
  /^(acerca del|del empleo|empleo importante|importante aliad[oa]|aliad[oa] requiere|requiere profesional|profesional ingenier|carreras afines|afines especializaci|especializaci[oó]n maestr|maestr[ií]a areas|areas relacionadas|relacionadas con|con tecnolog|tecnolog[ií]a desarrollo|desarrollo software|software transformaci|transformaci[oó]n digital|digital gesti[oó]n|sobre el|descripcion del|descripción del|que buscamos|qué buscamos|perfil del|acerca de|estamos buscando|buscando un.?a|busca un.?a|nuestro cliente|cliente una|una importante|importante compania|importante compañia|compania del|compañia del|del sector|sector financiero|financiero busca|un.?a gerente|un.?a lider|gerente plataforma|plataforma digital|digital infraestructura|infraestructura nuestro|asumir reto|evolucionar plataforma|entorno alta|alta criticidad|que ofrecemos|ofrecemos salario|salario \d|bono por|auxilio salud|contrato directo|directo indefinido|que combine|con liderando|combine liderazgo|reto liderar|liderar evolucionar|liderando operaciones)$/i;

/** Tokens ambiguos cortos que suelen ser falsos positivos. */
const AMBIGUOUS_SHORT = new Set(["ui", "ux", "mm", "fi", "co", "sem", "seo", "rpa"]);

export function normalizePhrase(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/un\/a/g, "una")
    .replace(/[^a-z0-9áéíóúñü+#.\s/-]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function isStopToken(t: string) {
  const n = normalizePhrase(t);
  return STOP.has(n) || n.length < 2;
}

/** true = no usar como must-have / keyword de impacto. */
export function isJunkPhrase(phrase: string): boolean {
  const n = normalizePhrase(phrase);
  if (!n || n.length < 3) return true;
  if (JUNK_PHRASE.test(n)) return true;
  // Pegotes tipo cloud devopsfinops / gcpobservabilidad
  if (/[a-z]{3,}(?:devops|finops|aiops|itil|aws|azure|gcp|observabilidad)/i.test(n.replace(/\s/g, ""))) {
    if (!/\s/.test(n) && n.length > 12) return true;
  }
  if (/\d{2,}\.\d{3}/.test(n)) return true; // salarios
  if (/\b(salario|bono|auxilio|contrato|ofrecemos|postulate|hoja de vida)\b/.test(n)) return true;

  const tokens = n.split(" ").filter(Boolean);
  if (!tokens.length) return true;
  if (tokens.every((t) => isStopToken(t))) return true;

  const content = tokens.filter((t) => !isStopToken(t));
  if (content.length === 0) return true;

  // Bigrama con artículo/conector: "del sector", "nuestro cliente", "que combine"
  if (tokens.length >= 2 && tokens.some((t) => isStopToken(t)) && content.length <= 1) return true;
  if (tokens.length >= 2 && content.length === 1 && content[0].length < 6) return true;

  // Unigramas ambiguos demasiado cortos
  if (tokens.length === 1 && AMBIGUOUS_SHORT.has(tokens[0])) return true;

  if (/^(acerca|sobre|descripcion|descripción|detalle|informacion|información|estamos|buscando|busca|buscamos)\b/.test(n)) {
    return true;
  }
  if (/\b(empleo|vacante|oferta|puesto|cliente|compania|compañia)\b/.test(n) && content.length <= 2) {
    return true;
  }

  // Frases con puntuación residual o pegadas sin sentido
  if (/\.\s*\w/.test(phrase) && tokens.length <= 3) return true;

  return false;
}

/** Filtra listas de términos para UI / score. */
export function filterSkillTerms(list: string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const raw of list) {
    const t = String(raw || "").trim().replace(/\.+$/, "");
    if (!t || isJunkPhrase(t)) continue;
    const key = normalizePhrase(t);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(t);
  }
  return out;
}

export { STOP as PHRASE_STOPWORDS };
