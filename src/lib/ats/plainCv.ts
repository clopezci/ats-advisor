/**
 * Deja solo el CV listo para Word (sin títulos internos de la IA).
 */

const JUNK_LINE =
  /^(resumen de cambios|cv reescrito(?: completo)?(?: en texto plano)?|texto plano|hoja de vida\s*[—\-–]\s*atsadvisor|disclaimer|versión ajustada|version ajustada|cambios realizados|notas de la ia)\b/i;

const JUNK_BLOCK_START =
  /^(resumen de cambios|cambios realizados|notas|disclaimer)\s*:?\s*$/i;

export function extractPlainCv(raw: string): string {
  let text = (raw || "").replace(/\r\n/g, "\n").trim();
  if (!text) return "";

  const startMarkers = [
    /\n(?:cv(?:\s+reescrito)?|hoja de vida|versi[oó]n(?:\s+ajustada)?|texto(?:\s+del)?\s+cv)\s*:?\s*\n/i,
  ];
  for (const re of startMarkers) {
    const m = text.search(re);
    if (m >= 0) {
      text = text.slice(m).replace(/^[^\n]*\n/, "").trim();
      break;
    }
  }

  const lines = text.split("\n");
  const out: string[] = [];
  let skippingBlock = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (JUNK_BLOCK_START.test(trimmed)) {
      skippingBlock = true;
      continue;
    }
    if (skippingBlock) {
      if (!trimmed || /^#{1,3}\s/.test(trimmed) || /^[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ\s]{3,}$/.test(trimmed)) {
        skippingBlock = false;
      } else {
        continue;
      }
    }
    if (!trimmed) {
      out.push("");
      continue;
    }
    if (JUNK_LINE.test(trimmed)) continue;
    if (/^esto es un apoyo de redacci[oó]n/i.test(trimmed)) continue;
    if (/^no inventa experiencia/i.test(trimmed)) continue;
    out.push(line.trimEnd());
  }

  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}
