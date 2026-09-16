import { NextResponse } from "next/server";
import { isAdminSecret } from "@/lib/admin/auth";
import { getJobicyMeta, syncJobicyMeta } from "@/lib/salary/jobicyMeta";
import { reportError } from "@/lib/observability";

export async function GET(req: Request) {
  if (!isAdminSecret(req.headers.get("x-admin-secret"))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const meta = await getJobicyMeta();
    return NextResponse.json({ ok: true, meta });
  } catch (e) {
    await reportError({ where: "api/admin/jobicy-meta:GET", error: e, notifyOwner: true });
    return NextResponse.json({ error: "No se pudo cargar metadata Jobicy" }, { status: 500 });
  }
}

/** POST: sync countries/positions usando JOBICY_API_KEY del servidor. */
export async function POST(req: Request) {
  if (!isAdminSecret(req.headers.get("x-admin-secret"))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const key = process.env.JOBICY_API_KEY || process.env.SALARY_API_KEY || "";
    if (!key) {
      return NextResponse.json(
        { error: "Falta JOBICY_API_KEY en Vercel para sincronizar metadata." },
        { status: 400 }
      );
    }
    const result = await syncJobicyMeta(key);
    return NextResponse.json({
      ok: result.ok,
      meta: result.meta,
      tried: result.tried,
      cloud: result.cloud,
    });
  } catch (e) {
    await reportError({ where: "api/admin/jobicy-meta:POST", error: e, notifyOwner: true });
    return NextResponse.json({ error: "No se pudo sincronizar metadata Jobicy" }, { status: 500 });
  }
}
