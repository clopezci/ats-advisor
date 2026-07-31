import { NextResponse } from "next/server";
import { notifyOwnerTelegram } from "@/lib/notify/channels";
import { readSettings } from "@/lib/settings";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && auth !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const settings = readSettings();
  const checks = [
    { name: "GROQ_API_KEY", ok: Boolean(process.env.GROQ_API_KEY) },
    { name: "GOOGLE_AI_API_KEY", ok: Boolean(process.env.GOOGLE_AI_API_KEY) },
    { name: "TELEGRAM_BOT_TOKEN", ok: Boolean(process.env.TELEGRAM_BOT_TOKEN) },
    { name: "SUPABASE", ok: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) },
    { name: "RESEND_API_KEY", ok: Boolean(process.env.RESEND_API_KEY) },
  ];
  const missing = checks.filter((c) => !c.ok).map((c) => c.name);
  const summary = `Auditoría ${new Date().toISOString()}\nOK: ${checks.filter((c) => c.ok).length}/${checks.length}\nFaltantes: ${missing.join(", ") || "ninguno"}\nPrecio Carrera: ${settings.pricing.carrera} COP`;

  await notifyOwnerTelegram(summary);

  return NextResponse.json({
    ok: true,
    checks,
    missing,
    pricing: settings.pricing,
  });
}
