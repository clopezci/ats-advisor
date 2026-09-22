import { NextResponse } from "next/server";
import { parseUserKeysFromRequest, hasAnyUserKey } from "@/lib/ai/userKeysServer";
import { rateLimit, rateLimitedResponse } from "@/lib/api/rateLimit";

export const runtime = "nodejs";

/**
 * Prueba una clave BYOK con un completion mínimo (no usa claves de la app).
 */
export async function POST(req: Request) {
  const limited = rateLimit(req, "ai-test-key", { limit: 10, windowMs: 60_000 });
  if (!limited.ok) return rateLimitedResponse(limited.retryAfterSec);

  try {
    const body = await req.json().catch(() => ({}));
    const provider = String(body.provider || "").toLowerCase();
    const keys = parseUserKeysFromRequest(req);
    if (!hasAnyUserKey(keys)) {
      return NextResponse.json({ error: "Falta la clave en la cabecera." }, { status: 400 });
    }

    const messages = [
      { role: "user" as const, content: "Responde solo: OK" },
    ];

    if (provider === "groq" && keys.groq) {
      const ok = await pingOpenAiCompat(
        "https://api.groq.com/openai/v1/chat/completions",
        keys.groq,
        process.env.GROQ_MODEL_FAST || "llama-3.1-8b-instant",
        messages
      );
      return ok
        ? NextResponse.json({ ok: true, label: "Groq" })
        : NextResponse.json({ error: "Groq rechazó la clave." }, { status: 400 });
    }

    if (provider === "gemini" && keys.gemini) {
      const model = process.env.GEMINI_MODEL_FREE || "gemini-2.0-flash";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${keys.gemini}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: "OK" }] }] }),
      });
      return res.ok
        ? NextResponse.json({ ok: true, label: "Gemini" })
        : NextResponse.json({ error: "Gemini rechazó la clave." }, { status: 400 });
    }

    if (provider === "openrouter" && keys.openrouter) {
      const ok = await pingOpenAiCompat(
        "https://openrouter.ai/api/v1/chat/completions",
        keys.openrouter,
        "openrouter/auto",
        messages,
        {
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://atsadvisor.app",
          "X-Title": "ATSAdvisor",
        }
      );
      return ok
        ? NextResponse.json({ ok: true, label: "OpenRouter" })
        : NextResponse.json({ error: "OpenRouter rechazó la clave." }, { status: 400 });
    }

    if (provider === "openai" && keys.openai) {
      const ok = await pingOpenAiCompat(
        "https://api.openai.com/v1/chat/completions",
        keys.openai,
        process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages
      );
      return ok
        ? NextResponse.json({ ok: true, label: "OpenAI" })
        : NextResponse.json({ error: "OpenAI rechazó la clave." }, { status: 400 });
    }

    return NextResponse.json({ error: "Proveedor no soportado o sin clave." }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "No se pudo probar la clave." }, { status: 500 });
  }
}

async function pingOpenAiCompat(
  url: string,
  apiKey: string,
  model: string,
  messages: { role: "user"; content: string }[],
  extraHeaders?: Record<string, string>
): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        ...extraHeaders,
      },
      body: JSON.stringify({ model, messages, max_tokens: 8, temperature: 0 }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
