/** Sinónimos laborales ES para match semántico liviano (sin LLM). */

export const SYNONYMS: Record<string, string[]> = {
  excel: ["microsoft excel", "hojas de calculo", "hojas de cálculo", "office"],
  "power bi": ["powerbi", "business intelligence", "bi"],
  python: ["py", "django", "flask", "pandas"],
  sql: ["mysql", "postgresql", "postgres", "t-sql", "bases de datos"],
  javascript: ["js", "typescript", "ts", "node", "nodejs"],
  react: ["reactjs", "react.js", "nextjs", "next.js"],
  aws: ["amazon web services", "s3", "ec2", "lambda"],
  azure: ["microsoft azure", "entra id"],
  sap: ["sap hana", "sap fi", "sap mm", "sap sd"],
  ingles: ["inglés", "english", "bilingue", "bilingüe", "b2", "c1"],
  liderazgo: ["lider", "líder", "coordine", "coordinacion", "supervisión", "supervision"],
  "trabajo en equipo": ["colaboracion", "colaboración", "equipos multidisciplinarios"],
  negociacion: ["negociación", "cierres", "persuasion", "persuasión"],
  contabilidad: ["contable", "nif", "niif", "estados financieros"],
  tesoreria: ["tesorería", "flujo de caja", "liquidez", "cash flow"],
  marketing: ["mercadeo", "digital marketing", "growth", "seo", "sem"],
  scrum: ["agile", "ágil", "kanban", "sprint"],
  jira: ["atlassian", "confluence"],
};

export function expandTerm(term: string): string[] {
  const key = term.toLowerCase();
  const extras = SYNONYMS[key] || [];
  for (const [k, vals] of Object.entries(SYNONYMS)) {
    if (vals.some((v) => v === key || key.includes(v) || v.includes(key))) {
      return Array.from(new Set([term, k, ...vals, ...extras]));
    }
  }
  return Array.from(new Set([term, ...extras]));
}

export function textHasTerm(haystackNorm: string, term: string): boolean {
  const variants = expandTerm(term);
  return variants.some((v) => haystackNorm.includes(v.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "")));
}
