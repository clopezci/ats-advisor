const OFF =
  /receta de |bandeja paisa|poema de amor|cu[eé]ntame un chiste|hacke(ar|o)|qu[eé] pastilla|s[ií]ntomas de la gripe|bitcoin|tarea del colegio|novi[oa]\b/i;

const TEST =
  /\?|\b[a-e]\)|opci[oó]n|serie|figura|personalidad|situaci|verdadero|falso|escala|elige|cu[aá]nto|qu[eé] n[uú]mero|analog[ií]a|disc|16pf|hogan|talent/i;

/** La práctica solo contesta ítems de prueba. Otro tema recibe texto fijo, no silencio. */
export function assessPracticeQuestion(text: string, hasImage: boolean): { ok: true } | { ok: false; reply: string } {
  const q = text.trim();
  const reply =
    "Solo resuelvo preguntas de práctica psicotécnica: personalidad, situacional, numérico, verbal o abstracto. Pega el ítem de la prueba.";
  if (OFF.test(q) && !TEST.test(q)) return { ok: false, reply };
  if (hasImage) return { ok: true };
  if (q.length < 8) return { ok: false, reply };
  if (TEST.test(q) || q.length >= 40) return { ok: true };
  return { ok: false, reply };
}

export function parsePracticeAnswer(text: string): { respuesta: string; porque: string; tipo: string } | null {
  const respuesta = text.match(/RESPUESTA:\s*(.+)/i)?.[1]?.trim() || "";
  const porque = text.match(/POR QU[EÉ]:\s*(.+)/i)?.[1]?.trim() || "";
  const tipo = (text.match(/TIPO:\s*([a-záéíóúñ ]+)/i)?.[1] || "otro").trim().toLowerCase();
  if (respuesta.length < 1) return null;
  return {
    respuesta: respuesta.slice(0, 400),
    porque: porque.slice(0, 280),
    tipo: tipo.slice(0, 40) || "otro",
  };
}

export const TIPOS_CASO = ["mixto", "numerico", "abstracto", "verbal", "personalidad", "situacional"] as const;

export function parseCaso(text: string): { enunciado: string; tipo: string } | null {
  const enunciado = text.match(/ENUNCIADO:\s*([\s\S]+?)(?:\nTIPO:|$)/i)?.[1]?.trim() || "";
  const tipo = (text.match(/TIPO:\s*([a-záéíóúñ ]+)/i)?.[1] || "otro").trim().toLowerCase();
  const limpio = enunciado.replace(/\n?RESPUESTA:[\s\S]*/i, "").replace(/\n?POR QU[EÉ]:[\s\S]*/i, "").trim();
  if (limpio.length < 20) return null;
  return { enunciado: limpio.slice(0, 2500), tipo: tipo.slice(0, 40) || "otro" };
}

export function parseHint(text: string): { pista: string; tipo: string } | null {
  const pista = text.match(/PISTA:\s*([\s\S]+?)(?:\nTIPO:|$)/i)?.[1]?.trim() || "";
  const tipo = (text.match(/TIPO:\s*([a-záéíóúñ ]+)/i)?.[1] || "otro").trim().toLowerCase();
  if (pista.length < 8) return null;
  if (/RESPUESTA:/i.test(pista)) return null;
  return { pista: pista.slice(0, 400), tipo: tipo.slice(0, 40) || "otro" };
}
