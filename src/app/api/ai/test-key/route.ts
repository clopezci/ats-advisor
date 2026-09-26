import { NextResponse } from "next/server";
import {
  isPlausibleUserApiKey,
  normalizeUserApiKey,
  parseUserKeysFromRequest,
  type UserLlmKeys,
} from "@/lib/ai/userKeysServer";
import { rateLimit, rateLimitedResponse } from "@/lib/api/rateLimit";
import {
  listGeminiModels,
  listGroqModels,
  listOpenAiModels,
  listOpenRouterModels,
  rankChatModels,
} from "@/lib/ai/liveModels";

export const runtime = "nodejs";

type Provider = keyof UserLlmKeys;

/**
 * Prueba una clave BYOK con un completion mínimo (no usa claves de la app).
 * La clave puede ir en el cuerpo o en x-user-keys.
 */
export async function POST(req: Request) {
  const limited = rateLimit(req, "ai-test-key", { limit: 10, windowMs: 60_000 });
  if (!limited.ok) return rateLimitedResponse(limited.retryAfterSec);

  try {
    const body = await req.json().catch(() => ({}));
    const provider = String(body.provider || "").toLowerCase() as Provider;
    const fromBody = typeof body.apiKey === "string" ? normalizeUserApiKey(body.apiKey) : "";
    const keys = parseUserKeysFromRequest(req);
    const key = (fromBody && isPlausibleUserApiKey(fromBody) ? fromBody : "") || keys[provider] || "";

    if (!key) {
      const raw = fromBody || (typeof body.apiKey === "string" ? body.apiKey.trim() : "");
      return NextResponse.json(
        {
          error: raw
            ? "Esa clave no tiene la forma de una API key. Pega solo la key, sin espacios ni texto alrededor."
            : "Falta la clave. Pégala en el campo y vuelve a tocar Probar y guardar.",
        },
        { status: 400 }
      );
    }

    const messages = [{ role: "user" as const, content: "Responde solo: OK" }];

    if (provider === "groq") {
      const listed = await listGroqModels(key);
      if (!listed.ok) {
        return NextResponse.json(
          {
            error: listed.auth
              ? "Groq no aceptó la clave. Créala de nuevo y pégala completa."
              : `Groq: ${listed.detail}`,
          },
          { status: 400 }
        );
      }
      const models = rankChatModels(listed.ids, process.env.GROQ_MODEL, "fast").slice(0, 4);
      if (!models.length) {
        return NextResponse.json(
          { error: "La clave entró, pero esa cuenta de Groq no tiene un modelo de texto disponible." },
          { status: 400 }
        );
      }
      const tried = await tryModels(
        "https://api.groq.com/openai/v1/chat/completions",
        key,
        models,
        messages
      );
      return tried.ok
        ? NextResponse.json({ ok: true, label: "Groq" })
        : NextResponse.json({ error: `Groq: ${tried.detail}` }, { status: 400 });
    }

    if (provider === "gemini") {
      const listed = await listGeminiModels(key);
      if (!listed.ok) {
        return NextResponse.json(
          {
            error: listed.auth
              ? "Gemini no aceptó la clave. Créala de nuevo en Google AI Studio y pégala completa."
              : `Gemini: ${listed.detail}`,
          },
          { status: 400 }
        );
      }
      const models = rankChatModels(listed.ids, process.env.GEMINI_MODEL_FREE, "fast").slice(0, 3);
      if (!models.length) {
        return NextResponse.json(
          { error: "La clave entró, pero esa cuenta de Gemini no tiene un modelo de texto disponible." },
          { status: 400 }
        );
      }
      let last = "no respondió.";
      for (const model of models) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: "OK" }] }] }),
        });
        if (res.ok) return NextResponse.json({ ok: true, label: "Gemini" });
        last = await readDetail(res, key);
      }
      return NextResponse.json({ error: `Gemini: ${last}` }, { status: 400 });
    }

    if (provider === "openrouter") {
      const listed = await listOpenRouterModels(key);
      if (!listed.ok) {
        return NextResponse.json(
          {
            error: listed.auth
              ? "OpenRouter no aceptó la clave."
              : `OpenRouter: ${listed.detail}`,
          },
          { status: 400 }
        );
      }
      const models = rankChatModels(listed.ids, process.env.OPENROUTER_MODEL, "fast", {
        preferFree: true,
      }).slice(0, 4);
      if (!models.length) {
        return NextResponse.json(
          { error: "La clave entró, pero esa cuenta de OpenRouter no tiene un modelo de texto disponible." },
          { status: 400 }
        );
      }
      const tried = await tryModels(
        "https://openrouter.ai/api/v1/chat/completions",
        key,
        models,
        messages,
        {
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://atsadvisor.app",
          "X-Title": "ATSAdvisor",
        }
      );
      return tried.ok
        ? NextResponse.json({ ok: true, label: "OpenRouter" })
        : NextResponse.json({ error: `OpenRouter: ${tried.detail}` }, { status: 400 });
    }

    if (provider === "openai") {
      const listed = await listOpenAiModels(key);
      if (!listed.ok) {
        return NextResponse.json(
          {
            error: listed.auth
              ? "OpenAI no aceptó la clave. Tiene que ser una API key, no la de ChatGPT Plus."
              : `OpenAI: ${listed.detail}`,
          },
          { status: 400 }
        );
      }
      const models = rankChatModels(listed.ids, process.env.OPENAI_MODEL, "fast").slice(0, 3);
      if (!models.length) {
        return NextResponse.json(
          { error: "La clave entró, pero esa cuenta de OpenAI no tiene un modelo de texto disponible." },
          { status: 400 }
        );
      }
      const tried = await tryModels(
        "https://api.openai.com/v1/chat/completions",
        key,
        models,
        messages
      );
      return tried.ok
        ? NextResponse.json({ ok: true, label: "OpenAI" })
        : NextResponse.json({ error: `OpenAI: ${tried.detail}` }, { status: 400 });
    }

    return NextResponse.json({ error: "Elige Groq, Gemini, OpenRouter u OpenAI." }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "No se pudo probar la clave. Revisa tu conexión." }, { status: 500 });
  }
}

async function tryModels(
  url: string,
  apiKey: string,
  models: string[],
  messages: { role: "user"; content: string }[],
  extraHeaders?: Record<string, string>
): Promise<{ ok: true } | { ok: false; detail: string }> {
  let last = "el proveedor no respondió.";
  for (const model of models) {
    const hit = await pingOpenAiCompat(url, apiKey, model, messages, extraHeaders);
    if (hit.ok) return { ok: true };
    last = hit.detail;
    if (hit.auth) break;
  }
  return { ok: false, detail: last };
}

async function pingOpenAiCompat(
  url: string,
  apiKey: string,
  model: string,
  messages: { role: "user"; content: string }[],
  extraHeaders?: Record<string, string>
): Promise<{ ok: true } | { ok: false; auth: boolean; detail: string }> {
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
    if (res.ok) return { ok: true };
    const detail = await readDetail(res, apiKey);
    const modelGone = /does not exist|decommissioned|model .* not found|no longer supported/i.test(detail);
    const auth = !modelGone && (res.status === 401 || /invalid api key|unauthorized/i.test(detail));
    return { ok: false, auth, detail };
  } catch {
    return { ok: false, auth: false, detail: "sin respuesta del proveedor." };
  }
}

async function readDetail(res: Response, apiKey: string): Promise<string> {
  const data = await res.json().catch(() => ({}));
  const raw =
    (typeof data?.error?.message === "string" && data.error.message) ||
    (typeof data?.error === "string" && data.error) ||
    `respondió ${res.status}`;
  return raw.replaceAll(apiKey, "••••").slice(0, 180);
}
