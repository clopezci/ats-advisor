import { NextResponse } from "next/server";
import { hydrateSettingsFromCloud } from "@/lib/settingsPersist";
import { readSettings } from "@/lib/settings";
import { specialtyLabel } from "@/lib/experts/specialties";
import { billingModeClientCopy, computeAllyCommission } from "@/lib/experts/pricing";

/** Lista pública de aliados activos (sin datos de contacto privados). */
export async function GET() {
  await hydrateSettingsFromCloud();
  const s = readSettings();
  if (!s.features.experts) {
    return NextResponse.json({
      ok: true,
      enabled: false,
      allies: [],
      billingMode: s.expert_billing_mode,
      billingCopy: billingModeClientCopy(s.expert_billing_mode),
    });
  }
  const allies = (s.allies || [])
    .filter((a) => a.active && a.email.includes("@"))
    .map((a) => {
      const servicePriceCop =
        typeof a.service_price_cop === "number" && a.service_price_cop > 0
          ? a.service_price_cop
          : s.expert_default_service_price_cop;
      const commissionPercent =
        typeof a.commission_percent === "number"
          ? a.commission_percent
          : s.expert_default_commission_percent;
      const { commissionCop, allyNetCop } = computeAllyCommission(servicePriceCop, commissionPercent);
      return {
        id: a.id,
        name: a.name,
        specialties: a.specialties,
        specialtyLabels: a.specialties.map(specialtyLabel),
        notes: a.notes || "",
        servicePriceCop,
        commissionPercent,
        /** Solo útil internamente / transparencia; el cliente paga servicePriceCop */
        commissionCop,
        allyNetCop,
      };
    });
  return NextResponse.json({
    ok: true,
    enabled: true,
    billingMode: s.expert_billing_mode,
    billingCopy: billingModeClientCopy(s.expert_billing_mode),
    allies,
  });
}
