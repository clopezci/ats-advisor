/**
 * Explicaciones de cálculo mental con atajos (no «multiplica y ya»).
 * Usado al regenerar bancoTipos y en runtime para ítems a×b / a÷b simples.
 */

export function parseEsNumber(raw: string): number | null {
  const t = String(raw || "")
    .trim()
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  if (!t || !/^-?\d+(\.\d+)?$/.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function formatEsNumber(n: number): string {
  if (!Number.isFinite(n)) return String(n);
  if (Number.isInteger(n)) return String(n);
  // Hasta 4 decimales útiles; coma española
  const s = String(Math.round(n * 10000) / 10000);
  return s.replace(".", ",");
}

function nearlyEq(a: number, b: number, eps = 1e-9) {
  return Math.abs(a - b) < eps;
}

function fmtMul(a: number, b: number) {
  return `${formatEsNumber(a)} × ${formatEsNumber(b)}`;
}

/** Intenta parsear enunciado tipo «15 × 14 = ?» o «125 × 0,4 = ?». */
export function parseSimpleBinaryOp(enunciado: string): {
  a: number;
  b: number;
  op: "×" | "÷";
} | null {
  const line = String(enunciado || "").split(/\n/)[0] || "";
  const m = line.match(
    /^\s*(-?\d+(?:[.,]\d+)?)\s*([×xX*÷\/])\s*(-?\d+(?:[.,]\d+)?)\s*=/
  );
  if (!m) return null;
  const a = parseEsNumber(m[1]);
  const b = parseEsNumber(m[3]);
  if (a == null || b == null) return null;
  const op = m[2] === "÷" || m[2] === "/" ? "÷" : "×";
  return { a, b, op };
}

type Technique = { title: string; pasos: string[] };

function techniqueMultiply(a: number, b: number): Technique {
  // Priorizar el factor con atajo más claro (9, 11, 15, decimales…)
  const scoreSpecial = (y: number) => {
    if ([10, 100, 1000, 5, 25, 9, 11, 15, 4, 8, 3].includes(y)) return 3;
    if ([0.5, 0.25, 0.75, 0.2, 0.4, 0.35, 1.5].some((d) => nearlyEq(y, d))) return 4;
    if (y === 6) return 1;
    return 0;
  };
  const pairings: [number, number][] =
    scoreSpecial(b) >= scoreSpecial(a)
      ? [
          [a, b],
          [b, a],
        ]
      : [
          [b, a],
          [a, b],
        ];

  for (const [x, y] of pairings) {
    // ×10 / ×100 / ×1000
    if (y === 10 || y === 100 || y === 1000) {
      const zeros = String(y).length - 1;
      return {
        title: `×${y}: agrega ${zeros} cero${zeros > 1 ? "s" : ""}`,
        pasos: [
          `Atajo ×${formatEsNumber(y)}: escribe ${formatEsNumber(x)} y agrega ${zeros} cero${zeros > 1 ? "s" : ""} a la derecha.`,
          `${fmtMul(x, y)} = ${formatEsNumber(x * y)}.`,
          `Respuesta: ${formatEsNumber(x * y)}.`,
        ],
      };
    }

    // ×5 = ×10 ÷ 2
    if (y === 5) {
      const ten = x * 10;
      return {
        title: "×5 = ×10 y parte a la mitad",
        pasos: [
          `Atajo ×5: primero ${formatEsNumber(x)} × 10 = ${formatEsNumber(ten)}.`,
          `Luego divide entre 2: ${formatEsNumber(ten)} ÷ 2 = ${formatEsNumber(ten / 2)}.`,
          `Respuesta: ${formatEsNumber(x * 5)}.`,
        ],
      };
    }

    // ×25 = ×100 ÷ 4
    if (y === 25) {
      const hundred = x * 100;
      return {
        title: "×25 = ×100 y divide entre 4",
        pasos: [
          `Atajo ×25: ${formatEsNumber(x)} × 100 = ${formatEsNumber(hundred)}.`,
          `Divide entre 4: ${formatEsNumber(hundred)} ÷ 4 = ${formatEsNumber(hundred / 4)}.`,
          `Respuesta: ${formatEsNumber(x * 25)}.`,
        ],
      };
    }

    // ×9 = ×10 − x
    if (y === 9) {
      const ten = x * 10;
      return {
        title: "×9 = ×10 menos el mismo número",
        pasos: [
          `Atajo ×9: ${formatEsNumber(x)} × 10 = ${formatEsNumber(ten)}.`,
          `Resta una vez ${formatEsNumber(x)}: ${formatEsNumber(ten)} − ${formatEsNumber(x)} = ${formatEsNumber(ten - x)}.`,
          `Respuesta: ${formatEsNumber(x * 9)}.`,
        ],
      };
    }

    // ×11 (2 cifras)
    if (y === 11 && Number.isInteger(x) && x >= 10 && x <= 99) {
      const tens = Math.floor(x / 10);
      const ones = x % 10;
      const sum = tens + ones;
      if (sum < 10) {
        return {
          title: "×11: suma de cifras al medio",
          pasos: [
            `Atajo ×11 (2 cifras): escribe ${tens} _ ${ones} y en el medio la suma ${tens}+${ones}=${sum}.`,
            `Queda ${tens}${sum}${ones}.`,
            `Respuesta: ${formatEsNumber(x * 11)}.`,
          ],
        };
      }
      return {
        title: "×11: suma de cifras con llevada",
        pasos: [
          `Atajo ×11: ${tens}+${ones}=${sum} (≥10). Llevas 1 a las decenas.`,
          `Queda ${tens + 1}${sum - 10}${ones}.`,
          `Respuesta: ${formatEsNumber(x * 11)}.`,
        ],
      };
    }

    // ×15 = (x + x/2) × 10  cuando x par; o ×10 + ×5
    if (y === 15) {
      if (x % 2 === 0) {
        const half = x / 2;
        const mid = x + half;
        return {
          title: "×15: suma la mitad y agrega un cero",
          pasos: [
            `Atajo ×15: la mitad de ${formatEsNumber(x)} es ${formatEsNumber(half)}.`,
            `Suma: ${formatEsNumber(x)} + ${formatEsNumber(half)} = ${formatEsNumber(mid)}. Agrega un cero → ${formatEsNumber(mid * 10)}.`,
            `Respuesta: ${formatEsNumber(x * 15)}.`,
          ],
        };
      }
      const t10 = x * 10;
      const t5 = x * 5;
      return {
        title: "×15 = ×10 + ×5",
        pasos: [
          `${formatEsNumber(x)} × 10 = ${formatEsNumber(t10)}.`,
          `${formatEsNumber(x)} × 5 = ${formatEsNumber(t5)} (×10 y parte a la mitad).`,
          `Suma: ${formatEsNumber(t10)} + ${formatEsNumber(t5)} = ${formatEsNumber(t10 + t5)}. Respuesta: ${formatEsNumber(x * 15)}.`,
        ],
      };
    }

    // ×0,5 = ÷2
    if (nearlyEq(y, 0.5)) {
      return {
        title: "×0,5 = partir a la mitad",
        pasos: [
          `Atajo ×0,5: es la mitad. ${formatEsNumber(x)} ÷ 2 = ${formatEsNumber(x / 2)}.`,
          `Comprueba: ${fmtMul(x, 0.5)} = ${formatEsNumber(x * 0.5)}.`,
          `Respuesta: ${formatEsNumber(x * 0.5)}.`,
        ],
      };
    }

    // ×0,25 = ÷4
    if (nearlyEq(y, 0.25)) {
      return {
        title: "×0,25 = dividir entre 4",
        pasos: [
          `Atajo ×0,25: 0,25 = 1/4 → divide entre 4.`,
          `${formatEsNumber(x)} ÷ 4 = ${formatEsNumber(x / 4)}.`,
          `Respuesta: ${formatEsNumber(x * 0.25)}.`,
        ],
      };
    }

    // ×0,75 = 3/4
    if (nearlyEq(y, 0.75)) {
      const q = x / 4;
      return {
        title: "×0,75 = tres cuartos",
        pasos: [
          `Atajo ×0,75: 0,75 = 3/4. Primero ${formatEsNumber(x)} ÷ 4 = ${formatEsNumber(q)}.`,
          `Luego ×3: ${formatEsNumber(q)} × 3 = ${formatEsNumber(q * 3)}.`,
          `Respuesta: ${formatEsNumber(x * 0.75)}.`,
        ],
      };
    }

    // ×0,2 = ÷5
    if (nearlyEq(y, 0.2)) {
      return {
        title: "×0,2 = dividir entre 5",
        pasos: [
          `Atajo ×0,2: 0,2 = 1/5 → divide entre 5.`,
          `${formatEsNumber(x)} ÷ 5 = ${formatEsNumber(x / 5)}.`,
          `Respuesta: ${formatEsNumber(x * 0.2)}.`,
        ],
      };
    }

    // ×0,4 = 2/5 = ÷5 ×2  (o ×4 y corre la coma)
    if (nearlyEq(y, 0.4)) {
      const fifth = x / 5;
      return {
        title: "×0,4 = dos quintos",
        pasos: [
          `Atajo ×0,4: 0,4 = 2/5. Primero ${formatEsNumber(x)} ÷ 5 = ${formatEsNumber(fifth)}.`,
          `Luego ×2: ${formatEsNumber(fifth)} × 2 = ${formatEsNumber(fifth * 2)}.`,
          `(Otra vía: ${formatEsNumber(x)} × 4 = ${formatEsNumber(x * 4)}, y corre la coma un lugar → ${formatEsNumber(x * 0.4)}.)`,
          `Respuesta: ${formatEsNumber(x * 0.4)}.`,
        ],
      };
    }

    // ×0,35 = ×0,3 + ×0,05
    if (nearlyEq(y, 0.35)) {
      const p3 = x * 0.3;
      const p05 = x * 0.05;
      return {
        title: "×0,35 = ×0,3 + ×0,05",
        pasos: [
          `Parte 0,35 = 0,3 + 0,05.`,
          `${formatEsNumber(x)} × 0,3 = ${formatEsNumber(x)} × 3 ÷ 10 = ${formatEsNumber(p3)}.`,
          `${formatEsNumber(x)} × 0,05 = ${formatEsNumber(x)} ÷ 20 = ${formatEsNumber(p05)}.`,
          `Suma: ${formatEsNumber(p3)} + ${formatEsNumber(p05)} = ${formatEsNumber(p3 + p05)}. Respuesta: ${formatEsNumber(x * 0.35)}.`,
        ],
      };
    }

    // ×1,5 = n + n/2
    if (nearlyEq(y, 1.5)) {
      const half = x / 2;
      return {
        title: "×1,5 = el número más su mitad",
        pasos: [
          `Atajo ×1,5: mitad de ${formatEsNumber(x)} = ${formatEsNumber(half)}.`,
          `Suma: ${formatEsNumber(x)} + ${formatEsNumber(half)} = ${formatEsNumber(x + half)}.`,
          `Respuesta: ${formatEsNumber(x * 1.5)}.`,
        ],
      };
    }

    // ×4 = doblar dos veces
    if (y === 4) {
      const d1 = x * 2;
      return {
        title: "×4 = doblar dos veces",
        pasos: [
          `Atajo ×4: dobla ${formatEsNumber(x)} → ${formatEsNumber(d1)}.`,
          `Dobla otra vez: ${formatEsNumber(d1)} → ${formatEsNumber(d1 * 2)}.`,
          `Respuesta: ${formatEsNumber(x * 4)}.`,
        ],
      };
    }

    // ×8 = doblar tres veces
    if (y === 8 && Number.isInteger(x) && x <= 50) {
      const d1 = x * 2;
      const d2 = d1 * 2;
      return {
        title: "×8 = doblar tres veces",
        pasos: [
          `Dobla: ${formatEsNumber(x)} → ${formatEsNumber(d1)} → ${formatEsNumber(d2)} → ${formatEsNumber(d2 * 2)}.`,
          `${fmtMul(x, 8)} = ${formatEsNumber(x * 8)}.`,
          `Respuesta: ${formatEsNumber(x * 8)}.`,
        ],
      };
    }

    // ×3 = doble + original
    if (y === 3) {
      const d = x * 2;
      return {
        title: "×3 = el doble más el mismo",
        pasos: [
          `Dobla ${formatEsNumber(x)} → ${formatEsNumber(d)}.`,
          `Suma otra vez ${formatEsNumber(x)}: ${formatEsNumber(d)} + ${formatEsNumber(x)} = ${formatEsNumber(d + x)}.`,
          `Respuesta: ${formatEsNumber(x * 3)}.`,
        ],
      };
    }

    // ×6 = ×5 + ×1  o doble de ×3
    if (y === 6) {
      const t5 = x * 5;
      return {
        title: "×6 = ×5 + el mismo número",
        pasos: [
          `${formatEsNumber(x)} × 5 = ${formatEsNumber(t5)} (×10 y parte a la mitad).`,
          `Suma ${formatEsNumber(x)}: ${formatEsNumber(t5)} + ${formatEsNumber(x)} = ${formatEsNumber(t5 + x)}.`,
          `Respuesta: ${formatEsNumber(x * 6)}.`,
        ],
      };
    }
  }

  // Número terminado en 5 × número par → doblar/partir (ej. 15×14 = 30×7)
  if (Number.isInteger(a) && Number.isInteger(b)) {
    const end5 = a % 10 === 5 ? a : b % 10 === 5 ? b : null;
    const other = end5 === a ? b : end5 === b ? a : null;
    if (end5 != null && other != null && other % 2 === 0) {
      const doubled = end5 * 2;
      const halved = other / 2;
      return {
        title: "Terminado en 5 × par: dobla y parte",
        pasos: [
          `Atajo: ${formatEsNumber(end5)} termina en 5 y ${formatEsNumber(other)} es par → dobla el de 5 y parte el otro.`,
          `${formatEsNumber(end5)} × 2 = ${formatEsNumber(doubled)}; ${formatEsNumber(other)} ÷ 2 = ${formatEsNumber(halved)}.`,
          `Ahora ${fmtMul(doubled, halved)} = ${formatEsNumber(doubled * halved)} (más fácil). Respuesta: ${formatEsNumber(a * b)}.`,
        ],
      };
    }
  }

  // Distributiva dos cifras: a × (10+k) o (10+k) × b
  for (const [x, y] of pairings) {
    if (Number.isInteger(y) && y > 10 && y < 20) {
      const k = y - 10;
      const t10 = x * 10;
      const tk = x * k;
      return {
        title: `×${y} = ×10 + ×${k}`,
        pasos: [
          `Descompón ${formatEsNumber(y)} = 10 + ${k}.`,
          `${formatEsNumber(x)} × 10 = ${formatEsNumber(t10)}; ${formatEsNumber(x)} × ${k} = ${formatEsNumber(tk)}.`,
          `Suma: ${formatEsNumber(t10)} + ${formatEsNumber(tk)} = ${formatEsNumber(t10 + tk)}. Respuesta: ${formatEsNumber(x * y)}.`,
        ],
      };
    }
    if (Number.isInteger(y) && y > 20 && y < 100 && y % 10 !== 0) {
      const tens = Math.floor(y / 10) * 10;
      const ones = y % 10;
      const tT = x * tens;
      const tO = x * ones;
      return {
        title: `×${y} = ×${tens} + ×${ones}`,
        pasos: [
          `Descompón ${formatEsNumber(y)} = ${tens} + ${ones}.`,
          `${formatEsNumber(x)} × ${tens} = ${formatEsNumber(tT)}; ${formatEsNumber(x)} × ${ones} = ${formatEsNumber(tO)}.`,
          `Suma: ${formatEsNumber(tT)} + ${formatEsNumber(tO)} = ${formatEsNumber(tT + tO)}. Respuesta: ${formatEsNumber(x * y)}.`,
        ],
      };
    }
  }

  // Tabla pequeña: vecinos del cuadrado (7×8 = 8×8 − 8)
  if (
    Number.isInteger(a) &&
    Number.isInteger(b) &&
    a >= 2 &&
    a <= 12 &&
    b >= 2 &&
    b <= 12 &&
    a !== b
  ) {
    const hi = Math.max(a, b);
    const lo = Math.min(a, b);
    if (hi - lo === 1) {
      return {
        title: "Vecinos: cuadrado menos el mayor",
        pasos: [
          `${formatEsNumber(lo)} y ${formatEsNumber(hi)} son consecutivos → ${fmtMul(lo, hi)} = ${formatEsNumber(hi)}² − ${formatEsNumber(hi)}.`,
          `${formatEsNumber(hi)}² = ${formatEsNumber(hi * hi)}; resta ${formatEsNumber(hi)} → ${formatEsNumber(hi * hi - hi)}.`,
          `Respuesta: ${formatEsNumber(a * b)}.`,
        ],
      };
    }
  }

  // Fallback: producto por descomposición decimal si hay coma
  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    const decPlaces = (n: number) => {
      const s = String(n);
      const i = s.indexOf(".");
      return i < 0 ? 0 : s.length - i - 1;
    };
    const places = decPlaces(a) + decPlaces(b);
    const ai = Math.round(a * 10 ** decPlaces(a));
    const bi = Math.round(b * 10 ** decPlaces(b));
    const prod = ai * bi;
    const result = a * b;
    return {
      title: "Decimales: multiplica enteros y coloca la coma",
      pasos: [
        `Quita las comas: piensa ${ai} × ${bi} = ${prod}.`,
        `Había ${places} cifra${places === 1 ? "" : "s"} decimal${places === 1 ? "" : "es"} en total → corre la coma ${places} lugar${places === 1 ? "" : "es"} a la izquierda.`,
        `Respuesta: ${formatEsNumber(result)}.`,
      ],
    };
  }

  // Fallback entero
  return {
    title: "Producto",
    pasos: [
      `Calcula ${fmtMul(a, b)}.`,
      `${fmtMul(a, b)} = ${formatEsNumber(a * b)}.`,
      `Respuesta: ${formatEsNumber(a * b)}.`,
    ],
  };
}

function techniqueDivide(a: number, b: number): Technique {
  if (b === 0) {
    return { title: "División", pasos: ["No se puede dividir entre 0."] };
  }
  // ÷5 = ×2 ÷10
  if (b === 5) {
    const d = a * 2;
    return {
      title: "÷5 = ×2 y corre la coma",
      pasos: [
        `Atajo ÷5: duplica ${formatEsNumber(a)} → ${formatEsNumber(d)}.`,
        `Corre la coma un lugar (÷10): ${formatEsNumber(d / 10)}.`,
        `Respuesta: ${formatEsNumber(a / 5)}.`,
      ],
    };
  }
  if (b === 4) {
    const h = a / 2;
    return {
      title: "÷4 = partir a la mitad dos veces",
      pasos: [
        `Mitad de ${formatEsNumber(a)} = ${formatEsNumber(h)}.`,
        `Mitad otra vez: ${formatEsNumber(h / 2)}.`,
        `Respuesta: ${formatEsNumber(a / 4)}.`,
      ],
    };
  }
  if (b === 2) {
    return {
      title: "÷2 = la mitad",
      pasos: [
        `Parte ${formatEsNumber(a)} a la mitad.`,
        `${formatEsNumber(a)} ÷ 2 = ${formatEsNumber(a / 2)}.`,
        `Respuesta: ${formatEsNumber(a / 2)}.`,
      ],
    };
  }
  if (nearlyEq(b, 0.5)) {
    return {
      title: "÷0,5 = ×2",
      pasos: [
        `Dividir entre 0,5 es lo mismo que multiplicar por 2.`,
        `${formatEsNumber(a)} × 2 = ${formatEsNumber(a * 2)}.`,
        `Respuesta: ${formatEsNumber(a / 0.5)}.`,
      ],
    };
  }
  if (Number.isInteger(a) && Number.isInteger(b) && a % b === 0) {
    return {
      title: "División exacta",
      pasos: [
        `¿Cuántas veces cabe ${formatEsNumber(b)} en ${formatEsNumber(a)}?`,
        `Comprueba: ${formatEsNumber(b)} × ${formatEsNumber(a / b)} = ${formatEsNumber(a)}.`,
        `Respuesta: ${formatEsNumber(a / b)}.`,
      ],
    };
  }
  return {
    title: "División",
    pasos: [
      `Calcula ${formatEsNumber(a)} ÷ ${formatEsNumber(b)}.`,
      `Resultado: ${formatEsNumber(a / b)}.`,
      `Respuesta: ${formatEsNumber(a / b)}.`,
    ],
  };
}

/** Pasos de explicación; null si el enunciado no es a×b / a÷b simple. */
export function explainSimpleBinary(enunciado: string): string[] | null {
  const parsed = parseSimpleBinaryOp(enunciado);
  if (!parsed) return null;
  const { a, b, op } = parsed;
  if (op === "×") return techniqueMultiply(a, b).pasos;
  return techniqueDivide(a, b).pasos;
}

/** True si los pasos actuales son genéricos («Multiplica X por Y»). */
export function isWeakMulExplain(pasos: string[] | undefined): boolean {
  const p0 = (pasos?.[0] || "").trim();
  return /^Multiplica\s+.+\s+por\s+/i.test(p0) || /^Divide\s+/i.test(p0);
}
