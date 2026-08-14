import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendResendEmail, notifyOwnerTelegram } from "@/lib/notify/channels";
import { rateLimit, rateLimitedResponse } from "@/lib/api/rateLimit";
import { escapeHtml, clampText, isValidEmail } from "@/lib/validation";
import { reportError } from "@/lib/observability";
import { createServiceSupabase, hasSupabase } from "@/lib/supabase/client";

async function userEmailFromBearer(req: Request): Promise<string | null> {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token || !hasSupabase()) return null;
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { persistSession: false } }
  );
  const { data } = await sb.auth.getUser();
  return (data.user?.email || "").toLowerCase() || null;
}

/**
 * Habeas Data: export por correo + opcional wipe cloud (action=wipe).
 * Wipe exige sesión magic-link cuyo email coincida con el solicitado.
 */
export async function POST(req: Request) {
  const limited = rateLimit(req, "habeas", { limit: 5, windowMs: 60_000 });
  if (!limited.ok) return rateLimitedResponse(limited.retryAfterSec);

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
    }
    const email = clampText(body.email || "", 120).trim().toLowerCase();
    const payload = body.payload || {};
    const action = String(body.action || "export");
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Correo inválido" }, { status: 400 });
    }

    if (action === "wipe") {
      const sessionEmail = await userEmailFromBearer(req);
      if (!sessionEmail || sessionEmail !== email) {
        return NextResponse.json(
          {
            error:
              "Para borrar datos cloud inicia sesión (magic link) con el mismo correo y reintenta.",
            code: "AUTH_REQUIRED",
          },
          { status: 401 }
        );
      }
    }

    const sb = createServiceSupabase();
    let cloud: Record<string, unknown> | null = null;
    let wiped = false;

    if (sb) {
      const { data: profile } = await sb.from("profiles").select("*").eq("email", email).maybeSingle();
      if (profile) {
        const { data: scans } = await sb
          .from("ats_scans")
          .select("id, score, created_at")
          .eq("user_id", profile.id)
          .limit(100);
        const { data: courses } = await sb
          .from("courses")
          .select("id, code, title, progress, created_at")
          .eq("user_id", profile.id)
          .limit(50);
        const { data: jobs } = await sb
          .from("job_applications")
          .select("id, title, company, status, created_at")
          .eq("user_id", profile.id)
          .limit(100);
        cloud = { profile, scans: scans || [], courses: courses || [], jobs: jobs || [] };

        if (action === "wipe") {
          await sb.from("ats_scans").delete().eq("user_id", profile.id);
          await sb.from("courses").delete().eq("user_id", profile.id);
          await sb.from("job_applications").delete().eq("user_id", profile.id);
          await sb
            .from("profiles")
            .update({
              plan: "free",
              out09_used_this_month: 0,
              telegram_chat_id: null,
              updated_at: new Date().toISOString(),
            })
            .eq("id", profile.id);
          wiped = true;
          await sb.from("audit_events").insert({
            kind: "habeas_wipe",
            detail: { email, profileId: profile.id, at: new Date().toISOString() },
          });
        }
      }
    }

    const raw = JSON.stringify({ local: payload, cloud }, null, 2).slice(0, 80_000);
    const html = `<pre style="font-family:monospace;white-space:pre-wrap">${escapeHtml(raw)}</pre>`;
    const mail = await sendResendEmail({
      to: email,
      subject: wiped
        ? "ATSAdvisor — baja Habeas Data (datos cloud borrados)"
        : "ATSAdvisor — export Habeas Data",
      html,
    });
    await notifyOwnerTelegram(
      wiped ? `Habeas WIPE cloud por ${email}` : `Habeas Data export solicitado por ${email}`
    );

    return NextResponse.json({
      ok: true,
      emailed: mail.ok,
      skippedEmail: mail.skipped,
      downloadFallback: true,
      cloudFound: Boolean(cloud),
      wiped,
      note: wiped
        ? "Datos cloud del perfil borrados (plan free). Auth.users permanece; puedes borrar la cuenta en Supabase Auth si lo pides."
        : "Export incluye datos locales + cloud si existe perfil con ese correo.",
    });
  } catch (e) {
    await reportError({ where: "api/account/habeas", error: e, notifyOwner: true });
    return NextResponse.json({ error: "No se pudo procesar la solicitud" }, { status: 500 });
  }
}
