/** Ruta sugerida de 14 sesiones (humano o coach IA). Autoría ATSAdvisor. */

export type Route14Session = {
  n: number;
  title: string;
  focus: string;
  pct: number;
  coachHint: string;
  href?: string;
};

export const ROUTE_14: Route14Session[] = [
  { n: 1, title: "Kickoff y mapa", focus: "Propósito, visión, objetivo 90 días", pct: 5, coachHint: "Sofía / mapa", href: "/outplacement/cuadernillo/mapa" },
  { n: 2, title: "Competencias + estilo", focus: "Top 5 con evidencia; estilo de comunicación", pct: 12, coachHint: "Sofía", href: "/outplacement/cuadernillo/pruebas" },
  { n: 3, title: "Mercado 3 canales", focus: "Mix tiempo + shortlist empresas", pct: 18, coachHint: "Irene", href: "/outplacement/cuadernillo/mercado" },
  { n: 4, title: "Directorio y hunters", focus: "Lista propia + verificación", pct: 24, coachHint: "Irene", href: "/outplacement/cuadernillo/directorio" },
  { n: 5, title: "CRM y conectores", focus: "15 contactos + roles de red", pct: 30, coachHint: "Irene", href: "/outplacement/cuadernillo/red" },
  { n: 6, title: "Guiones y plantillas", focus: "Pitch, salida, InMail", pct: 36, coachHint: "Irene", href: "/outplacement/cuadernillo/guiones" },
  { n: 7, title: "SOAR / marca", focus: "8–12 logros + identidad digital", pct: 45, coachHint: "Sofía", href: "/outplacement/cuadernillo/soar" },
  { n: 8, title: "Cómo te evalúan", focus: "Etapas ATS→referencias", pct: 52, coachHint: "Gabriel", href: "/outplacement/cuadernillo/evaluacion" },
  { n: 9, title: "Roleplay filtro", focus: "60s + pretensión", pct: 60, coachHint: "Gabriel", href: "/outplacement/roleplay" },
  { n: 10, title: "Roleplay HM / panel", focus: "STAR + caso corto", pct: 68, coachHint: "Gabriel", href: "/outplacement/cuadernillo/simulaciones" },
  { n: 11, title: "Finanzas transición", focus: "Pista + piso de oferta", pct: 75, coachHint: "Andrés", href: "/outplacement/cuadernillo/finanzas" },
  { n: 12, title: "Compensación", focus: "Paquete total + objeciones", pct: 82, coachHint: "Andrés", href: "/outplacement/cuadernillo/compensacion" },
  { n: 13, title: "Funnel y ritmo", focus: "Semana tipo + métricas", pct: 90, coachHint: "Irene", href: "/outplacement/cuadernillo/funnel" },
  { n: 14, title: "Cierre / oferta / AMA", focus: "Scripts cierre + red alumni", pct: 100, coachHint: "Andrés / humano", href: "/outplacement/oferta" },
];
