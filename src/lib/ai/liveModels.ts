/**
 * Elige un modelo que la clave pueda usar ahora.
 * Los ids fijos se retiran; si el preferido ya no está en la lista, se usa otro de texto.
 */

const NOT_CHAT = /whisper|tts|embed|orpheus|playai|transcrib|audio|moderation|dall-e|realtime|image|prompt-guard|guard|^ft:/i;
const TTL_MS = 10 * 60 * 1000;

type Listed = { ok: true; ids: string[] } | { ok: false; auth: boolean; detail: string };

const cache = new Map<string, { at: number; ids: string[] }>();

function cacheKey(provider: string, apiKey: string) {
  return `${provider}:${apiKey.length}:${apiKey.slice(-8)}`;
}

function remember(provider: string, apiKey: string, ids: string[]) {
  cache.set(cacheKey(provider, apiKey), { at: Date.now(), ids });
}

function recalled(provider: string, apiKey: string): string[] | null {
  const hit = cache.get(cacheKey(provider, apiKey));
  if (!hit || Date.now() - hit.at > TTL_MS) return null;
  return hit.ids;
}

export function rankChatModels(
  ids: string[],
  hint: string | undefined,
  kind: "fast" | "quality",
  opts?: { preferFree?: boolean }
): string[] {
  const chat = [
    ...new Set(
      ids
        .map((id) => id.replace(/^models\//, "").trim())
        .filter((id) => id && !NOT_CHAT.test(id))
    ),
  ];
  const free = chat.filter((id) => id.endsWith(":free"));
  const pool = opts?.preferFree && free.length ? free : chat;
  const prefer = (hint || "").trim();
  const hinted = prefer && pool.includes(prefer) ? [prefer] : [];
  const rest = pool.filter((id) => id !== prefer);
  rest.sort((a, b) => scoreModel(b, kind) - scoreModel(a, kind));
  return [...hinted, ...rest];
}

function scoreModel(id: string, kind: "fast" | "quality"): number {
  const s = id.toLowerCase();
  if (kind === "fast") {
    if (/8b|20b|instant|mini|flash|small/.test(s)) return 3;
    if (/27b|32b/.test(s)) return 2;
    return 1;
  }
  if (/70b|72b|120b|large|pro/.test(s)) return 3;
  if (/27b|32b|flash/.test(s)) return 2;
  return 1;
}

async function readError(res: Response, apiKey: string): Promise<string> {
  const data = await res.json().catch(() => ({}));
  const raw =
    (typeof data?.error?.message === "string" && data.error.message) ||
    (typeof data?.error === "string" && data.error) ||
    `respondió ${res.status}`;
  return raw.replaceAll(apiKey, "••••").slice(0, 180);
}

export async function listGroqModels(apiKey: string): Promise<Listed> {
  const cached = recalled("groq", apiKey);
  if (cached) return { ok: true, ids: cached };
  try {
    const res = await fetch("https://api.groq.com/openai/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (res.status === 401 || res.status === 403) {
      return { ok: false, auth: true, detail: "no aceptó la clave" };
    }
    if (!res.ok) return { ok: false, auth: false, detail: await readError(res, apiKey) };
    const data = await res.json();
    const ids = Array.isArray(data?.data)
      ? data.data.map((m: { id?: string }) => String(m?.id || "")).filter(Boolean)
      : [];
    remember("groq", apiKey, ids);
    return { ok: true, ids };
  } catch {
    return { ok: false, auth: false, detail: "sin respuesta al pedir los modelos" };
  }
}

export async function listGeminiModels(apiKey: string): Promise<Listed> {
  const cached = recalled("gemini", apiKey);
  if (cached) return { ok: true, ids: cached };
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`
    );
    if (res.status === 400 || res.status === 401 || res.status === 403) {
      const detail = await readError(res, apiKey);
      const auth = /api key|permission|unauth/i.test(detail) || res.status === 401 || res.status === 403;
      return { ok: false, auth, detail };
    }
    if (!res.ok) return { ok: false, auth: false, detail: await readError(res, apiKey) };
    const data = await res.json();
    const ids = Array.isArray(data?.models)
      ? data.models
          .filter((m: { supportedGenerationMethods?: string[] }) =>
            (m.supportedGenerationMethods || []).includes("generateContent")
          )
          .map((m: { name?: string }) => String(m?.name || ""))
          .filter(Boolean)
      : [];
    remember("gemini", apiKey, ids);
    return { ok: true, ids };
  } catch {
    return { ok: false, auth: false, detail: "sin respuesta al pedir los modelos" };
  }
}

export async function listOpenAiModels(apiKey: string): Promise<Listed> {
  const cached = recalled("openai", apiKey);
  if (cached) return { ok: true, ids: cached };
  try {
    const res = await fetch("https://api.openai.com/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (res.status === 401 || res.status === 403) {
      return { ok: false, auth: true, detail: "no aceptó la clave" };
    }
    if (!res.ok) return { ok: false, auth: false, detail: await readError(res, apiKey) };
    const data = await res.json();
    const ids = Array.isArray(data?.data)
      ? data.data.map((m: { id?: string }) => String(m?.id || "")).filter(Boolean)
      : [];
    remember("openai", apiKey, ids);
    return { ok: true, ids };
  } catch {
    return { ok: false, auth: false, detail: "sin respuesta al pedir los modelos" };
  }
}

export async function listOpenRouterModels(apiKey: string): Promise<Listed> {
  const cached = recalled("openrouter", apiKey);
  if (cached) return { ok: true, ids: cached };
  try {
    const res = await fetch("https://openrouter.ai/api/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (res.status === 401 || res.status === 403) {
      return { ok: false, auth: true, detail: "no aceptó la clave" };
    }
    if (!res.ok) return { ok: false, auth: false, detail: await readError(res, apiKey) };
    const data = await res.json();
    const ids = Array.isArray(data?.data)
      ? data.data.map((m: { id?: string }) => String(m?.id || "")).filter(Boolean)
      : [];
    remember("openrouter", apiKey, ids);
    return { ok: true, ids };
  } catch {
    return { ok: false, auth: false, detail: "sin respuesta al pedir los modelos" };
  }
}
