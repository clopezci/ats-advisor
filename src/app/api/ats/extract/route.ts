import { NextResponse } from "next/server";
import { extractTextFromFile } from "@/lib/ats/extract";
import { rateLimit, rateLimitedResponse } from "@/lib/api/rateLimit";
import { reportError } from "@/lib/observability";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const limited = rateLimit(req, "ats-extract", { limit: 20, windowMs: 60_000 });
  if (!limited.ok) return rateLimitedResponse(limited.retryAfterSec);

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Adjunta un archivo CV." }, { status: 400 });
    }
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: "El archivo supera 8 MB." }, { status: 400 });
    }
    const name = (file.name || "").toLowerCase();
    const allowed =
      name.endsWith(".pdf") ||
      name.endsWith(".docx") ||
      name.endsWith(".txt") ||
      name.endsWith(".md") ||
      file.type === "application/pdf" ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.type === "text/plain";
    if (!allowed) {
      return NextResponse.json(
        { error: "Formato no permitido. Usa PDF, DOCX o TXT." },
        { status: 400 }
      );
    }
    const text = await extractTextFromFile(file);
    if (text.trim().length < 40) {
      return NextResponse.json(
        { error: "No pudimos leer texto útil. Prueba DOCX/TXT o pega el contenido." },
        { status: 422 }
      );
    }
    return NextResponse.json({ ok: true, text, filename: file.name.slice(0, 180) });
  } catch (e) {
    await reportError({ where: "api/ats/extract", error: e });
    return NextResponse.json(
      { error: "No se pudo leer el archivo. Prueba otro formato o pega el texto." },
      { status: 500 }
    );
  }
}
