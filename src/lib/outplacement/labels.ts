/**
 * Nombres legibles de módulos de carrera.
 * Los códigos OUT-## se conservan solo en datos/API/progreso.
 */
import { OUTPLACEMENT_MODULES } from "@/lib/outplacement/modules";

export const OUT09_TITLE = "Curso a tu medida";
export const OUT09_SHORT = "Curso a medida";

/** Ruta guiada completa (módulos 1–8), sin jerga. */
export const CAREER_PATH_LABEL = "Ruta de 8 módulos";

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

/** Pitch comercial: qué incluye la ruta (el corazón del plan Carrera). */
export const CAREER_MODULE_PITCH: {
  code: string;
  short: string;
  title: string;
  value: string;
}[] = [
  {
    code: "OUT-01",
    short: "1. Estabilización",
    title: "Estabilización emocional y narrativa",
    value: "Cierras el duelo laboral y armas tu historia profesional con claridad.",
  },
  {
    code: "OUT-02",
    short: "2. Autoevaluación",
    title: "Autoevaluación y mapa de competencias",
    value: "Sabes qué vender de ti: logros, skills y evidencia.",
  },
  {
    code: "OUT-03",
    short: "3. Mercado",
    title: "Inteligencia de mercado laboral LATAM",
    value: "Eliges 1–3 roles target y bandas salariales reales.",
  },
  {
    code: "OUT-04",
    short: "4. Upskilling",
    title: "Re-skilling / upskilling",
    value: "Cierras el gap con un proyecto mínimo y evidencia publicable.",
  },
  {
    code: "OUT-05",
    short: "5. Marca y CV",
    title: "Marca personal + CV/LinkedIn ATS",
    value: "Headline, About y CV de una columna listos para filtros.",
  },
  {
    code: "OUT-06",
    short: "6. Networking",
    title: "Mercado oculto + networking",
    value: "Agenda de contactos, scripts y seguimiento (no solo portales).",
  },
  {
    code: "OUT-07",
    short: "7. Entrevistas",
    title: "Entrevistas + negociación",
    value: "Historias STAR, filtro telefónico y ancla salarial.",
  },
  {
    code: "OUT-08",
    short: "8. Oferta y 90 días",
    title: "Oferta y primeros 90 días",
    value: "Evalúas la oferta y no fallas el periodo de prueba.",
  },
];

export function outModuleTitle(code: string): string {
  if (code === "OUT-09") return OUT09_TITLE;
  return OUTPLACEMENT_MODULES.find((m) => m.code === code)?.title || code;
}

export function outModuleShort(code: string): string {
  return SHORT[code] || outModuleTitle(code);
}
