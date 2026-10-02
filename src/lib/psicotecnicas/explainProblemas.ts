/**
 * Explicaciones con atajos para «Problemas matemáticos» (no fórmulas abstractas).
 */
import { formatEsNumber, parseEsNumber } from "./explainMentalMul";

function money(n: number): string {
  return new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 }).format(Math.round(n));
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function pctOf(base: number, pct: number) {
  return (base * pct) / 100;
}

/** Descuento: vale $X con P% → pagas X − P% */
function explainDiscount(enunciado: string): string[] | null {
  const m = enunciado.match(
    /vale\s*\$?\s*([\d.]+).*?(\d+(?:[.,]\d+)?)\s*%\s*de\s*descuento/i
  );
  if (!m) return null;
  const base = Number(m[1].replace(/\./g, ""));
  const pct = parseEsNumber(m[2]);
  if (!Number.isFinite(base) || pct == null) return null;
  const desc = pctOf(base, pct);
  const pay = base - desc;
  const pasos: string[] = [];

  if (pct === 10) {
    pasos.push(`10% de ${money(base)}: divide entre 10 → ${money(desc)}.`);
  } else if (pct === 25) {
    pasos.push(`25% = la cuarta parte: ${money(base)} ÷ 4 = ${money(desc)}.`);
  } else if (pct === 20) {
    pasos.push(`10% = ${money(base / 10)}; 20% = el doble → ${money(desc)}.`);
  } else if (pct === 15) {
    const ten = base / 10;
    const five = ten / 2;
    pasos.push(
      `10% = ${money(ten)}; 5% = mitad → ${money(five)}; 15% = ${money(ten)} + ${money(five)} = ${money(desc)}.`
    );
  } else {
    pasos.push(`${formatEsNumber(pct)}% de ${money(base)} = ${money(desc)}.`);
  }
  pasos.push(`Restas el descuento del precio: ${money(base)} − ${money(desc)} = ${money(pay)}.`);
  pasos.push(`Respuesta: $${money(pay)} (el % se resta, no se suma).`);
  return pasos;
}

/** Distancia: X km en Y min → km en 60 min */
function explainDistance(enunciado: string): string[] | null {
  const m = enunciado.match(
    /Recorres\s+(\d+(?:[.,]\d+)?)\s*km\s+en\s+(\d+)\s*min.*?1\s*hora/i
  );
  if (!m) return null;
  const km = parseEsNumber(m[1])!;
  const min = Number(m[2]);
  const result = (km * 60) / min;
  return [
    `Es regla de 3 directa: más tiempo → más kilómetros (al mismo ritmo).`,
    `Tabla mental: ${min} min → ${formatEsNumber(km)} km; 60 min → ¿? km.`,
    `Directa: multiplica en cruz y divide. (? × ${min}) = ${formatEsNumber(km)} × 60.`,
    `?= (${formatEsNumber(km)} × 60) ÷ ${min} = ${formatEsNumber(result)} km.`,
    `Respuesta: ${formatEsNumber(result)} km.`,
  ];
}

/** Grifos/trabajo: A en a h, B en b h → juntas (a×b)/(a+b) */
function explainTogether(enunciado: string): string[] | null {
  const m = enunciado.match(
    /A\s+llena\s+en\s+(\d+)\s*h\s+y\s+B\s+en\s+(\d+)\s*h/i
  );
  if (!m) return null;
  const a = Number(m[1]);
  const b = Number(m[2]);
  const prod = a * b;
  const sum = a + b;
  const hours = round2(prod / sum);
  return [
    `Aquí no es una regla de 3 de una sola magnitud: son dos ritmos que se suman.`,
    `Atajo de grifos/personas: tiempo juntas = (A × B) ÷ (A + B).`,
    `${a} × ${b} = ${prod}; ${a} + ${b} = ${sum}.`,
    `${prod} ÷ ${sum} = ${formatEsNumber(hours)} h.`,
    `Comprueba la lógica: juntas van más rápido → el tiempo debe ser menor que ${Math.min(a, b)} h.`,
  ];
}

/** Obreros: n en d días → m obreros ¿cuántos días? */
function explainWorkers(enunciado: string): string[] | null {
  const m = enunciado.match(
    /(\d+)\s+obreros\s+terminan\s+en\s+(\d+)\s+d[ií]as.*?tardan\s+(\d+)/i
  );
  if (!m) return null;
  const n = Number(m[1]);
  const d = Number(m[2]);
  const m2 = Number(m[3]);
  const exact = (d * n) / m2;
  const ans = Number.isInteger(exact) ? exact : Math.floor(exact);

  return [
    `Es regla de 3 inversa: más obreros → menos días (el trabajo es el mismo).`,
    `Cómo se nota: si sube una magnitud, la otra baja → se invierte al armar la cuenta.`,
    `Tabla: ${n} obreros → ${d} días; ${m2} obreros → ¿? días.`,
    `Inversa: el nuevo tiempo = días × (obreros viejos ÷ obreros nuevos).`,
    `?= ${d} × (${n} ÷ ${m2}) = ${d} × ${formatEsNumber(round2(n / m2))} = ${formatEsNumber(round2(exact))} días.`,
    Number.isInteger(exact)
      ? `Respuesta: ${ans} días.`
      : `Sale ${formatEsNumber(round2(exact))}; en opciones enteras eligen ${ans} (días completos).`,
  ];
}

/** Unit price: N cuadernos cuestan $X → 5 cuestan */
function explainUnitPrice(enunciado: string): string[] | null {
  const m = enunciado.match(
    /(\d+)\s+cuadernos\s+cuestan\s*\$?\s*([\d.]+).*?cuestan\s+(\d+)/i
  );
  if (!m) return null;
  const n = Number(m[1]);
  const total = Number(m[2].replace(/\./g, ""));
  const want = Number(m[3]);
  const unit = total / n;
  const pay = unit * want;
  return [
    `Es regla de 3 directa: más cuadernos → más plata (mismo precio unitario).`,
    `Tabla: ${n} cuadernos → $${money(total)}; ${want} cuadernos → ¿?`,
    `Directa: (? × ${n}) = ${want} × ${money(total)}.`,
    `?= (${want} × ${money(total)}) ÷ ${n} = ${money(pay)}.`,
    `O más corto: uno cuesta ${money(unit)}; ${want} × ${money(unit)} = ${money(pay)}.`,
    `Respuesta: $${money(pay)}.`,
  ];
}

/** Reparto en partes 2, 3 y 4 → parte 3 */
function explainParts(enunciado: string): string[] | null {
  const m = enunciado.match(
    /Reparten\s*\$?\s*([\d.]+)\s+en\s+partes\s+2[.,]\s*3\s+y\s+4.*?de\s+3/i
  );
  if (!m) return null;
  const total = Number(m[1].replace(/\./g, ""));
  const unit = total / 9;
  const share = unit * 3;
  return [
    `No es regla de 3: es reparto proporcional (partes).`,
    `Partes 2 + 3 + 4 = 9 partes en total.`,
    `Una parte = ${money(total)} ÷ 9 = ${money(unit)}.`,
    `A quien le tocan 3 partes: ${money(unit)} × 3 = ${money(share)}.`,
    `Respuesta: $${money(share)}.`,
  ];
}

/** Tren pasa poste: v = largo / tiempo */
function explainTrain(enunciado: string): string[] | null {
  const m = enunciado.match(
    /tren\s+de\s+(\d+)\s*m\s+pasa\s+un\s+poste\s+en\s+(\d+)\s*s/i
  );
  if (!m) return null;
  const len = Number(m[1]);
  const sec = Number(m[2]);
  const v = len / sec;
  const shown = Number.isInteger(v) ? v : Math.floor(v);
  return [
    `Al pasar un poste (punto fijo), la distancia que cuenta es solo la longitud del tren.`,
    `Velocidad = metros ÷ segundos: ${len} ÷ ${sec} = ${formatEsNumber(round2(v))} m/s.`,
    Number.isInteger(v)
      ? `Respuesta: ${shown} m/s.`
      : `En opciones enteras: ${shown} m/s (aprox. del cálculo).`,
    `No conviertas a km/h si la pregunta pide m/s.`,
  ];
}

/** Explica un ítem de problemas-matematicos; null si no reconoce el patrón. */
export function explainProblemaMatematico(enunciado: string): string[] | null {
  return (
    explainDiscount(enunciado) ||
    explainDistance(enunciado) ||
    explainTogether(enunciado) ||
    explainParts(enunciado) ||
    explainWorkers(enunciado) ||
    explainTrain(enunciado) ||
    explainUnitPrice(enunciado)
  );
}
