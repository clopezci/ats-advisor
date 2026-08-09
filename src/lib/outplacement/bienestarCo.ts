/** Guía de bienestar + derechos laborales Colombia (informativa, no asesoría legal). */

export type GuideSection = {
  id: string;
  title: string;
  bullets: string[];
};

export const BIENESTAR_SECTIONS: GuideSection[] = [
  {
    id: "rutina",
    title: "Estabilización en los primeros 14 días",
    bullets: [
      "Rutina mínima: sueño, comida, 30–45 min de movimiento, 1 bloque de búsqueda (no 14 horas).",
      "Separa “duelo laboral” de “plan de acción”: escribe qué terminó y qué conservas (OUT-01).",
      "Limita doomscroll de LinkedIn a ventanas fijas; el resto es ejecución (CV, networking, ATS).",
      "Si hay crisis de ansiedad o ideas de daño: busca ayuda profesional / líneas de emergencia locales. Esta app no sustituye terapia.",
    ],
  },
  {
    id: "red",
    title: "Red de apoyo",
    bullets: [
      "Lista 5 personas de confianza (no solo para “avísame si hay vacante”).",
      "Pide favores concretos: revisión de CV, intro a 1 persona, mock de filtro.",
      "Evita aislarte: 1 café o llamada semanal de accountability.",
    ],
  },
  {
    id: "energia",
    title: "Energía y límites",
    bullets: [
      "Define horario de “oficina de búsqueda” y hora de cierre.",
      "Celebra micro-wins (1 envío bien hecho > 20 envíos genéricos).",
      "Si estás en burnout, prioriza OUT-01 y salud antes de OUT-07.",
    ],
  },
];

export const DERECHOS_CO_SECTIONS: GuideSection[] = [
  {
    id: "finiquito",
    title: "Al terminar el contrato (orientativo CO)",
    bullets: [
      "Pide por escrito: liquidación, conceptos (salarios, vacaciones, prima, cesantías/intereses si aplican), fecha de pago.",
      "Conserva contrato, desprendibles, cartas de terminación y chats relevantes.",
      "Verifica si la terminación fue con o sin justa causa y qué implica para indemnización (consulta un abogado laboral si hay duda).",
      "Afiliaciones: pregunta continuidad de seguridad social / caja en el periodo de transición.",
    ],
  },
  {
    id: "cesantias",
    title: "Cesantías y prestaciones (recordatorio)",
    bullets: [
      "Las cesantías y sus intereses tienen reglas de consignación y retiro; no asumas plazos de memoria: valida con tu liquidación.",
      "Prima y vacaciones proporcionales suelen ir en la liquidación; revisa el detalle línea a línea.",
      "Si hubo salario variable/comisiones, pide el detalle del promedio usado.",
    ],
  },
  {
    id: "desempleo",
    title: "Protección al cesante / mecanismos",
    bullets: [
      "Explora beneficios de caja de compensación (capacitaciones, cuotas de desempleo si cumples requisitos).",
      "Actualiza hoja de vida en mecanismos públicos de empleo si te sirve para red.",
      "Esto NO es asesoría jurídica ni de la UGPP/MinTrabajo: es una checklist para que llegues informado a una consulta.",
    ],
  },
  {
    id: "nuevo",
    title: "Al firmar el nuevo empleo",
    bullets: [
      "Lee tipo de contrato (indefinido, fijo, prestación de servicios) y periodo de prueba.",
      "Confirma salario fijo vs variable, beneficios y políticas de remoto.",
      "Pide el reglamento interno / código de ética si aplica.",
      "No firmes renuncias de derechos a cambio de “bonos” verbales: deja acuerdos por escrito.",
    ],
  },
];

export const DISCLAIMER_CO =
  "Información general educativa sobre bienestar y marco laboral en Colombia. No constituye asesoría legal, contable ni psicológica. Para casos concretos consulta un profesional habilitado.";
