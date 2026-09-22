"use client";

/**
 * Claves de IA del usuario (BYOK), mismo modelo que Aquí Entiendes / aquientiendes.com.
 * Se guardan SOLO en este navegador; viajan en la cabecera x-user-keys por petición
 * y no se persisten en nuestra base de datos.
 */

export type UserAiProvider = "groq" | "gemini" | "openrouter" | "openai";

export type UserAiKeys = Partial<Record<UserAiProvider, string>>;

export type UserAiKeyGuide = {
  id: UserAiProvider;
  name: string;
  why: string;
  free: string;
  url: string;
  looks: string;
  steps: string[];
  pago?: boolean;
};

export const USER_AI_KEY_GUIDES: UserAiKeyGuide[] = [
  {
    id: "groq",
    name: "Groq",
    why: "Rápido y suficiente para carta, tips y ajuste de CV.",
    free: "Gratis con límites diarios amplios.",
    url: "https://console.groq.com/keys",
    looks: "Empieza por gsk_",
    steps: [
      "Abre console.groq.com/keys e inicia sesión con Google o GitHub.",
      "Toca «Create API Key», nómbrala (ej. ATSAdvisor) y créala.",
      "Cópiala de una vez (Groq solo la muestra una vez).",
      "Pégala aquí y toca «Probar y guardar».",
    ],
  },
  {
    id: "gemini",
    name: "Google Gemini",
    why: "Buena calidad en español; útil si Groq falla.",
    free: "Gratis con cuenta de Google.",
    url: "https://aistudio.google.com/apikey",
    looks: "Empieza por AIza",
    steps: [
      "Abre aistudio.google.com/apikey con tu cuenta Google.",
      "Crea una API key y cópiala.",
      "Pégala aquí y toca «Probar y guardar».",
    ],
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    why: "Varios modelos :free como respaldo.",
    free: "Cupo gratis diario con modelos «:free».",
    url: "https://openrouter.ai/keys",
    looks: "Empieza por sk-or-",
    steps: [
      "Abre openrouter.ai/keys e inicia sesión.",
      "Crea una key, cópiala y pégala aquí.",
    ],
  },
  {
    id: "openai",
    name: "OpenAI",
    why: "GPT por API (pago por uso).",
    free: "De pago. ChatGPT Plus NO sirve: la API se cobra aparte.",
    url: "https://platform.openai.com/api-keys",
    looks: "Empieza por sk-",
    steps: [
      "Abre platform.openai.com/api-keys.",
      "Carga un saldo pequeño en Billing.",
      "Crea una secret key, cópiala y pégala aquí.",
    ],
    pago: true,
  },
];

const STORAGE_KEY = "ats_user_ai_keys";

export function loadUserAiKeys(): UserAiKeys {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const obj = JSON.parse(raw) as Record<string, unknown>;
    const out: UserAiKeys = {};
    for (const id of ["groq", "gemini", "openrouter", "openai"] as UserAiProvider[]) {
      const v = obj[id];
      if (typeof v === "string" && v.trim().length >= 20) out[id] = v.trim();
    }
    return out;
  } catch {
    return {};
  }
}

export function saveUserAiKeys(keys: UserAiKeys) {
  try {
    const clean = Object.fromEntries(
      Object.entries(keys).filter(([, v]) => typeof v === "string" && v.trim().length >= 20)
    );
    if (Object.keys(clean).length) localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage bloqueado */
  }
}

export function hasUserAiKeys(): boolean {
  return Object.keys(loadUserAiKeys()).length > 0;
}

export function maskUserAiKey(k: string): string {
  return k.length > 10 ? `${k.slice(0, 6)}…${k.slice(-4)}` : "••••";
}

/** Cabeceras para /api/ai/* incluyendo x-user-keys si hay BYOK. */
export function withUserAiHeaders(init?: HeadersInit): Headers {
  const h = new Headers(init);
  if (!h.has("Content-Type")) h.set("Content-Type", "application/json");
  const keys = loadUserAiKeys();
  if (Object.keys(keys).length) h.set("x-user-keys", JSON.stringify(keys));
  return h;
}
