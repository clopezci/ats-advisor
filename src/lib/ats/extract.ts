import mammoth from "mammoth";
import { extractText } from "unpdf";

export async function extractTextFromFile(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  const buf = Buffer.from(await file.arrayBuffer());

  if (name.endsWith(".txt") || name.endsWith(".md")) {
    return buf.toString("utf8");
  }

  if (name.endsWith(".docx")) {
    const result = await mammoth.extractRawText({ buffer: buf });
    return result.value || "";
  }

  if (name.endsWith(".pdf")) {
    const pdfData = new Uint8Array(buf);
    const { text } = await extractText(pdfData);
    const joined = Array.isArray(text) ? text.join("\n") : String(text || "");
    return joined;
  }

  throw new Error("Formato no soportado. Usa PDF, DOCX o TXT.");
}
