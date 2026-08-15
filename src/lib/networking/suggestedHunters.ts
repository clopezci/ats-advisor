/** Directorio sugerido de reclutadores / firmas (público, orientativo). Autoría ATSAdvisor. */

export type SuggestedHunter = {
  name: string;
  focus: string;
  region: string;
  note: string;
};

/**
 * Lista ilustrativa de firmas/consultoras conocidas en LATAM/CO.
 * NO es un dump de listas propietarias de terceros.
 * El usuario debe verificar vigencia, contacto real y especialidad.
 */
export const SUGGESTED_HUNTERS: SuggestedHunter[] = [
  {
    name: "Michael Page / PageGroup",
    focus: "Mandos medios y especialistas",
    region: "CO / LATAM",
    note: "Verifica consultores activos en tu ciudad/rol en su sitio.",
  },
  {
    name: "Hays",
    focus: "Especialistas y proyectos",
    region: "CO / LATAM",
    note: "Confirma área (tech, finanzas, ops) con el consultor local.",
  },
  {
    name: "Adecco / Spring Professional",
    focus: "Selección y staffing",
    region: "CO / LATAM",
    note: "Útil para volumen; valida seniority del proceso.",
  },
  {
    name: "ManpowerGroup / Experis",
    focus: "Talento y proyectos tech/ops",
    region: "CO / LATAM",
    note: "Revisa vacantes publicadas y el reclutador asignado.",
  },
  {
    name: "Robert Half",
    focus: "Finanzas, admin, tech (según país)",
    region: "LATAM selecto",
    note: "Confirma si operan en tu país y vertical.",
  },
  {
    name: "Consultoras boutique locales",
    focus: "C-level y niches industriales",
    region: "Ciudad por ciudad",
    note: "Busca por industria + “executive search” + tu ciudad. Valida referencias.",
  },
  {
    name: "Reclutadores in-house (Talent/HRBP)",
    focus: "Empresas de tu shortlist",
    region: "Tu mapa",
    note: "Prioriza Talent de tus top 8 empresas (portal de carrera + perfil).",
  },
];

export const HUNTER_LEGAL_NOTICE =
  "Lista sugerida y orientativa (autoría ATSAdvisor). No es un directorio oficial ni exhaustivo. " +
  "Tú debes verificar, validar y actualizar nombres, especialidades y canales antes de contactar. " +
  "No copies listas propietarias de terceros; construye la tuya con fuentes públicas y tu red.";
