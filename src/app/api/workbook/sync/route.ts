import { NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/client";
import { requirePaidCloud } from "@/lib/entitlements/requirePaidApi";
import { rateLimit, rateLimitedResponse } from "@/lib/api/rateLimit";
import { reportError } from "@/lib/observability";
import { clampText } from "@/lib/validation";

export const runtime = "nodejs";

const MAX_JSON_CHARS = 180_000;

/** GET ?email= — baja workbook cloud si existe. */
export async function GET(req: Request) {
  const limited = rateLimit(req, "workbook-get", { limit: 30, windowMs: 60_000 });
  if (!limited.ok) return rateLimitedResponse(limited.retryAfterSec);

  try {
    const email = new URL(req.url).searchParams.get("email") || "";
    const gate = await requirePaidCloud({
      email,
      allowLocalDev: true,
      errorMessage: "Sync del cuadernillo requiere plan Carrera con correo en cloud.",
    });
    if (!gate.ok) return gate.response;
    if (!gate.email) {
      return NextResponse.json({ ok: true, workbook: null, updatedAt: null });
    }

    const sb = createServiceSupabase();
    if (!sb) {
      return NextResponse.json({ ok: true, workbook: null, skipped: "no_supabase" });
    }

    const { data, error } = await sb
      .from("profiles")
      .select("workbook_json, workbook_updated_at")
      .eq("email", gate.email)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: "No se pudo leer el cuadernillo cloud." }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      workbook: data?.workbook_json ?? null,
      updatedAt: data?.workbook_updated_at
        ? new Date(data.workbook_updated_at).getTime()
        : null,
    });
  } catch (error) {
    await reportError({ where: "api/workbook/sync GET", error, notifyOwner: false });
    return NextResponse.json({ error: "Error al sincronizar." }, { status: 500 });
  }
}

/** POST { email, workbook, updatedAt } — sube si es más nuevo o no hay cloud. */
export async function POST(req: Request) {
  const limited = rateLimit(req, "workbook-post", { limit: 20, windowMs: 60_000 });
  if (!limited.ok) return rateLimitedResponse(limited.retryAfterSec);

  try {
    const body = await req.json();
    const gate = await requirePaidCloud({
      email: body.email,
      allowLocalDev: true,
      errorMessage: "Sync del cuadernillo requiere plan Carrera con correo en cloud.",
    });
    if (!gate.ok) return gate.response;
    if (!gate.email) {
      return NextResponse.json({ error: "Correo requerido." }, { status: 400 });
    }

    const workbook = body.workbook;
    if (!workbook || typeof workbook !== "object") {
      return NextResponse.json({ error: "Workbook inválido." }, { status: 400 });
    }

    const raw = JSON.stringify(workbook);
    if (raw.length > MAX_JSON_CHARS) {
      return NextResponse.json({ error: "Cuadernillo demasiado grande para sync." }, { status: 413 });
    }

    const clientUpdated = Number(body.updatedAt) || Date.now();
    const sb = createServiceSupabase();
    if (!sb) {
      return NextResponse.json({ ok: true, skipped: "no_supabase" });
    }

    const { data: existing } = await sb
      .from("profiles")
      .select("id, workbook_updated_at")
      .eq("email", gate.email)
      .maybeSingle();

    if (!existing?.id) {
      return NextResponse.json(
        { error: "No hay perfil cloud con ese correo. Entra con magic link primero." },
        { status: 404 }
      );
    }

    const cloudMs = existing.workbook_updated_at
      ? new Date(existing.workbook_updated_at).getTime()
      : 0;
    if (cloudMs > clientUpdated + 2000) {
      return NextResponse.json({
        ok: true,
        skipped: "cloud_newer",
        cloudUpdatedAt: cloudMs,
      });
    }

    const iso = new Date(clientUpdated).toISOString();
    const { error } = await sb
      .from("profiles")
      .update({
        workbook_json: workbook,
        workbook_updated_at: iso,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (error) {
      return NextResponse.json({ error: "No se pudo guardar en cloud." }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      updatedAt: clientUpdated,
      email: clampText(gate.email, 120),
    });
  } catch (error) {
    await reportError({ where: "api/workbook/sync POST", error, notifyOwner: false });
    return NextResponse.json({ error: "Error al sincronizar." }, { status: 500 });
  }
}
