/**
 * Canales de microlearning y precio WhatsApp (usuario ve solo el final).
 *
 * Fórmula interna (no se muestra al usuario):
 *   costo_meta_medio_mensual × (1 + margen_%)
 * Meta cobra por mensaje (Colombia ~utility/marketing); usamos un valor medio
 * operativo + overhead BSP para un paquete de cápsulas/mes.
 */

export type LearningChannel = "pwa" | "telegram" | "whatsapp";

export type ChannelQuote = {
  channel: LearningChannel;
  label: string;
  priceCop: number;
  isFree: boolean;
  /** Mensaje listo para UI (solo precio final + por qué WS cuesta). */
  userMessage: string;
  shortBadge: string;
};

/** Parámetros internos (ajustables vía settings). */
export type WhatsappCostModel = {
  /** Costo medio estimado Meta+BSP del paquete mensual de cápsulas (COP). */
  metaMidMonthlyCop: number;
  /** Margen del producto sobre ese costo (ej. 50 → ×1.5). */
  marginPercent: number;
  msgsPerMonth: number;
};

export const DEFAULT_WA_COST: WhatsappCostModel = {
  // Recalibrado: Meta utility CO es céntimos/msg; mid realista ~45 cápsulas + BSP liviano
  metaMidMonthlyCop: 3000,
  marginPercent: 50,
  msgsPerMonth: 45,
};

export function whatsappFinalPriceCop(model: WhatsappCostModel = DEFAULT_WA_COST): number {
  const mult = 1 + Math.max(0, model.marginPercent) / 100;
  return Math.round(model.metaMidMonthlyCop * mult);
}

export function formatCop(n: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n);
}

export function channelQuotes(model: WhatsappCostModel = DEFAULT_WA_COST): ChannelQuote[] {
  const wa = whatsappFinalPriceCop(model);
  return [
    {
      channel: "pwa",
      label: "Solo en la app (PWA)",
      priceCop: 0,
      isFree: true,
      shortBadge: "Gratis",
      userMessage: "Recibes las cápsulas dentro de ATSAdvisor. Sin costo de mensajería.",
    },
    {
      channel: "telegram",
      label: "Telegram",
      priceCop: 0,
      isFree: true,
      shortBadge: "Gratis",
      userMessage:
        "Telegram es gratis: mismas cápsulas de microlearning sin cargo de mensajería. Ideal si quieres alertas al celular sin sobrecosto.",
    },
    {
      channel: "whatsapp",
      label: "WhatsApp",
      priceCop: wa,
      isFree: false,
      shortBadge: `${formatCop(wa)}/mes`,
      userMessage: [
        `WhatsApp: ${formatCop(wa)} al mes.`,
        "Ese valor ya incluye el sobrecosto de la mensajería que cobra Meta (y la operación del canal).",
        "Por eso WhatsApp no es gratis: Meta factura cada mensaje/plantilla que te enviamos.",
        "Si prefieres el mismo contenido sin ese sobrecosto, elige Telegram (gratis) o solo la app.",
      ].join(" "),
    },
  ];
}

export function channelUserMessage(channel: LearningChannel, model?: WhatsappCostModel): string {
  return channelQuotes(model).find((c) => c.channel === channel)?.userMessage || "";
}

export const CHANNEL_CHOICE_INTRO =
  "Tú eliges cómo recibir el microlearning: app, Telegram (gratis) o WhatsApp (con tarifa por el sobrecosto de Meta).";
