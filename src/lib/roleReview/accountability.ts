/** Tips de accountability para Repaso del rol (Telegram / PWA). */

const TIPS = [
  "Repaso · Abre el ticket del día y ciérralo con entregable real (nota o checklist), no solo lectura.",
  "Repaso · Practica 1 STAR del plan en voz alta 90s. Si no tienes historia, escribe cómo lo practicarías en pequeño.",
  "Repaso · Marca 1 ítem de Semana 1. Imagina el lunes: ¿a quién le preguntas primero?",
  "Repaso · Relee el ancla del aviso del reto de hoy. ¿Puedes explicarlo sin copiar el JD?",
  "Repaso · Si marcaste “quiero aprenderlo”, 20 min de práctica + 5 líneas: qué harías el día 1.",
  "Repaso · Update falso a tu jefe: hecho / en curso / bloqueo (8 líneas).",
  "Repaso · Si el plan va >50%, re-analiza el CV en /ats con la misma vacante y mira si el gap bajó.",
];

export function roleReviewAccountabilityTip(date = new Date()): string {
  const day = date.getDay();
  return TIPS[day % TIPS.length];
}

export function formatRoleReviewTelegramReply(appUrl: string): string {
  const tip = roleReviewAccountabilityTip();
  const base = appUrl.replace(/\/$/, "");
  return [
    tip,
    "",
    "Abre tu repaso:",
    `${base}/ats/repaso`,
    `Player (si ya generaste): ${base}/ats/repaso/player`,
    "",
    "También: /capsula · /cuadernillo · /ayuda",
  ].join("\n");
}
