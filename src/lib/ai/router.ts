export type AiTask =
  | "ats_suggest"
  | "cv_rewrite"
  | "application_advice"
  | "out09_outline"
  | "out09_capsule"
  | "interview_feedback"
  | "general";

export type AiMessage = { role: "system" | "user" | "assistant"; content: string };

export type AiProvider =
  | "groq"
  | "gemini"
  | "openai"
  | "openrouter"
  | "local";

export type AiResult = {
  text: string;
  provider: AiProvider;
  usedPaid: boolean;
  qualityScore: number;
  model?: string;
};

/** Modelos por defecto (env puede sobreescribir). */
const MODELS = {
  /** Free · calidad (Groq). */
  groqFree: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
  /** Free · rápido si el de calidad falla. */
  groqFast: process.env.GROQ_MODEL_FAST || "llama-3.1-8b-instant",
  /**
   * Free · calidad alta en Groq (Moonshot Kimi = “Luna”/Moonshot).
   * Buen puente antes de pagar.
   */
  groqKimi: process.env.GROQ_MODEL_KIMI || "moonshotai/kimi-k2-instruct",
  /** Free · Gemini. */
  geminiFree: process.env.GEMINI_MODEL_FREE || "gemini-2.0-flash",
  /** Paid escalate · Gemini más capaz. */
  geminiPaid: process.env.GEMINI_MODEL_PAID || "gemini-2.5-flash",
  /** Paid · OpenAI precio/calidad. */
  openai: process.env.OPENAI_MODEL || "gpt-4o-mini",
  /**
   * Paid · mejor precio/calidad vía OpenRouter (recomendado: DeepSeek).
   * Alternativas: deepseek/deepseek-chat, google/gemini-2.5-flash, anthropic/claude-3.5-haiku
   */
  openrouter: process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat",
};

function localFallback(task: AiTask, prompt: string): string {
  if (task === "out09_outline") {
    return JSON.stringify({
      title: "Curso personalizado de refuerzo",
      objective: "Mejorar la habilidad descrita por el usuario con práctica diaria.",
      capsules: Array.from({ length: 10 }).map((_, i) => ({
        day: i + 1,
        title: `Cápsula ${i + 1}`,
        content: `Práctica breve del día ${i + 1} basada en: ${prompt.slice(0, 180)}`,
        quiz: {
          question: `¿Cuál es el foco de la cápsula ${i + 1}?`,
          options: ["Practicar", "Ignorar", "Postergar"],
          answer: 0,
        },
      })),
    });
  }
  if (task === "cv_rewrite") {
    return [
      "DISCLAIMER: Esto es un apoyo. Debes revisar y ajustar según tu experiencia real.",
      "",
      "Sin claves IA online, aplica este patrón a tus viñetas:",
      "1) Copia 1 logro real que ya tengas.",
      "2) Inserta 1–2 keywords faltantes de la oferta SOLO si son verdad.",
      "3) Formato: Verbo + acción + herramienta/skill + resultado medible.",
      "Ejemplo: 'Lideré migración a [herramienta de la oferta], reduciendo tiempo de cierre 25%.'",
      "",
      `Contexto pedido: ${prompt.slice(0, 400)}`,
    ].join("\n");
  }
  if (task === "application_advice") {
    return [
      "Checklist de buena postulación (modo local):",
      "1) CV adaptado a ESTA vacante (keywords en logros, no stuffing).",
      "2) PDF texto seleccionable / DOCX; 1 columna.",
      "3) Formulario del portal completo con los mismos términos.",
      "4) Mensaje corto: encaje + 1 logro + disponibilidad.",
      "5) Perfil profesional alineado; postula pronto; prepara STAR.",
      "",
      `Contexto: ${prompt.slice(0, 280)}`,
    ].join("\n");
  }
  return `Sugerencia local (sin claves IA): revisa tu descripción y concreta un logro medible. Pedido: ${prompt.slice(0, 280)}`;
}

type ChatOk = { text: string; model: string };

async function openAiCompatibleChat(opts: {
  url: string;
  apiKey: string;
  model: string;
  messages: AiMessage[];
  temperature?: number;
  extraHeaders?: Record<string, string>;
}): Promise<ChatOk | null> {
  try {
    const res = await fetch(opts.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${opts.apiKey}`,
        "Content-Type": "application/json",
        ...opts.extraHeaders,
      },
      body: JSON.stringify({
        model: opts.model,
        messages: opts.messages,
        temperature: opts.temperature ?? 0.4,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text || typeof text !== "string") return null;
    return { text, model: opts.model };
  } catch {
    return null;
  }
}

async function callGroq(messages: AiMessage[], model: string): Promise<ChatOk | null> {
  const key = process.env.GROQ_API_KEY;
  if (!key) return null;
  return openAiCompatibleChat({
    url: "https://api.groq.com/openai/v1/chat/completions",
    apiKey: key,
    model,
    messages,
  });
}

async function callGemini(messages: AiMessage[], model: string): Promise<ChatOk | null> {
  const key = process.env.GOOGLE_AI_API_KEY;
  if (!key) return null;
  try {
    const contents = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));
    const system = messages.find((m) => m.role === "system")?.content;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: system ? { parts: [{ text: system }] } : undefined,
        contents,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text || typeof text !== "string") return null;
    return { text, model };
  } catch {
    return null;
  }
}

async function callOpenAI(messages: AiMessage[]): Promise<ChatOk | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  return openAiCompatibleChat({
    url: "https://api.openai.com/v1/chat/completions",
    apiKey: key,
    model: MODELS.openai,
    messages,
    temperature: 0.3,
  });
}

async function callOpenRouter(messages: AiMessage[]): Promise<ChatOk | null> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return null;
  return openAiCompatibleChat({
    url: "https://openrouter.ai/api/v1/chat/completions",
    apiKey: key,
    model: MODELS.openrouter,
    messages,
    temperature: 0.3,
    extraHeaders: {
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://atsadvisor.app",
      "X-Title": "ATSAdvisor",
    },
  });
}

export function scoreQuality(text: string, task: AiTask): number {
  if (!text || text.length < 40) return 0.1;
  let score = 0.5;
  if (text.length > 200) score += 0.1;
  if (text.length > 800) score += 0.1;
  if (/objetivo|cápsula|capsula|quiz|práctica|practica/i.test(text)) score += 0.15;
  if (task.startsWith("out09") && text.includes("{") && text.includes("}")) score += 0.15;
  if (/lorem ipsum|as an ai|como modelo de lenguaje/i.test(text)) score -= 0.3;
  return Math.max(0, Math.min(1, score));
}

type LlmPrefs = {
  prefer_groq: boolean;
  prefer_gemini: boolean;
  prefer_openai: boolean;
  prefer_openrouter: boolean;
};

/**
 * Cascada tipo OpenRouter (propia):
 * 1) Groq gratis (calidad → rápido)
 * 2) Gemini gratis
 * 3) Groq Kimi (Moonshot, free en Groq) si calidad baja
 * 4) Pago: OpenRouter (DeepSeek) → OpenAI (gpt-4o-mini) → Gemini paid
 */
export async function completeWithCascade(opts: {
  task: AiTask;
  messages: AiMessage[];
  qualityThreshold?: number;
  maxPaidEscalations?: number;
}): Promise<AiResult> {
  let threshold = opts.qualityThreshold ?? Number(process.env.AI_QUALITY_THRESHOLD || 0.72);
  let maxPaid = opts.maxPaidEscalations ?? 1;
  let prefs: LlmPrefs = {
    prefer_groq: true,
    prefer_gemini: true,
    prefer_openai: true,
    prefer_openrouter: true,
  };
  try {
    const { readSettings } = await import("@/lib/settings");
    const s = readSettings();
    if (opts.qualityThreshold == null) threshold = s.ai_limits.quality_threshold;
    if (opts.maxPaidEscalations == null) maxPaid = s.ai_limits.max_paid_escalations;
    prefs = {
      prefer_groq: s.llm.prefer_groq,
      prefer_gemini: s.llm.prefer_gemini,
      prefer_openai: s.llm.prefer_openai,
      prefer_openrouter: s.llm.prefer_openrouter ?? true,
    };
  } catch {
    /* ignore */
  }

  const prompt = opts.messages.map((m) => m.content).join("\n");

  let text: string | null = null;
  let provider: AiProvider = "local";
  let model: string | undefined;
  let usedPaid = false;

  // —— Free tier ——
  if (prefs.prefer_groq) {
    const g =
      (await callGroq(opts.messages, MODELS.groqFree)) ||
      (await callGroq(opts.messages, MODELS.groqFast));
    if (g) {
      text = g.text;
      provider = "groq";
      model = g.model;
    }
  }

  if (!text && prefs.prefer_gemini) {
    const gem = await callGemini(opts.messages, MODELS.geminiFree);
    if (gem) {
      text = gem.text;
      provider = "gemini";
      model = gem.model;
    }
  }

  if (!text) {
    text = localFallback(opts.task, prompt);
    provider = "local";
    model = "local";
  }

  let qualityScore = scoreQuality(text, opts.task);

  // —— Free quality boost (Kimi / Moonshot en Groq) antes de pagar ——
  if (qualityScore < threshold && prefs.prefer_groq && maxPaid > 0) {
    const kimi = await callGroq(opts.messages, MODELS.groqKimi);
    if (kimi) {
      const q = scoreQuality(kimi.text, opts.task);
      if (q > qualityScore) {
        text = kimi.text;
        provider = "groq";
        model = kimi.model;
        qualityScore = q;
        // Kimi en Groq free no cuenta como paid
      }
    }
  }

  if (qualityScore >= threshold || maxPaid <= 0) {
    return { text, provider, usedPaid, qualityScore, model };
  }

  // —— Paid escalate (mejor precio/calidad primero) ——
  const paidAttempts: Array<() => Promise<{ ok: ChatOk; provider: AiProvider; paid: boolean } | null>> = [];

  if (prefs.prefer_openrouter) {
    paidAttempts.push(async () => {
      const r = await callOpenRouter(opts.messages);
      return r ? { ok: r, provider: "openrouter", paid: true } : null;
    });
  }
  if (prefs.prefer_openai) {
    paidAttempts.push(async () => {
      const r = await callOpenAI(opts.messages);
      return r ? { ok: r, provider: "openai", paid: true } : null;
    });
  }
  if (prefs.prefer_gemini) {
    paidAttempts.push(async () => {
      const r = await callGemini(opts.messages, MODELS.geminiPaid);
      return r ? { ok: r, provider: "gemini", paid: true } : null;
    });
  }

  for (const attempt of paidAttempts) {
    const hit = await attempt();
    if (!hit) continue;
    const q = scoreQuality(hit.ok.text, opts.task);
    text = hit.ok.text;
    provider = hit.provider;
    model = hit.ok.model;
    usedPaid = hit.paid;
    qualityScore = q;
    if (q >= threshold) break;
  }

  return { text: text!, provider, usedPaid, qualityScore, model };
}
