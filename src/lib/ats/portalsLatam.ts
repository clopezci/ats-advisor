/** Checklists de portales LATAM — lo que el formulario exige además del PDF. */

export type PortalGuide = {
  id: string;
  name: string;
  countries: string[];
  /** En una frase: qué es este sitio y cuándo usar esta tarjeta. */
  purpose: string;
  checklist: string[];
  tips: string[];
};

export const PORTALS_LATAM: PortalGuide[] = [
  {
    id: "computrabajo",
    name: "Computrabajo",
    countries: ["CO", "MX", "PE", "AR", "CL", "EC"],
    purpose:
      "Portal de empleo muy usado en Colombia y la región. Usa esta lista si vas a postular ahí: completa el perfil del sitio, no solo subas el PDF.",
    checklist: [
      "Perfil 100% completo (foto opcional pero ayuda en LATAM).",
      "CV adjunto PDF texto + mismos datos en el formulario (no contradigas fechas).",
      "Palabras clave del aviso en “habilidades” del perfil del portal.",
      "Salario pretendido coherente (o “a convenir” si el aviso lo permite).",
      "Disponibilidad y ciudad/remoto declarados igual que en el CV.",
    ],
    tips: [
      "El ranking interno premia perfiles activos: entra 2–3× por semana.",
      "Responde rápido a mensajes del portal (las empresas miran tiempo de respuesta).",
    ],
  },
  {
    id: "elempleo",
    name: "elempleo.com",
    countries: ["CO"],
    purpose:
      "Portal colombiano que usan muchas empresas grandes. La hoja de vida que llenas en el sitio cuenta tanto como el archivo que adjuntas.",
    checklist: [
      "Hoja de vida del portal alineada al PDF (cargos y fechas).",
      "Sección de logros con números (no solo funciones).",
      "Filtros de ciudad / modalidad correctos.",
      "Adjunta el CV adaptado a ESA vacante, no el genérico.",
    ],
    tips: [
      "Muchas empresas grandes CO usan elempleo + ATS interno: el formulario cuenta tanto como el adjunto.",
    ],
  },
  {
    id: "magneto",
    name: "Magneto365",
    countries: ["CO", "LATAM"],
    purpose:
      "Plataforma de empleo (sobre todo Colombia). El match depende mucho de las habilidades que marques como etiquetas en tu perfil.",
    checklist: [
      "Completa skills etiquetadas (el match es muy tag-driven).",
      "CV limpio 1 columna.",
      "Respuestas cortas a preguntas de la vacante si aparecen.",
    ],
    tips: ["Prioriza tags literales de la oferta en tu perfil Magneto."],
  },
  {
    id: "linkedin",
    name: "LinkedIn (Easy Apply / Recruiter)",
    countries: ["LATAM", "global"],
    purpose:
      "Red profesional. “Easy Apply” es el botón de postular rápido: usa tu perfil + a veces preguntas. Recruiter es lo que usa quien busca candidatos.",
    checklist: [
      "Headline = cargo objetivo + 1 skill top de la vacante.",
      "About con 3 logros medibles (no párrafo motivacional vacío).",
      "Skills tipadas (mín. 5 relevantes) — LinkedIn Recruiter filtra por aquí.",
      "Experiencia con viñetas; Easy Apply usa lo que ve el perfil + PDF.",
      "Open to Work (reclutadores) si estás en búsqueda activa.",
    ],
    tips: [
      "Si Easy Apply pide screening questions, prepáralas en ATSAdvisor → Screening.",
      "Actividad reciente (comentarios) sube visibilidad; no spamees.",
    ],
  },
  {
    id: "occ",
    name: "OCC Mundial",
    countries: ["MX"],
    purpose: "Portal de empleo de México. El formulario de OCC suele alimentar el sistema interno de la empresa.",
    checklist: [
      "Perfil OCC completo + CV PDF.",
      "Pretensión salarial en MXN coherente con mercado.",
      "Keywords del aviso en habilidades OCC.",
    ],
    tips: ["En MX el formulario OCC suele alimentar el ATS del cliente: sé literal."],
  },
  {
    id: "bumeran",
    name: "Bumeran",
    countries: ["AR", "PE", "EC", "PA"],
    purpose: "Portal de empleo en Argentina, Perú y otros países. Alinea el perfil del sitio con tu PDF y el vocabulario local.",
    checklist: [
      "CV + datos del perfil alineados.",
      "Modalidad (presencial/híbrido/remoto) explícita.",
      "Sin tablas en el PDF.",
    ],
    tips: ["Adapta el CV por país (vocabulario local: analista vs. analista Sr.)."],
  },
];

export function portalsForCountry(code?: string): PortalGuide[] {
  if (!code) return PORTALS_LATAM;
  const c = code.toUpperCase();
  return PORTALS_LATAM.filter((p) => p.countries.some((x) => x === c || x === "LATAM" || x === "global"));
}
