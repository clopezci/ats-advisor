import { NextResponse } from "next/server";
import { OUTPLACEMENT_MODULES } from "@/lib/outplacement/modules";

export async function GET() {
  const checks = {
    app: true,
    groq: Boolean(process.env.GROQ_API_KEY),
    gemini: Boolean(process.env.GOOGLE_AI_API_KEY),
    openai: Boolean(process.env.OPENAI_API_KEY),
    embeddings: Boolean(
      process.env.OPENAI_API_KEY ||
        process.env.GOOGLE_AI_API_KEY ||
        process.env.HF_TOKEN ||
        process.env.HUGGINGFACE_API_KEY
    ),
    telegram: Boolean(process.env.TELEGRAM_BOT_TOKEN),
    whatsapp: Boolean(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID),
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
