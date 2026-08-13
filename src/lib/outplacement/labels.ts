/**
 * Nombres legibles de módulos de carrera.
 * Los códigos OUT-## se conservan solo en datos/API/progreso.
 */
import { OUTPLACEMENT_MODULES } from "@/lib/outplacement/modules";

export const OUT09_TITLE = "Curso a tu medida";
export const OUT09_SHORT = "Curso a medida";

const SHORT: Record<string, string> = {
  "OUT-01": "Estabilización",
  "OUT-02": "Autoevaluación",
  "OUT-03": "Mercado laboral",
  "OUT-04": "Upskilling",
  "OUT-05": "Marca y CV",
  "OUT-06": "Networking",
  "OUT-07": "Entrevistas",
  "OUT-08": "Oferta y 90 días",
  "OUT-09": OUT09_SHORT,
};

export function outModuleTitle(code: string): string {
  if (code === "OUT-09") return OUT09_TITLE;
  return OUTPLACEMENT_MODULES.find((m) => m.code === code)?.title || code;
}

export function outModuleShort(code: string): string {
  return SHORT[code] || outModuleTitle(code);
}

/** Ruta guiada completa (módulos 1–8), sin jerga. */
export const CAREER_PATH_LABEL = "Ruta de carrera (8 módulos)";
