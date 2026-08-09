/** CV bilingüe ES→EN + checklist remoto LATAM. */

export const REMOTE_CHECKLIST = [
  { id: "tz", label: "Overlap horario explícito (ej. 4h con EST / CET)" },
  { id: "async", label: "Evidencia de trabajo async (docs, PRs, tickets)" },
  { id: "en", label: "Nivel de inglés declarado con honestidad (B2/C1 + prueba)" },
  { id: "tools", label: "Stack de colaboración: Slack/Notion/Jira/Git" },
  { id: "contract", label: "Tipo de vínculo claro: laborar local, contractor, EOR" },
  { id: "pay", label: "Moneda y ciclo de pago (USD/EUR + fees)" },
  { id: "equip", label: "Equipo / internet / home office en la oferta" },
  { id: "fraud", label: "Red flags: pedir dinero por “capacitación” o cripto adelantado" },
];

/** Frases frecuentes ES → EN para bullets (no traduce CV completo; guía). */
export const BULLET_GLOSSARY: { es: string; en: string }[] = [
  { es: "Lideré", en: "Led / Owned" },
  { es: "Implementé", en: "Implemented / Delivered" },
  { es: "Reduje costos en", en: "Reduced costs by" },
  { es: "Aumenté ingresos", en: "Increased revenue" },
  { es: "Coordine un equipo de", en: "Coordinated a team of" },
  { es: "Automatizé", en: "Automated" },
  { es: "Diseñé e implementé", en: "Designed and rolled out" },
  { es: "Gestión de stakeholders", en: "Stakeholder management" },
  { es: "Mejora continua", en: "Continuous improvement" },
  { es: "Indicadores / KPIs", en: "KPIs / metrics" },
  { es: "Atención a clientes", en: "Customer support / success" },
  { es: "Cumplimiento normativo", en: "Regulatory compliance" },
];

export const EN_CV_RULES = [
  "Una columna, tipografía estándar, sin tablas decorativas (igual que ATS en ES).",
  "Verbos en pasado simple para roles cerrados; presente para el actual.",
  "Cuantifica: %, tiempo, dinero, tamaño de equipo — los reclutadores US/EU lo esperan.",
  "Evita traducir literal “responsable de”; usa owned / accountable for / delivered.",
  "Headline LinkedIn EN: Role | Domain | Proof (no lista de adjetivos).",
  "No inventes nivel de inglés: si es B2, dilo y muestra evidencia (reuniones, docs).",
];

/** Traducción asistida muy simple de viñetas (glosario + aviso humano). */
export function assistBulletToEn(es: string): string {
  let out = es.trim();
  for (const g of BULLET_GLOSSARY) {
    const re = new RegExp(g.es, "gi");
    out = out.replace(re, g.en);
  }
  return out;
}

export const REMOTE_STORAGE_KEY = "ats_remote_checklist";
