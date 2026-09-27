import { NextResponse } from "next/server";
import { requireCronAuth } from "@/lib/admin/auth";
import { reportError } from "@/lib/observability";

export const runtime = "nodejs";

/**
 * Lunes y jueves. Consulta GoTrue y la base para que el proyecto gratis
 * no llegue a los 7 días sin actividad y Supabase lo pause.
 */
export async function GET(req: Request) {
  const auth = requireCronAuth(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !anon) {
    return NextResponse.json({ error: "Supabase no está configurado" }, { status: 503 });
  }

  try {
    const go = await fetch(`${url}/auth/v1/health`, {
      headers: { apikey: anon },
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });

    const key = service || anon;
    const db = await fetch(`${url}/rest/v1/app_settings?select=key&limit=1`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });

    const gotrue = go.ok;
    const database = db.status > 0 && db.status < 500;
    if (!gotrue && !database) {
      return NextResponse.json(
        { error: "Supabase no respondió. Si sigue restaurando, espera y vuelve a intentar." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, gotrue, database });
  } catch (e) {
    await reportError({ where: "api/cron/keepalive", error: e });
    return NextResponse.json(
      { error: "No se pudo consultar Supabase. Si acaba de restaurarse, espera unos minutos." },
      { status: 502 }
    );
  }
}
