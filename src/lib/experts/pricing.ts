/**
 * Precio público del servicio aliado + comisión LOTIC.
 * commission_cop = round(service_price_cop × commission_percent / 100)
 * ally_net_cop = service_price_cop − commission_cop
 */

export type ExpertBillingMode = "platform_collect" | "ally_direct";

export function computeAllyCommission(
  servicePriceCop: number,
  commissionPercent: number
): { commissionCop: number; allyNetCop: number } {
  const price = Math.max(0, Math.round(servicePriceCop || 0));
  const pct = Math.min(100, Math.max(0, commissionPercent || 0));
  const commissionCop = Math.round(price * (pct / 100));
  return { commissionCop, allyNetCop: Math.max(0, price - commissionCop) };
}

export function billingModeLabel(mode: ExpertBillingMode) {
  return mode === "platform_collect"
    ? "LOTIC cobra al cliente y liquida al aliado"
    : "Aliado cobra directo; LOTIC factura comisión";
}

export function billingModeClientCopy(mode: ExpertBillingMode) {
  return mode === "platform_collect"
    ? "Pagas el valor del servicio en ATSAdvisor. LOTIC retiene la comisión de plataforma y liquida el resto al aliado."
    : "El precio es de referencia: pagas al aliado. Tras el servicio confirmas aquí para el corte de comisión LOTIC.";
}
