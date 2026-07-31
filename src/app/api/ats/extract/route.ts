import { NextResponse } from "next/server";
import { extractTextFromFile } from "@/lib/ats/extract";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Adjunta un archivo CV." }, { status: 400 });
    }
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: "El archivo supera 8 MB." }, { status: 400 });
    }
    const text = await extractTextFromFile(file);
    if (text.trim().length < 40) {
      return NextResponse.json(
        { error: "No pudimos leer texto útil. Prueba DOCX/TXT o pega el contenido." },
        { status: 422 }
      );
    }
    return NextResponse.json({ ok: true, text, filename: file.name });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "No se pudo leer el archivo." },
      { status: 500 }
    );
  }
}
