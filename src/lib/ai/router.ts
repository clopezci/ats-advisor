export type AiTask =
  | "ats_suggest"
  | "cv_rewrite"
  | "application_advice"
  | "out09_outline"
  | "out09_capsule"
  | "interview_feedback"
  | "general";

export type AiMessage = { role: "system" | "user" | "assistant"; content: string };

export type AiResult = {
  text: string;
  provider: "groq" | "gemini" | "openai" | "local";
  usedPaid: boolean;
  qualityScore: number;
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
      "5) LinkedIn alineado; postula pronto; prepara STAR.",
      "",
      `Contexto: ${prompt.slice(0, 280)}`,
    ].join("\n");
  }
  return `Sugerencia local (sin claves IA): revisa tu descripción y concreta un logro medible. Pedido: ${prompt.slice(0, 280)}`;
}

async function callGroq(messages: AiMessage[]): Promise<string | null> {
  const key = process.env.GROQ_API_KEY;
  if (!key) return null;
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages,
      temperature: 0.4,
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? null;
}

async function callGemini(messages: AiMessage[], paid = false): Promise<string | null> {
  const key = process.env.GOOGLE_AI_API_KEY;
  if (!key) return null;
  const model = paid ? "gemini-2.0-flash" : "gemini-2.0-flash";
  const contents = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));
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
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
}

async function callOpenAI(messages: AiMessage[]): Promise<string | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.3,
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? null;
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

export async function completeWithCascade(opts: {
  task: AiTask;
  messages: AiMessage[];
  qualityThreshold?: number;
  maxPaidEscalations?: number;
}): Promise<AiResult> {
  let threshold = opts.qualityThreshold ?? Number(process.env.AI_QUALITY_THRESHOLD || 0.72);
  let maxPaid = opts.maxPaidEscalations ?? 1;
  try {
    const { readSettings } = await import("@/lib/settings");
    const s = readSettings();
    if (opts.qualityThreshold == null) threshold = s.ai_limits.quality_threshold;
    if (opts.maxPaidEscalations == null) maxPaid = s.ai_limits.max_paid_escalations;
  } catch {
    /* ignore */
  }
  const prompt = opts.messages.map((m) => m.content).join("\n");

  // 1) free: Groq
  let text = await callGroq(opts.messages);
  let provider: AiResult["provider"] = "groq";
  let usedPaid = false;
  if (!text) {
    text = await callGemini(opts.messages, false);
    provider = "gemini";
  }
  if (!text) {
    text = localFallback(opts.task, prompt);
    provider = "local";
  }

  let qualityScore = scoreQuality(text, opts.task);
  if (qualityScore >= threshold || maxPaid <= 0) {
    return { text, provider, usedPaid, qualityScore };
  }

  // 2) escalate paid / stronger
  const paid =
    (await callOpenAI(opts.messages)) ||
    (await callGemini(opts.messages, true)) ||
    text;
  usedPaid = Boolean(process.env.OPENAI_API_KEY || process.env.GOOGLE_AI_API_KEY);
  provider = process.env.OPENAI_API_KEY ? "openai" : "gemini";
  qualityScore = scoreQuality(paid, opts.task);
  if (qualityScore < threshold) {
    // one more local-safe note; caller may alert owner
  }
  return { text: paid, provider, usedPaid, qualityScore };
}
