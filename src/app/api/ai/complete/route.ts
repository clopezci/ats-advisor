import { NextResponse } from "next/server";
import { completeWithCascade } from "@/lib/ai/router";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const task = body.task || "general";
    const prompt = String(body.prompt || "").trim();
    if (prompt.length < 8) {
      return NextResponse.json({ error: "Escribe un poco más de contexto." }, { status: 400 });
    }

    const result = await completeWithCascade({
      task,
      messages: [
        {
          role: "system",
          content:
            "Eres un coach de empleabilidad hispanohablante (LATAM). Responde en español claro, accionable y honesto. No inventes experiencia del usuario.",
        },
        { role: "user", content: prompt },
      ],
    });

    return NextResponse.json({ ok: true, ...result });
  } catch {
    return NextResponse.json({ error: "La IA no respondió. Reintenta." }, { status: 500 });
  }
}
