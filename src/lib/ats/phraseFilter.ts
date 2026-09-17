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
    "equipo",
    "trabajo",
    "personas",
    "experiencia",
    "años",
    "anos",
    "años",
    "requisitos",
    "requisito",
    "funciones",
    "responsabilidades",
    "beneficios",
    "ofrecemos",
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
    "contrato",
    "indefinido",
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

/** Bigramas / frases típicas de intros de portales (Computrabajo, LinkedIn, etc.). */
const JUNK_PHRASE =
  /^(acerca del|del empleo|empleo importante|importante aliad[oa]|aliad[oa] requiere|requiere profesional|profesional ingenier|carreras afines|afines especializaci|especializaci[oó]n maestr|maestr[ií]a areas|areas relacionadas|relacionadas con|con tecnolog|tecnolog[ií]a desarrollo|desarrollo software|software transformaci|transformaci[oó]n digital|digital gesti[oó]n|sobre el|descripcion del|descripción del|que buscamos|qué buscamos|perfil del|acerca de)$/i;

export function normalizePhrase(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9áéíóúñü+#.\s/-]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function isStopToken(t: string) {
  return STOP.has(normalizePhrase(t)) || normalizePhrase(t).length < 2;
}

/** true = no usar como must-have / keyword de impacto. */
export function isJunkPhrase(phrase: string): boolean {
  const n = normalizePhrase(phrase);
  if (!n || n.length < 3) return true;
  if (JUNK_PHRASE.test(n)) return true;
  const tokens = n.split(" ").filter(Boolean);
  if (!tokens.length) return true;
  if (tokens.every((t) => isStopToken(t))) return true;
  // bigrama/trigrama solo con stopwords + 1 genérico corto
  const content = tokens.filter((t) => !isStopToken(t));
  if (content.length === 0) return true;
  if (tokens.length >= 2 && content.length === 1 && content[0].length < 5) return true;
  // "ingenieria sistemas" tipo título académico suelto sin verbo/skill: permitir si es formación clara
  // pero rechazar cadenas de intro
  if (/^(acerca|sobre|descripcion|descripción|detalle|informacion|información)\b/.test(n)) return true;
  if (/\b(empleo|vacante|oferta|puesto)\b/.test(n) && content.length <= 2) return true;
  return false;
}

export { STOP as PHRASE_STOPWORDS };
