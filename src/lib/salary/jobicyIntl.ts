/**
 * Validación salarial internacional vía Jobicy.
 * Jobicy Salary API no cubre Colombia ni LATAM; solo estos mercados.
 * Docs: title/country admiten nombre o slug/código (ej. ai-engineer, ca).
 */

export const JOBICY_MARKETS: { name: string; code: string }[] = [
  { name: "Australia", code: "au" },
  { name: "Austria", code: "at" },
  { name: "Belgium", code: "be" },
  { name: "Canada", code: "ca" },
  { name: "France", code: "fr" },
  { name: "Germany", code: "de" },
  { name: "Ireland", code: "ie" },
  { name: "Italy", code: "it" },
  { name: "Japan", code: "jp" },
  { name: "Netherlands", code: "nl" },
  { name: "New Zealand", code: "nz" },
  { name: "Portugal", code: "pt" },
  { name: "Spain", code: "es" },
  { name: "Sweden", code: "se" },
  { name: "Switzerland", code: "ch" },
  { name: "United Arab Emirates", code: "ae" },
  { name: "United Kingdom", code: "uk" },
  { name: "United States", code: "us" },
];

export const JOBICY_COUNTRIES = JOBICY_MARKETS.map((m) => m.name);

export type JobicyCountry = (typeof JOBICY_COUNTRIES)[number];

export const JOBICY_DEFAULT_COUNTRY: JobicyCountry = "United States";

/** Títulos en inglés / slug (Jobicy acepta ambos; preferimos nombre legible). */
export const ROLE_TITLE_EN: Record<string, string> = {
  analista_junior: "Junior Analyst",
  analista_semi: "Analyst",
  especialista: "Specialist",
  coordinador: "Team Lead",
  gerente: "Manager",
  dir_ops: "Director",
  dev_mid: "Software Engineer",
  dev_senior: "Senior Software Engineer",
  data_mid: "Data Analyst",
  data_senior: "Senior Data Scientist",
  finanzas_mid: "Financial Analyst",
  finanzas_senior: "Senior Financial Analyst",
  ops_supply: "Supply Chain Manager",
  rh_bp: "HR Business Partner",
  comercial_b2b: "Account Executive",
};

export function isJobicyCountry(value: string): value is JobicyCountry {
  return JOBICY_COUNTRIES.includes(value as JobicyCountry);
}

/** Código ISO/slug para el query `country` (recomendado en Quick Start). */
export function jobicyCountryCode(nameOrCode: string): string {
  const raw = nameOrCode.trim();
  const byName = JOBICY_MARKETS.find((m) => m.name.toLowerCase() === raw.toLowerCase());
  if (byName) return byName.code;
  const byCode = JOBICY_MARKETS.find((m) => m.code.toLowerCase() === raw.toLowerCase());
  if (byCode) return byCode.code;
  return raw.toLowerCase().slice(0, 8);
}

export function jobicyTitleForRole(roleId: string, fallbackLabel: string): string {
  return ROLE_TITLE_EN[roleId] || fallbackLabel;
}

export const INTL_PURCHASE_DISCLAIMER =
  "Entiendo que esta opción es solo para validar rangos salariales internacionales con Jobicy. " +
  "Colombia y LATAM no están en el proveedor. Solo puedo consultar los países listados en la información del botón (ⓘ). " +
  "Los resultados son orientativos y no sustituyen la matriz Colombia ni una oferta real.";

export const COLOMBIA_CALIBRATION_SOURCES: { name: string; detail: string; url?: string }[] = [
  {
    name: "Guía Salarial Buk Colombia",
    detail:
      "Estudio de bandas por cargo a partir de registros de nómina del sector privado formal (referencia de calibración; no API en vivo).",
    url: "https://www.buk.co/recursos/estudios-de-gestion-de-personas/guia-salarial-colombia-2026",
  },
  {
    name: "Levels.fyi (Colombia, tech)",
    detail:
      "Reportes de compensación total en roles de tecnología; útil como ancla de techos, no como nómina estándar.",
    url: "https://www.levels.fyi/t/software-engineer/locations/colombia",
  },
  {
    name: "SalariosTech",
    detail: "Medianas y percentiles reportados por la comunidad tech en Colombia (encuestas anónimas).",
    url: "https://salariostech.co/",
  },
  {
    name: "La Plaza Devs · salarios",
    detail: "Encuestas abiertas de desarrolladores en Colombia (CSV comunitario; calibración, no certificación).",
    url: "https://github.com/laplazadevs/salarios",
  },
  {
    name: "Ajuste CPI mensual (ATSAdvisor)",
    detail: "Factor de actualización en snapshot vía cron; no es microdato oficial DANE por cargo.",
  },
];
