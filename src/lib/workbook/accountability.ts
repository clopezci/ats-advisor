/** Tips de accountability para Telegram / recordatorios (sin PII). */

const TIPS = [
  "Cuadernillo · Hoy: 40% red / 35% páginas de carrera / 25% portales. 5 mensajes + 1 follow-up.",
  "Cuadernillo · Revisa 8 empresas en “trabaja con nosotros” y anota 2 personas del área.",
  "Cuadernillo · Actualiza 1 logro SOAR con número o antes/después. Úsalo en CV y pitch.",
  "Cuadernillo · Practica 1 respuesta STAR (90s). Roleplay en la app con Gabriel.",
  "Cuadernillo · Registra funnel: outreach, postulaciones, filtros, entrevistas.",
  "Cuadernillo · Revisa tu pista financiera y el piso de oferta antes de negociar.",
  "Cuadernillo · Escribe 2 mensajes a hunters de tu directorio (favor concreto, no “cualquier vacante”).",
];

export function cuadernilloAccountabilityTip(date = new Date()): string {
  const day = date.getDay(); // 0 domingo
  return TIPS[day % TIPS.length];
}

export function formatCuadernilloTelegramReply(appUrl: string): string {
  const tip = cuadernilloAccountabilityTip();
  const base = appUrl.replace(/\/$/, "");
  return [
    tip,
    "",
    "Abre tu cuadernillo:",
    `${base}/outplacement/cuadernillo`,
    `Funnel: ${base}/outplacement/cuadernillo/funnel`,
    "",
    "También: /capsula · /progreso · /ayuda",
  ].join("\n");
}
