/**
 * Qué es gratis vs plan Carrera (un solo plan).
 * Solo 2–3 productos free para que el valor esté en Carrera.
 */

/** Rutas que cualquiera puede usar sin pagar. */
export const FREE_PATH_PREFIXES = [
  "/", // home exact handled separately
] as const;

export function isFreeAppPath(pathname: string): boolean {
  const p = pathname.replace(/\/$/, "") || "/";

  // Exact free tools (2–3)
  if (p === "/ats") return true;
  if (p === "/herramientas/calculadora") return true;
  if (p === "/tracker") return true;

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
    desc: "Compara tu CV con una oferta y ve el puntaje + qué mejorar.",
  },
  {
    href: "/herramientas/calculadora",
    title: "Encaje rápido",
    desc: "Porcentaje de coincidencia en un minuto (sin el análisis completo).",
  },
  {
    href: "/tracker",
    title: "Tracker de postulaciones",
    desc: "Anota cargo, empresa y en qué vas.",
  },
] as const;
