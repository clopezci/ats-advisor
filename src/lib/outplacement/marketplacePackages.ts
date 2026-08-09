/**
 * Empaques de marketplace (coach / CV review) → especialidad de aliado.
 * El cobro de la sesión es entre usuario y aliado; LOTIC concilia comisión semanal.
 */

export type MarketplacePackage = {
  id: string;
  title: string;
  specialty: string;
  duration: string;
  fromCop: number;
  summary: string;
  includes: string[];
};

export const MARKETPLACE_PACKAGES: MarketplacePackage[] = [
  {
    id: "cv-review",
    title: "Revisión de CV / ATS",
    specialty: "cv",
    duration: "1 sesión · ~45 min",
    fromCop: 60000,
    summary: "Un aliado revisa tu HV contra portales LATAM y te deja comentarios accionables.",
    includes: [
      "Checklist ATS (Workday / Taleo / Greenhouse)",
      "3–5 bullets reescritos con impacto",
      "Prioridad de keywords vs la oferta objetivo",
    ],
  },
  {
    id: "interview-prep",
    title: "Prep. entrevista STAR",
    specialty: "entrevista",
    duration: "1 sesión · ~60 min",
    fromCop: 80000,
    summary: "Simulación guiada + feedback humano sobre claridad, estructura y confianza.",
    includes: [
      "2–3 historias STAR aterrizadas a tu CV",
      "Preguntas difíciles del rol",
      "Plan de práctica 48 h antes de la entrevista",
    ],
  },
  {
    id: "offer-coach",
    title: "Coach de oferta / salario",
    specialty: "negociacion",
    duration: "1 sesión · ~45 min",
    fromCop: 70000,
    summary: "Define piso/meta/techo y el script de contraoferta con un humano.",
    includes: [
      "Bandas orientativas CO",
      "Script escrito listo para enviar",
      "Qué pedir además de salario (remoto, bono, fecha)",
    ],
  },
  {
    id: "career-orient",
    title: "Orientación de carrera",
    specialty: "carrera",
    duration: "1 sesión · ~50 min",
    fromCop: 75000,
    summary: "Aclara rol objetivo, gaps y plan de 30 días con un coach aliado.",
    includes: [
      "Mapa rol → evidencias",
      "Prioridad de upskilling low-cost",
      "Siguiente paso concreto (aplicar / network / curso)",
    ],
  },
];

export function packageById(id: string) {
  return MARKETPLACE_PACKAGES.find((p) => p.id === id) || null;
}
