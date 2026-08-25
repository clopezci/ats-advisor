/**
 * Qué es gratis vs plan Carrera (un solo plan).
 * Free = herramientas del momento (postular hoy).
 * Carrera = acompañamiento completo (mapa, red, entrevistas, oferta, cuadernillo).
 */

/** Rutas que cualquiera puede usar sin pagar. */
export const FREE_PATH_PREFIXES = [
  "/", // home exact handled separately
] as const;

export function isFreeAppPath(pathname: string): boolean {
  const p = pathname.replace(/\/$/, "") || "/";

  // Exact free tools
  if (p === "/ats") return true;
  if (p === "/herramientas/calculadora") return true;
  if (p === "/herramientas/match") return true; // alias del encaje rápido
  if (p === "/tracker") return true;
  if (p === "/herramientas/checklist") return true;
  if (p === "/herramientas/salario") return true;

  // Hubs / account / legal / auth always open
  if (p === "/herramientas") return true;
  if (p === "/guia") return true;
  if (p === "/precios") return true;
  if (p === "/cuenta" || p.startsWith("/cuenta/")) return true;
  if (p === "/auth") return true;
  if (p.startsWith("/legal")) return true;
  if (p.startsWith("/blog")) return true;
  if (p === "/capacidades") return true;
  if (p === "/feedback") return true;
  if (p.startsWith("/empresa")) return true;
  if (p.startsWith("/admin")) return true;
  if (p === "/outplacement") return true;
  if (p.startsWith("/outplacement/experto")) return true;
  if (p.startsWith("/outplacement/marketplace")) return true;

  return false;
}

export const FREE_TOOL_BLURBS = [
  {
    href: "/ats",
    title: "Analizador ATS",
    desc: "Compara tu CV con una vacante y mira el puntaje y qué ajustar.",
  },
  {
    href: "/herramientas/calculadora",
    title: "Encaje rápido",
    desc: "Qué tan bien encaja tu CV en un minuto (sin el análisis completo).",
  },
  {
    href: "/tracker",
    title: "Tracker de postulaciones",
    desc: "Anota el cargo, la empresa y en qué etapa vas.",
  },
  {
    href: "/herramientas/checklist",
    title: "Checklist CV ATS",
    desc: "Revisa formato y secciones antes de enviar o analizar.",
  },
  {
    href: "/herramientas/salario",
    title: "Bandas salariales",
    desc: "Rangos por cargo, industria y tamaño — anclados a tu último fijo.",
  },
] as const;
