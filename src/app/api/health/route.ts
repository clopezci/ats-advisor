import { NextResponse } from "next/server";
import { OUTPLACEMENT_MODULES } from "@/lib/outplacement/modules";

export async function GET() {
  const checks = {
    app: true,
    groq: Boolean(process.env.GROQ_API_KEY),
    gemini: Boolean(process.env.GOOGLE_AI_API_KEY),
    telegram: Boolean(process.env.TELEGRAM_BOT_TOKEN),
    supabase: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    wompi: Boolean(process.env.WOMPI_PUBLIC_KEY),
    modules: OUTPLACEMENT_MODULES.length,
  };
  const ok = checks.app && checks.modules > 0;
  return NextResponse.json(
    { ok, service: "atsadvisor", ts: new Date().toISOString(), checks },
    { status: ok ? 200 : 503 }
  );
}
