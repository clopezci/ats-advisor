/**
 * Creatividades de ArriendoSeguro (house ads).
 * Copy de campaña, no un copy-paste de la home. Rotan al azar por pantalla.
 */

export type ArriendoCreative = {
  id: string;
  /** Gancho (pregunta o dolor) */
  headline: string;
  /** Promesa corta */
  body: string;
  cta: string;
};

export const ARRIENDO_URL =
  process.env.NEXT_PUBLIC_AD_ARRIENDOSEGURO_URL ||
  process.env.NEXT_PUBLIC_LOTIC_ARRIENDOSEGURO_URL ||
  "https://arriendoseguro.app/";

export const ARRIENDO_CREATIVES: ArriendoCreative[] = [
  {
    id: "palabra",
    headline: "¿Hoy cierras el arriendo de palabra?",
    body: "Un apretón de manos no te cubre si hay un daño o dejan de pagar. Pásate a ArriendoSeguro: contrato digital con validez legal.",
    cta: "Formalizar mi arriendo",
  },
  {
    id: "word-ilegal",
    headline: "Ese formato de internet puede no cumplir la ley",
    body: "La vivienda urbana en Colombia tiene reglas. Arma el contrato bien, una pregunta a la vez, y fírmalo en digital.",
    cta: "Hacer el contrato en regla",
  },
  {
    id: "inventario",
    headline: "¿Entregas las llaves y no queda ni una foto?",
    body: "Sin inventario, el “ya estaba así” te deja sin pruebas. Inventario con fotos y acta de entrega, en el mismo flujo del contrato.",
    cta: "Armar inventario con fotos",
  },
  {
    id: "minutos",
    headline: "¿Te gustaría hacer el contrato en pocos minutos, 100% digital?",
    body: "Sin inmobiliaria y sin formularios eternos. Una pregunta por paso: datos, condiciones, firma e inventario.",
    cta: "Empezar mi contrato",
  },
  {
    id: "aliados",
    headline: "Jurídico, cobranza y seguros… sin pagar una inmobiliaria",
    body: "Aliados a precios asequibles para cuidar el arriendo. Tú eliges cuándo usarlos; el contrato y la evidencia ya están.",
    cta: "Ver ArriendoSeguro",
  },
  {
    id: "reputacion",
    headline: "¿Y si al final pudieras calificar cómo fue el arriendo?",
    body: "Historial de reputación privada: para que la próxima vez no arriendes a ciegas. Comunidad más segura, contrato a contrato.",
    cta: "Conocer cómo funciona",
  },
  {
    id: "canon",
    headline: "¿El canon que pactaron cabe en la ley?",
    body: "Validamos el tope legal del canon (1% del avalúo comercial) para que no firmes un número que después te estalle.",
    cta: "Revisar mi arriendo",
  },
  {
    id: "firma",
    headline: "Firma electrónica de verdad. No un PDF pintado.",
    body: "Validez legal (Ley 527): queda evidencia de quién firmó. El contrato no es “lo imprimimos el sábado”.",
    cta: "Firmar en digital",
  },
  {
    id: "posventa",
    headline: "El arriendo no termina cuando firman",
    body: "Pagos con recordatorios, novedades, mantenimiento y renovación. Todo el día a día en un solo lugar.",
    cta: "Llevar el arriendo al día",
  },
  {
    id: "pago-unico",
    headline: "Un solo pago por TODO el contrato. No es mensual.",
    body: "Precio de introducción $49.900: firma, inventario, pagos y paquete de evidencia. Sin comisión de inmobiliaria.",
    cta: "Ver el precio",
  },
  {
    id: "directo",
    headline: "Arriendas directo. Eso no significa informal.",
    body: "Entre particulares también se firma en regla: contrato, inventario y pagos, sin intermediario que se lleve un mes.",
    cta: "Formalizar entre particulares",
  },
  {
    id: "evidencia",
    headline: "Cuando hay pelea, gana quien tiene pruebas",
    body: "Paquete descargable: contrato, inventario, fotos y pagos. Por si algún día las necesitas.",
    cta: "Guardar la evidencia",
  },
  {
    id: "codeudor",
    headline: "Codeudor, servicios y cláusulas: que quede escrito",
    body: "Lo que acordaron de palabra se olvida. En ArriendoSeguro entra al contrato, paso a paso.",
    cta: "Incluirlo en el contrato",
  },
  {
    id: "pausa",
    headline: "Empiezas hoy y sigues mañana. El contrato no se pierde.",
    body: "Una pregunta a la vez. Pausas y retomas. Ideal si el otro aún no tiene la cédula a la mano.",
    cta: "Empezar sin apuro",
  },
  {
    id: "inmobiliaria",
    headline: "¿Pagas inmobiliaria solo para que te armen el papel?",
    body: "Si ya se pusieron de acuerdo, el contrato lo hacen ustedes: guiados, legales y con firma electrónica.",
    cta: "Hacerlo sin inmobiliaria",
  },
];

export function pickArriendoCreative(slot: string): ArriendoCreative {
  const list = ARRIENDO_CREATIVES;
  const key = `ats_ad_as_${slot}`;
  if (typeof window !== "undefined") {
    try {
      const saved = sessionStorage.getItem(key);
      const found = list.find((c) => c.id === saved);
      if (found) return found;
    } catch {
      /* ignore */
    }
  }
  const i =
    typeof window === "undefined"
      ? Math.abs(slot.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % list.length
      : Math.floor(Math.random() * list.length);
  const pick = list[i] || list[0];
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem(key, pick.id);
    } catch {
      /* ignore */
    }
  }
  return pick;
}
