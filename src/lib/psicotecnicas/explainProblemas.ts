/**
 * Explicaciones con atajos para «Problemas matemáticos».
 * Marca regla de 3 directa/inversa cuando aplica.
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
  if (pct === 10) pasos.push(`10% de ${money(base)}: ÷10 → ${money(desc)}.`);
  else if (pct === 25) pasos.push(`25% = ÷4: ${money(base)} ÷ 4 = ${money(desc)}.`);
  else if (pct === 20) pasos.push(`10% = ${money(base / 10)}; 20% = doble → ${money(desc)}.`);
  else if (pct === 15) {
    const ten = base / 10;
    pasos.push(`10% = ${money(ten)}; 5% = ${money(ten / 2)}; 15% = ${money(desc)}.`);
  } else pasos.push(`${formatEsNumber(pct)}% de ${money(base)} = ${money(desc)}.`);
  pasos.push(`Pagas: ${money(base)} − ${money(desc)} = ${money(pay)}.`);
  pasos.push(`Respuesta: $${money(pay)}.`);
  return pasos;
}

function explainDistance(enunciado: string): string[] | null {
  const m = enunciado.match(
    /Recorres\s+(\d+(?:[.,]\d+)?)\s*km\s+en\s+(\d+)\s*min.*?1\s*hora/i
  );
  if (!m) return null;
  const km = parseEsNumber(m[1])!;
  const min = Number(m[2]);
  const result = (km * 60) / min;
  return [
    `Regla de 3 directa: más tiempo → más km.`,
    `${min} min → ${formatEsNumber(km)} km; 60 min → ¿?`,
    `?= (${formatEsNumber(km)} × 60) ÷ ${min} = ${formatEsNumber(result)} km.`,
    `Respuesta: ${formatEsNumber(result)} km.`,
  ];
}

function explainTogether(enunciado: string): string[] | null {
  const m = enunciado.match(/A\s+llena\s+en\s+(\d+)\s*h\s+y\s+B\s+en\s+(\d+)\s*h/i);
  if (!m) return null;
  const a = Number(m[1]);
  const b = Number(m[2]);
  const hours = round2((a * b) / (a + b));
  return [
    `Dos ritmos que se suman (no es regla de 3 simple).`,
    `Atajo: tiempo juntas = (A × B) ÷ (A + B).`,
    `${a} × ${b} = ${a * b}; ${a} + ${b} = ${a + b}.`,
    `${a * b} ÷ ${a + b} = ${formatEsNumber(hours)} h.`,
    `Debe salir menos que ${Math.min(a, b)} h.`,
  ];
}

function explainParts(enunciado: string): string[] | null {
  const m = enunciado.match(
    /Reparten\s*\$?\s*([\d.]+)\s+en\s+partes\s+2[.,]\s*3\s+y\s+4.*?de\s+3/i
  );
  if (!m) return null;
  const total = Number(m[1].replace(/\./g, ""));
  const unit = total / 9;
  return [
    `Reparto proporcional: 2+3+4 = 9 partes.`,
    `Una parte = ${money(total)} ÷ 9 = ${money(unit)}.`,
    `3 partes = ${money(unit)} × 3 = ${money(unit * 3)}.`,
    `Respuesta: $${money(unit * 3)}.`,
  ];
}

function explainWorkers(enunciado: string): string[] | null {
  const m = enunciado.match(
    /(\d+)\s+obreros\s+terminan\s+en\s+(\d+)\s+d[ií]as.*?tardan\s+(\d+)/i
  );
  if (!m) return null;
  const n = Number(m[1]);
  const d = Number(m[2]);
  const m2 = Number(m[3]);
  const exact = (d * n) / m2;
  const ans = Number.isInteger(exact) ? exact : Math.round(exact);
  return [
    `Regla de 3 inversa: más obreros → menos días.`,
    `${n} obreros → ${d} días; ${m2} obreros → ¿?`,
    `Inversa: ?= ${d} × (${n} ÷ ${m2}) = ${formatEsNumber(round2(exact))} días.`,
    Number.isInteger(exact)
      ? `Respuesta: ${ans} días.`
      : `Exacto ${formatEsNumber(round2(exact))}; en opciones enteras ≈ ${ans}.`,
  ];
}

function explainTrain(enunciado: string): string[] | null {
  const m = enunciado.match(/tren\s+de\s+(\d+)\s*m\s+pasa\s+un\s+poste\s+en\s+(\d+)\s*s/i);
  if (!m) return null;
  const len = Number(m[1]);
  const sec = Number(m[2]);
  const v = len / sec;
  return [
    `Poste = punto: la distancia es la longitud del tren.`,
    `v = ${len} ÷ ${sec} = ${formatEsNumber(round2(v))} m/s.`,
    `Respuesta: ${formatEsNumber(Number.isInteger(v) ? v : round2(v))} m/s.`,
  ];
}

function explainUnitPrice(enunciado: string): string[] | null {
  const m = enunciado.match(
    /(\d+)\s+cuadernos\s+cuestan\s*\$?\s*([\d.]+).*?cuestan\s+(\d+)/i
  );
  if (!m) return null;
  const n = Number(m[1]);
  const total = Number(m[2].replace(/\./g, ""));
  const want = Number(m[3]);
  const pay = (total / n) * want;
  return [
    `Regla de 3 directa: más cuadernos → más plata.`,
    `${n} → $${money(total)}; ${want} → ¿?`,
    `?= (${want} × ${money(total)}) ÷ ${n} = ${money(pay)}.`,
    `Respuesta: $${money(pay)}.`,
  ];
}

function explainAverage(enunciado: string): string[] | null {
  const m = enunciado.match(/notas?\s+([\d.,\syY]+).*promedio/i);
  if (!m) return null;
  const nums = (m[1].match(/\d+(?:[.,]\d+)?/g) || [])
    .map((s) => parseEsNumber(s))
    .filter((n): n is number => n != null);
  if (nums.length < 2) return null;
  const sum = nums.reduce((a, b) => a + b, 0);
  const avg = sum / nums.length;
  return [
    `Promedio = suma ÷ cantidad.`,
    `Suma: ${nums.map(formatEsNumber).join(" + ")} = ${formatEsNumber(sum)}.`,
    `Hay ${nums.length} notas → ${formatEsNumber(sum)} ÷ ${nums.length} = ${formatEsNumber(avg)}.`,
    `Respuesta: ${formatEsNumber(avg)}.`,
  ];
}

function explainInterest(enunciado: string): string[] | null {
  if (!/inter[eé]s\s+simple/i.test(enunciado)) return null;
  const m = enunciado.match(
    /\$\s*([\d.]+)\s+al\s+(\d+(?:[.,]\d+)?)\s*%\s*anual\s+por\s+(\d+)\s*a[nñ]os/i
  );
  if (!m) return null;
  const capital = Number(m[1].replace(/\./g, ""));
  const rate = parseEsNumber(m[2])!;
  const years = Number(m[3]);
  const interest = (capital * rate * years) / 100;
  return [
    `Interés SIMPLE: el % se calcula siempre sobre el capital inicial (no se reinvierte).`,
    `I = capital × % × años ÷ 100.`,
    `${formatEsNumber(rate)}% de ${money(capital)} (1 año) = ${money(pctOf(capital, rate))}.`,
    `Por ${years} años: ${money(pctOf(capital, rate))} × ${years} = ${money(interest)}.`,
    `Respuesta: $${money(interest)} (solo el interés).`,
  ];
}

function explainCompoundInterest(enunciado: string): string[] | null {
  if (!/inter[eé]s\s+compuesto/i.test(enunciado)) return null;
  const m = enunciado.match(
    /\$\s*([\d.]+)\s+al\s+(\d+(?:[.,]\d+)?)\s*%\s*anual\s+por\s+(\d+)\s*a[nñ]os/i
  );
  if (!m) return null;
  const capital = Number(m[1].replace(/\./g, ""));
  const rate = parseEsNumber(m[2])!;
  const years = Number(m[3]);
  const factor = 1 + rate / 100;
  let monto = capital;
  const pasos: string[] = [
    `Interés COMPUESTO: cada año el % se calcula sobre el capital + intereses ya ganados (se reinvierten).`,
    `No uses la fórmula del simple (capital × % × años): aquí el monto crece año a año.`,
  ];
  for (let y = 1; y <= years; y++) {
    const prev = monto;
    monto = Math.round(prev * factor * 100) / 100;
    // For COP integers, keep integer if clean
    if (Number.isInteger(prev * factor)) monto = prev * factor;
    else monto = Math.round(prev * factor);
    pasos.push(
      `Año ${y}: ${money(prev)} × (1 + ${formatEsNumber(rate)}/100) = ${money(prev)} × ${formatEsNumber(factor)} = ${money(monto)}.`
    );
  }
  const interest = monto - capital;
  const simple = (capital * rate * years) / 100;
  pasos.push(`Interés = monto final − capital = ${money(monto)} − ${money(capital)} = ${money(interest)}.`);
  pasos.push(
    `Contraste: si fuera SIMPLE sería $${money(simple)}; el compuesto da $${money(interest)} (más, porque se reinvierten).`
  );
  pasos.push(`Respuesta: $${money(interest)} (solo el interés).`);
  return pasos;
}

function explainRaise(enunciado: string): string[] | null {
  const m = enunciado.match(
    /sueldo\s+de\s*\$?\s*([\d.]+)\s+sube\s+(\d+(?:[.,]\d+)?)\s*%/i
  );
  if (!m) return null;
  const base = Number(m[1].replace(/\./g, ""));
  const pct = parseEsNumber(m[2])!;
  const up = pctOf(base, pct);
  return [
    `Aumento %: calculas el % y lo sumas al sueldo.`,
    `${formatEsNumber(pct)}% de ${money(base)} = ${money(up)}.`,
    `Nuevo = ${money(base)} + ${money(up)} = ${money(base + up)}.`,
    `Respuesta: $${money(base + up)}.`,
  ];
}

function explainPerimeter(enunciado: string): string[] | null {
  const m = enunciado.match(
    /[Rr]ect[aá]ngulo\s+(\d+)\s*m?\s*[×x]\s*(\d+).*[Pp]er[ií]metro/i
  );
  if (!m) return null;
  const a = Number(m[1]);
  const b = Number(m[2]);
  const p = 2 * (a + b);
  return [
    `Perímetro del rectángulo = 2 × (largo + ancho).`,
    `Largo + ancho = ${a} + ${b} = ${a + b}.`,
    `×2 → ${p} m.`,
    `Respuesta: ${p}.`,
  ];
}

function explainAreaSquare(enunciado: string): string[] | null {
  const m = enunciado.match(/[Cc]uadrado\s+de\s+lado\s+(\d+).*[ÁA]rea/i);
  if (!m) return null;
  const side = Number(m[1]);
  return [
    `Área del cuadrado = lado × lado.`,
    `${side} × ${side} = ${side * side}.`,
    `Respuesta: ${side * side}.`,
  ];
}

function explainSum1toN(enunciado: string): string[] | null {
  const m = enunciado.match(/[Ss]uma\s+(?:de\s+)?1\s*(?:a|hasta)\s+(\d+)/i);
  if (!m) return null;
  const n = Number(m[1]);
  const s = (n * (n + 1)) / 2;
  return [
    `Atajo: suma 1…n = n × (n+1) ÷ 2.`,
    `${n} × ${n + 1} = ${n * (n + 1)}.`,
    `${n * (n + 1)} ÷ 2 = ${s}.`,
    `Respuesta: ${s}.`,
  ];
}

function explainMeeting(enunciado: string): string[] | null {
  const m = enunciado.match(
    /trenes?\s+a\s+(\d+)\s*y\s+(\d+)\s*km\/h.*?(\d+)\s*km.*?encuentran/i
  );
  if (!m) return null;
  const v1 = Number(m[1]);
  const v2 = Number(m[2]);
  const dist = Number(m[3]);
  const t = dist / (v1 + v2);
  return [
    `Se acercan: sumas velocidades (regla de encuentro).`,
    `Velocidad relativa = ${v1} + ${v2} = ${v1 + v2} km/h.`,
    `Tiempo = distancia ÷ relativa = ${dist} ÷ ${v1 + v2} = ${formatEsNumber(t)} h.`,
    `Respuesta: ${formatEsNumber(t)}.`,
  ];
}

function explainFillEmpty(enunciado: string): string[] | null {
  const m = enunciado.match(
    /A\s+llena\s+en\s+(\d+)\s*h\s+y\s+B\s+vac[ií]a\s+en\s+(\d+)\s*h/i
  );
  if (!m) return null;
  const a = Number(m[1]);
  const b = Number(m[2]);
  // net rate 1/a - 1/b = (b-a)/(ab); time = ab/(b-a)
  const hours = round2((a * b) / (b - a));
  return [
    `Uno llena y otro vacía: restas ritmos.`,
    `Atajo: tiempo = (A × B) ÷ (B − A) si B > A (vacía más lento que llena).`,
    `${a} × ${b} = ${a * b}; ${b} − ${a} = ${b - a}.`,
    `${a * b} ÷ ${b - a} = ${formatEsNumber(hours)} h.`,
    `Respuesta: ${formatEsNumber(hours)}.`,
  ];
}

function explainPages(enunciado: string): string[] | null {
  const m = enunciado.match(
    /(\d+)\s*p[aá]g(?:inas)?\/h.*?(\d+(?:[.,]\d+)?)\s*h/i
  );
  if (!m) return null;
  const rate = Number(m[1]);
  const hours = parseEsNumber(m[2])!;
  const pages = rate * hours;
  return [
    `Regla de 3 directa: más horas → más páginas.`,
    `${rate} pág/h × ${formatEsNumber(hours)} h = ${formatEsNumber(pages)}.`,
    `Respuesta: ${formatEsNumber(pages)}.`,
  ];
}

function explainExchange(enunciado: string): string[] | null {
  const m = enunciado.match(
    /1\s*USD\s*=\s*([\d.]+)\s*COP.*?([\d.]+)\s*COP/i
  );
  if (!m) return null;
  const rate = Number(m[1].replace(/\./g, ""));
  const cop = Number(m[2].replace(/\./g, ""));
  const usd = cop / rate;
  return [
    `Regla de 3 directa: más COP → más USD.`,
    `1 USD = $${money(rate)} COP; ¿cuántos USD con $${money(cop)}?`,
    `?= ${money(cop)} ÷ ${money(rate)} = ${formatEsNumber(usd)}.`,
    `Respuesta: ${formatEsNumber(usd)}.`,
  ];
}

function explainRemainder(enunciado: string): string[] | null {
  const m = enunciado.match(/dividir\s+(\d+)\s+por\s+(\d+).*resto/i);
  if (!m) return null;
  const a = Number(m[1]);
  const b = Number(m[2]);
  const q = Math.floor(a / b);
  const r = a % b;
  return [
    `División con resto: ${a} = ${b} × cociente + resto.`,
    `${b} cabe ${q} veces: ${b} × ${q} = ${b * q}.`,
    `Resto = ${a} − ${b * q} = ${r}.`,
    `Respuesta: ${r}.`,
  ];
}

function explainProfit(enunciado: string): string[] | null {
  const m = enunciado.match(
    /[Cc]ompra\s+a\s*\$?\s*([\d.]+).*vende\s+a\s*\$?\s*([\d.]+).*%/i
  );
  if (!m) return null;
  const buy = Number(m[1].replace(/\./g, ""));
  const sell = Number(m[2].replace(/\./g, ""));
  const gain = sell - buy;
  const pct = (gain / buy) * 100;
  return [
    `% de ganancia = (ganancia ÷ costo) × 100.`,
    `Ganancia = ${money(sell)} − ${money(buy)} = ${money(gain)}.`,
    `(${money(gain)} ÷ ${money(buy)}) × 100 = ${formatEsNumber(pct)}%.`,
    `Respuesta: ${formatEsNumber(pct)}.`,
  ];
}

function explainMinutes(enunciado: string): string[] | null {
  const m = enunciado.match(/(\d+)\s*h(?:oras?)?\s+(\d+)\s*min.*?minutos/i);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  const total = h * 60 + min;
  return [
    `1 hora = 60 minutos.`,
    `${h} h → ${h} × 60 = ${h * 60} min.`,
    `Suma los ${min} min: ${h * 60} + ${min} = ${total}.`,
    `Respuesta: ${total}.`,
  ];
}

function explainMapScale(enunciado: string): string[] | null {
  const m = enunciado.match(
    /1\s*cm\s*=\s*(\d+)\s*km.*?(\d+)\s*cm/i
  );
  if (!m) return null;
  const per = Number(m[1]);
  const cm = Number(m[2]);
  return [
    `Regla de 3 directa: más cm en el mapa → más km reales.`,
    `1 cm → ${per} km; ${cm} cm → ¿?`,
    `?= ${cm} × ${per} = ${cm * per} km.`,
    `Respuesta: ${cm * per}.`,
  ];
}

function explainSplit(enunciado: string): string[] | null {
  const m = enunciado.match(
    /(\d+)\s+personas.*?\$?\s*([\d.]+).*[Cc]ada/i
  );
  if (!m) return null;
  const people = Number(m[1]);
  const total = Number(m[2].replace(/\./g, ""));
  const each = total / people;
  return [
    `Reparto igual: divides el total entre las personas.`,
    `${money(total)} ÷ ${people} = ${money(each)}.`,
    `Respuesta: $${money(each)}.`,
  ];
}

function explainSpeedKmh(enunciado: string): string[] | null {
  const m = enunciado.match(/(\d+)\s*km\s+en\s+(\d+)\s*h.*?km\/h/i);
  if (!m) return null;
  const dist = Number(m[1]);
  const h = Number(m[2]);
  return [
    `Velocidad = distancia ÷ tiempo.`,
    `${dist} ÷ ${h} = ${dist / h} km/h.`,
    `Respuesta: ${dist / h}.`,
  ];
}

function explainFractionOf(enunciado: string): string[] | null {
  const m = enunciado.match(/(\d+)\s*\/\s*(\d+)\s+de\s+(\d+)/i);
  if (!m) return null;
  const num = Number(m[1]);
  const den = Number(m[2]);
  const base = Number(m[3]);
  const part = base / den;
  const res = part * num;
  return [
    `Atajo: primero divide entre el denominador, luego multiplica el numerador.`,
    `${base} ÷ ${den} = ${part} (una parte).`,
    `${part} × ${num} = ${res}.`,
    `Respuesta: ${res}.`,
  ];
}

function explainPythagoras(enunciado: string): string[] | null {
  const m = enunciado.match(
    /[Tt]ri[aá]ngulo.*?(\d+).*?(\d+).*hipotenusa/i
  );
  if (!m) return null;
  const a = Number(m[1]);
  const b = Number(m[2]);
  const c2 = a * a + b * b;
  const c = Math.sqrt(c2);
  return [
    `Pitágoras: hipotenusa² = cateto² + cateto².`,
    `${a}² = ${a * a}; ${b}² = ${b * b}; suma = ${c2}.`,
    `√${c2} = ${formatEsNumber(c)}.`,
    `Respuesta: ${formatEsNumber(c)}.`,
  ];
}

function explainDrain(enunciado: string): string[] | null {
  const m = enunciado.match(
    /[Tt]anque\s+(\d+)\s*L.*?(\d+)\s*L\/min.*?vaciar/i
  );
  if (!m) return null;
  const cap = Number(m[1]);
  const rate = Number(m[2]);
  return [
    `Tiempo = capacidad ÷ caudal.`,
    `${cap} ÷ ${rate} = ${cap / rate} min.`,
    `Respuesta: ${cap / rate}.`,
  ];
}

function explainAgeDouble(enunciado: string): string[] | null {
  const m = enunciado.match(
    /tiene\s+(\d+)\s+y.*?(\d+)\.\s*¿En\s+cu[aá]ntos\s+a[nñ]os.*?doble/i
  );
  if (!m) return null;
  const young = Number(m[1]);
  const old = Number(m[2]);
  // old + x = 2 (young + x) => old + x = 2young + 2x => old - 2young = x
  const x = old - 2 * young;
  if (x <= 0) return null;
  return [
    `En x años: madre = ${old}+x y hija = ${young}+x; madre = 2 × hija.`,
    `${old} + x = 2 × (${young} + x).`,
    `${old} + x = ${2 * young} + 2x → ${old} − ${2 * young} = x → x = ${x}.`,
    `Respuesta: ${x}.`,
  ];
}

function explainClock(enunciado: string): string[] | null {
  const m = enunciado.match(/manecillas.*?las\s+(\d+)/i);
  if (!m) return null;
  const h = Number(m[1]) % 12;
  // at H:00 angle = |30H - 0| = 30H, min(that, 360-that)
  const raw = 30 * h;
  const ang = Math.min(raw, 360 - raw);
  return [
    `A las H en punto: cada hora son 30° (360÷12).`,
    `Ángulo = 30 × ${h} = ${raw}°.`,
    `El menor entre manecillas es min(${raw}, ${360 - raw}) = ${ang}°.`,
    `Respuesta: ${ang}.`,
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
    explainUnitPrice(enunciado) ||
    explainAverage(enunciado) ||
    explainCompoundInterest(enunciado) ||
    explainInterest(enunciado) ||
    explainRaise(enunciado) ||
    explainPerimeter(enunciado) ||
    explainAreaSquare(enunciado) ||
    explainSum1toN(enunciado) ||
    explainMeeting(enunciado) ||
    explainFillEmpty(enunciado) ||
    explainPages(enunciado) ||
    explainExchange(enunciado) ||
    explainRemainder(enunciado) ||
    explainProfit(enunciado) ||
    explainMinutes(enunciado) ||
    explainMapScale(enunciado) ||
    explainSplit(enunciado) ||
    explainSpeedKmh(enunciado) ||
    explainFractionOf(enunciado) ||
    explainPythagoras(enunciado) ||
    explainDrain(enunciado) ||
    explainAgeDouble(enunciado) ||
    explainClock(enunciado)
  );
}
