/**
 * Canales de microlearning.
 * WhatsApp queda incluido en Carrera (hasta 5 recordatorios/día); ya no se vende como add-on aparte.
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
  metaMidMonthlyCop: 16000,
  marginPercent: 80,
  /** ~5 recordatorios/día × 30 (incluido en Carrera). */
  msgsPerMonth: 150,
};

/** @deprecated Ya no se cobra aparte; se mantiene por compatibilidad de settings. */
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

export function channelQuotes(_model: WhatsappCostModel = DEFAULT_WA_COST): ChannelQuote[] {
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
        "Telegram es gratis: mismas cápsulas de microlearning sin cargo de mensajería. Ideal si quieres alertas al celular sin sobrecosto Meta.",
    },
    {
      channel: "whatsapp",
      label: "WhatsApp",
      priceCop: 0,
      isFree: true,
      shortBadge: "Incluido en Carrera",
      userMessage: [
        "WhatsApp va incluido en Carrera: hasta 5 recordatorios al día de tu lección/tarea.",
        "Telegram sigue disponible con el mismo contenido de microlearning.",
        "Si prefieres sin mensajería de Meta, elige Telegram o solo la app.",
      ].join(" "),
    },
  ];
}

export function channelUserMessage(channel: LearningChannel, model?: WhatsappCostModel): string {
  return channelQuotes(model).find((c) => c.channel === channel)?.userMessage || "";
}

export const CHANNEL_CHOICE_INTRO =
  "Microlearning diario: app, Telegram o WhatsApp (este último incluido en Carrera, hasta 5 recordatorios/día).";

/** Precio público del plan Carrera (COP/mes). */
export const CARRERA_PRICE_COP = 94500;

/** Tope de recordatorios WhatsApp incluidos en Carrera. */
export const WA_REMINDERS_PER_DAY = 5;
