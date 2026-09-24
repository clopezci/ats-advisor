/**
 * IA de pago (Gemini Flash o GPT-4o-mini) para la práctica.
 * No usa el cupo gratis de Groq: este add-on se cobra para cubrir el costo y dejar margen.
 */

type ImageIn = { mime: string; data: string };

const SYSTEM = [
  "Eres el asistente de práctica psicotécnica de ATSAdvisor.",
  "Respondes en español, sin saludo, sin ánimo y sin consejos extra.",
  "El perfil es lo que la persona declaró. No inventes virtudes ni un candidato ideal.",
  "Si el ítem es de personalidad o situacional: elige la opción coherente con el perfil y con las respuestas previas de esta misma sesión.",
  "Si el ítem es numérico, abstracto o verbal: da la respuesta correcta del ejercicio. El perfil no cambia la matemática.",
  "Nunca contradigas una preferencia ya marcada en el perfil.",
].join(" ");

function geminiKey(): string | undefined {
  return process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
}

function openaiKey(): string | undefined {
  return process.env.OPENAI_API_KEY;
}

async function gemini(prompt: string, image?: ImageIn): Promise<string | null> {
  const key = geminiKey();
  if (!key) return null;
  const model = process.env.GEMINI_MODEL_PAID || "gemini-2.5-flash";
  const parts: Record<string, unknown>[] = [{ text: prompt }];
  if (image) parts.push({ inline_data: { mime_type: image.mime, data: image.data } });
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM }] },
      contents: [{ role: "user", parts }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 400 },
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || "").join("") || "";
  return text.trim() || null;
}

async function openai(prompt: string, image?: ImageIn): Promise<string | null> {
  const key = openaiKey();
  if (!key) return null;
  const content: Record<string, unknown>[] = [{ type: "text", text: prompt }];
  if (image) {
    content.push({
      type: "image_url",
      image_url: { url: `data:${image.mime};base64,${image.data}` },
    });
  }
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.2,
      max_tokens: 400,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content },
      ],
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  return typeof text === "string" ? text.trim() : null;
}

export async function completePractice(prompt: string, image?: ImageIn): Promise<string | null> {
  return (await gemini(prompt, image)) || (await openai(prompt, image));
}
