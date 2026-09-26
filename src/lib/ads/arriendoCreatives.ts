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
    headline: "¿Cierras el arriendo de la propiedad de palabra?",
    body: "Un apretón de manos no te cubre si hay un daño o dejan de pagar. ArriendoSeguro arma el contrato de arrendamiento, digital y con validez legal.",
    cta: "Formalizar el contrato de arriendo",
  },
  {
    id: "word-ilegal",
    headline: "¿Tu contrato de arrendamiento cumple la ley?",
    body: "Arrendar una vivienda en Colombia tiene reglas. Arma el contrato de la propiedad bien, una pregunta a la vez, y fírmalo en digital.",
    cta: "Hacer el contrato de arriendo en regla",
  },
  {
    id: "inventario",
    headline: "¿Entregas el inmueble y no queda ni una foto?",
    body: "Sin inventario, el “ya estaba así” te deja sin pruebas. Fotos y acta de entrega van en el mismo contrato de arrendamiento.",
    cta: "Armar el inventario del arriendo",
  },
  {
    id: "minutos",
    headline: "¿El contrato de arrendamiento, en pocos minutos y 100% digital?",
    body: "Para arrendar una propiedad, sin inmobiliaria y sin formularios eternos. Una pregunta por paso: datos, canon, firma e inventario.",
    cta: "Empezar el contrato de arriendo",
  },
  {
    id: "aliados",
    headline: "Jurídico y cobranza para el arriendo, sin pagar inmobiliaria",
    body: "Aliados a precios asequibles para cuidar el contrato de arrendamiento de tu propiedad. Tú eliges cuándo usarlos.",
    cta: "Ver contratos de arrendamiento",
  },
  {
    id: "reputacion",
    headline: "¿Y si pudieras calificar cómo fue el arriendo del inmueble?",
    body: "Historial de reputación privada, de un contrato de arrendamiento al siguiente, para no arrendar la próxima propiedad a ciegas.",
    cta: "Conocer cómo funciona el arriendo",
  },
  {
    id: "canon",
    headline: "¿El canon del arriendo que pactaron cabe en la ley?",
    body: "Validamos el tope legal (1% del avalúo comercial) antes de firmar el contrato de arrendamiento de la propiedad.",
    cta: "Revisar el canon del arriendo",
  },
  {
    id: "firma",
    headline: "Firma electrónica del contrato de arrendamiento",
    body: "No es un PDF pintado. Validez legal (Ley 527): queda evidencia de quién firmó el arriendo de la propiedad.",
    cta: "Firmar el arriendo en digital",
  },
  {
    id: "posventa",
    headline: "El arriendo de la propiedad no termina al firmar",
    body: "Pagos, novedades, mantenimiento y renovación del contrato de arrendamiento. El día a día del inmueble, en un solo lugar.",
    cta: "Llevar el arriendo al día",
  },
  {
    id: "pago-unico",
    headline: "Un solo pago por todo el contrato de arrendamiento",
    body: "No es mensual. Precio de introducción $49.900: firma del arriendo, inventario, pagos y evidencia. Sin comisión de inmobiliaria.",
    cta: "Ver el precio del contrato",
  },
  {
    id: "directo",
    headline: "Arriendas la propiedad directo. Eso no es informal.",
    body: "Entre particulares también se firma el contrato de arrendamiento en regla: inventario y pagos, sin intermediario que se lleve un mes.",
    cta: "Formalizar el arriendo",
  },
  {
    id: "evidencia",
    headline: "Si hay pelea por el arriendo, gana quien tiene pruebas",
    body: "Descarga el contrato de arrendamiento, el inventario, las fotos y los pagos del inmueble. Por si algún día los necesitas.",
    cta: "Guardar la evidencia del arriendo",
  },
  {
    id: "codeudor",
    headline: "Codeudor y cláusulas del arriendo: que queden escritas",
    body: "Lo que acordaron de palabra sobre la propiedad se olvida. En ArriendoSeguro entra al contrato de arrendamiento, paso a paso.",
    cta: "Incluirlo en el contrato de arriendo",
  },
  {
    id: "pausa",
    headline: "El contrato de arrendamiento no se pierde si lo dejas a medias",
    body: "Empiezas hoy y sigues mañana. Una pregunta a la vez sobre el inmueble. Ideal si el otro aún no tiene la cédula a la mano.",
    cta: "Empezar el arriendo sin apuro",
  },
  {
    id: "inmobiliaria",
    headline: "¿Pagas inmobiliaria solo para el contrato de arriendo?",
    body: "Si ya se pusieron de acuerdo sobre la propiedad, el contrato de arrendamiento lo hacen ustedes: guiados, legales y con firma electrónica.",
    cta: "Hacer el contrato sin inmobiliaria",
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
