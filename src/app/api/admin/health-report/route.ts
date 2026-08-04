import { NextResponse } from "next/server";
import { isAdminSecret } from "@/lib/admin/auth";
import { reportHealthToTelegram, reportError } from "@/lib/observability";

/** Owner dispara un reporte de salud inmediato a Telegram. */
export async function POST(req: Request) {
  if (!isAdminSecret(req.headers.get("x-admin-secret"))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const result = await reportHealthToTelegram({ force: true });
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    await reportError({ where: "api/admin/health-report", error: e, notifyOwner: true });
    return NextResponse.json({ error: "No se pudo reportar" }, { status: 500 });
  }
}
