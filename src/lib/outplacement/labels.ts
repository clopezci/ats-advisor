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
  "OUT-04": "Aprender lo que falta",
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
    value: "Procesas lo que pasó y dejas clara tu historia profesional.",
  },
  {
    code: "OUT-02",
    short: "2. Autoevaluación",
    title: "Autoevaluación y mapa de competencias",
    value: "Sabes qué destacar de ti: logros, habilidades y pruebas concretas.",
  },
  {
    code: "OUT-03",
    short: "3. Mercado",
    title: "Mercado laboral LATAM",
    value: "Eliges 1–3 roles objetivo y bandas salariales realistas.",
  },
  {
    code: "OUT-04",
    short: "4. Aprender lo que falta",
    title: "Aprender lo que te falta",
    value: "Cierras la brecha con un proyecto chico y algo que puedas mostrar.",
  },
  {
    code: "OUT-05",
    short: "5. Marca y CV",
    title: "Marca personal + CV / perfil profesional",
    value: "Titular, sección Acerca de y CV de una columna listos para los filtros automáticos.",
  },
  {
    code: "OUT-06",
    short: "6. Networking",
    title: "Vacantes por contactos + red de apoyo",
    value: "Agenda de contactos, mensajes listos y seguimiento (no solo portales).",
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

/**
 * Qué incluye el plan Carrera (copy comercial / paywalls).
 * Estudiar psicotécnicas (fichas + banco) es gratis; la práctica con IA es add-on.
 */
export const CAREER_PLAN_INCLUDES = [
  {
    title: "Cuadernillo guiado",
    desc: "Mapa de carrera, SOAR, guiones, mercado, red, conectores, finanzas, compensación, evaluación y seguimiento semanal — con ejemplos de redacción.",
  },
  {
    title: CAREER_PATH_LABEL,
    desc: "Acompañamiento semana a semana: estabilización, autoevaluación, mercado, marca, networking, entrevistas y oferta.",
  },
  {
    title: "Repaso del rol completo",
    desc: "Curso del cargo según el aviso, retos, tickets, STAR, primera semana y simulacro 1:1 con veredicto.",
  },
  {
    title: "LinkedIn, carta y plantilla CV",
    desc: "Textos listos para postular, multi-oferta y pack de envío.",
  },
  {
    title: "Entrevistas y negociación",
    desc: "Filtro telefónico, práctica STAR, scripts de oferta y bandas.",
  },
  {
    title: "Coach IA y red de contactos",
    desc: "Preguntas al coach, CRM de networking y plantillas por audiencia.",
  },
  {
    title: "Psicotécnicas (estudiar)",
    desc: "Fichas de método y banco de pruebas — también en la ruta gratis. La práctica con método IA (perfil/foto) es un add-on aparte.",
  },
  {
    title: "Cápsulas por canal",
    desc: "Recordatorios por Telegram (incluido) o WhatsApp (add-on).",
  },
] as const;

/** Bullets cortos para PaywallCard / upsells. */
export const CAREER_PAYWALL_BULLETS = CAREER_PLAN_INCLUDES.map(
  (x) => `${x.title}: ${x.desc}`
);
