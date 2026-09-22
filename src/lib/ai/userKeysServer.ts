/**
 * Parseo server-side de BYOK (cabecera x-user-keys).
 * Nunca se escribe a disco ni a logs.
 */

export type UserLlmKeys = {
  groq?: string;
  gemini?: string;
  openrouter?: string;
  openai?: string;
};

const KEY_RE = /^[A-Za-z0-9_\-.]{20,200}$/;
const ALLOWED = ["groq", "gemini", "openrouter", "openai"] as const;

export function parseUserKeysFromRequest(req: Request): UserLlmKeys {
  const raw = req.headers.get("x-user-keys");
  if (!raw || raw.length > 4000) return {};
  try {
    const obj = JSON.parse(raw) as Record<string, unknown>;
    const out: UserLlmKeys = {};
    for (const id of ALLOWED) {
      const v = obj[id];
      if (typeof v === "string" && KEY_RE.test(v.trim())) out[id] = v.trim();
    }
    return out;
  } catch {
    return {};
  }
}

export function hasAnyUserKey(keys: UserLlmKeys): boolean {
  return Boolean(keys.groq || keys.gemini || keys.openrouter || keys.openai);
}
