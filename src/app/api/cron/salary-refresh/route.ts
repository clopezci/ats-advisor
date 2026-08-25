import { NextResponse } from "next/server";
import { requireCronAuth } from "@/lib/admin/auth";
import { refreshSalarySnapshot } from "@/lib/salary/refresh";
import { notifyOwnerTelegram } from "@/lib/notify/channels";
import { reportError } from "@/lib/observability";

/**
 * Cron mensual: ajusta factor CPI de la matriz salarial y persiste snapshot
 * (disco + Supabase app_settings.salary_matrix si hay service role).
 *
 * Opcional: SALARY_FEED_URL con JSON de un proveedor / curation propia.
 */
export async function GET(req: Request) {
  const auth = requireCronAuth(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { snapshot, persisted, feedUsed } = await refreshSalarySnapshot();
    const msg =
      `Matriz salarial actualizada · asOf ${snapshot.asOf} · CPI×${snapshot.cpiFactorFromSeed} · v${snapshot.version}` +
      (feedUsed ? " · feed externo" : " · CPI proxy") +
      ` · disk=${persisted.disk} cloud=${persisted.cloud}`;
    await notifyOwnerTelegram(msg).catch(() => undefined);
    return NextResponse.json({ ok: true, snapshot, persisted, feedUsed });
  } catch (e) {
    await reportError({ where: "api/cron/salary-refresh", error: e, notifyOwner: true });
    return NextResponse.json({ error: "salary refresh failed" }, { status: 500 });
  }
}
