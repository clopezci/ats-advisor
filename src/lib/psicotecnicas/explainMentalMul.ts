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
  const sign = n < 0 ? "−" : "";
  const a = Math.abs(n);
  if (Number.isInteger(a)) return sign + String(a);
  if (Math.abs(a - 0.5) < 1e-8) return sign + "1/2";
  const s = String(Math.round(a * 10000) / 10000);
  return sign + s.replace(".", ",");
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

/** Parsea «5% de 120 = ?» / «12,5% de 80». */
export function parsePercentOf(enunciado: string): { pct: number; base: number } | null {
  const line = String(enunciado || "").split(/\n/)[0] || "";
  const m = line.match(/^\s*(-?\d+(?:[.,]\d+)?)\s*%\s*de\s*(-?\d+(?:[.,]\d+)?)/i);
  if (!m) return null;
  const pct = parseEsNumber(m[1]);
  const base = parseEsNumber(m[2]);
  if (pct == null || base == null) return null;
  return { pct, base };
}

function pctOf(base: number, pct: number) {
  return (base * pct) / 100;
}

function tenPct(base: number) {
  return base / 10;
}

function onePct(base: number) {
  return base / 100;
}

function techniquePercent(pct: number, base: number): string[] {
  const result = pctOf(base, pct);
  const ten = tenPct(base);
  const five = ten / 2;
  const one = onePct(base);
  const fin = `Respuesta: ${formatEsNumber(result)}.`;

  // 50%
  if (nearlyEq(pct, 50)) {
    return [
      `El 50% es la mitad de ${formatEsNumber(base)}.`,
      `${formatEsNumber(base)} ÷ 2 = ${formatEsNumber(result)}.`,
      fin,
    ];
  }

  // 10%
  if (nearlyEq(pct, 10)) {
    return [
      `El 10% se saca dividiendo entre 10 (corre la coma un lugar).`,
      `${formatEsNumber(base)} ÷ 10 = ${formatEsNumber(ten)}.`,
      fin,
    ];
  }

  // 5% = mitad del 10%
  if (nearlyEq(pct, 5)) {
    return [
      `Primero el 10% de ${formatEsNumber(base)}: ${formatEsNumber(base)} ÷ 10 = ${formatEsNumber(ten)}.`,
      `El 5% es la mitad de ese 10%: ${formatEsNumber(ten)} ÷ 2 = ${formatEsNumber(five)}.`,
      fin,
    ];
  }

  // 20% = doble del 10%
  if (nearlyEq(pct, 20)) {
    return [
      `Primero el 10%: ${formatEsNumber(base)} ÷ 10 = ${formatEsNumber(ten)}.`,
      `El 20% es el doble: ${formatEsNumber(ten)} × 2 = ${formatEsNumber(ten * 2)}.`,
      fin,
    ];
  }

  // 25% = ÷4
  if (nearlyEq(pct, 25)) {
    return [
      `El 25% es repartir en 4 partes iguales (÷4).`,
      `${formatEsNumber(base)} ÷ 4 = ${formatEsNumber(result)}.`,
      fin,
    ];
  }

  // 75% = 3/4
  if (nearlyEq(pct, 75)) {
    const q = base / 4;
    return [
      `El 75% son tres cuartos: primero ${formatEsNumber(base)} ÷ 4 = ${formatEsNumber(q)}.`,
      `Luego ×3: ${formatEsNumber(q)} × 3 = ${formatEsNumber(q * 3)}.`,
      `(O: 50% = ${formatEsNumber(base / 2)} + 25% = ${formatEsNumber(base / 4)} → ${formatEsNumber(result)}.)`,
      fin,
    ];
  }

  // 15% = 10% + 5%
  if (nearlyEq(pct, 15)) {
    return [
      `10% de ${formatEsNumber(base)} = ${formatEsNumber(ten)}.`,
      `5% = mitad del 10% = ${formatEsNumber(five)}.`,
      `Suma: ${formatEsNumber(ten)} + ${formatEsNumber(five)} = ${formatEsNumber(ten + five)}.`,
      fin,
    ];
  }

  // 30% = 10% × 3
  if (nearlyEq(pct, 30)) {
    return [
      `10% = ${formatEsNumber(ten)}.`,
      `30% = tres veces ese 10%: ${formatEsNumber(ten)} × 3 = ${formatEsNumber(ten * 3)}.`,
      fin,
    ];
  }

  // 40% = 10% × 4
  if (nearlyEq(pct, 40)) {
    return [
      `10% = ${formatEsNumber(ten)}.`,
      `40% = cuatro veces: ${formatEsNumber(ten)} × 4 = ${formatEsNumber(ten * 4)}.`,
      fin,
    ];
  }

  // 60% = 50% + 10%
  if (nearlyEq(pct, 60)) {
    return [
      `50% (la mitad) = ${formatEsNumber(base / 2)}.`,
      `10% = ${formatEsNumber(ten)}.`,
      `Suma: ${formatEsNumber(base / 2)} + ${formatEsNumber(ten)} = ${formatEsNumber(base / 2 + ten)}.`,
      fin,
    ];
  }

  // 12,5% = mitad del 25% = ÷8
  if (nearlyEq(pct, 12.5)) {
    return [
      `12,5% es la mitad del 25% (o dividir entre 8).`,
      `${formatEsNumber(base)} ÷ 8 = ${formatEsNumber(result)}.`,
      `(Comprueba: 25% = ${formatEsNumber(base / 4)}; mitad → ${formatEsNumber(result)}.)`,
      fin,
    ];
  }

  // 2,5% = mitad del 5% = 10% ÷ 4
  if (nearlyEq(pct, 2.5)) {
    return [
      `10% = ${formatEsNumber(ten)}.`,
      `2,5% es la cuarta parte del 10%: ${formatEsNumber(ten)} ÷ 4 = ${formatEsNumber(ten / 4)}.`,
      fin,
    ];
  }

  // 7,5% = 5% + 2,5%
  if (nearlyEq(pct, 7.5)) {
    const twoFive = ten / 4;
    return [
      `10% = ${formatEsNumber(ten)} → 5% = ${formatEsNumber(five)}.`,
      `2,5% = mitad del 5% = ${formatEsNumber(twoFive)}.`,
      `Suma: ${formatEsNumber(five)} + ${formatEsNumber(twoFive)} = ${formatEsNumber(five + twoFive)}.`,
      fin,
    ];
  }

  // 17,5% = 10% + 5% + 2,5%
  if (nearlyEq(pct, 17.5)) {
    const twoFive = ten / 4;
    return [
      `10% = ${formatEsNumber(ten)}; 5% = ${formatEsNumber(five)}; 2,5% = ${formatEsNumber(twoFive)}.`,
      `Suma: ${formatEsNumber(ten)} + ${formatEsNumber(five)} + ${formatEsNumber(twoFive)} = ${formatEsNumber(ten + five + twoFive)}.`,
      fin,
    ];
  }

  // 35% = 25% + 10%
  if (nearlyEq(pct, 35)) {
    const q = base / 4;
    return [
      `25% = ${formatEsNumber(base)} ÷ 4 = ${formatEsNumber(q)}.`,
      `10% = ${formatEsNumber(ten)}.`,
      `Suma: ${formatEsNumber(q)} + ${formatEsNumber(ten)} = ${formatEsNumber(q + ten)}.`,
      fin,
    ];
  }

  // 9% = 10% − 1%
  if (nearlyEq(pct, 9)) {
    return [
      `10% = ${formatEsNumber(ten)}.`,
      `1% = ${formatEsNumber(one)} (corre la coma dos lugares).`,
      `9% = 10% − 1%: ${formatEsNumber(ten)} − ${formatEsNumber(one)} = ${formatEsNumber(ten - one)}.`,
      fin,
    ];
  }

  // 8% = 10% − 2%
  if (nearlyEq(pct, 8)) {
    const two = one * 2;
    return [
      `10% = ${formatEsNumber(ten)}.`,
      `2% = dos veces el 1% = ${formatEsNumber(two)}.`,
      `8% = 10% − 2%: ${formatEsNumber(ten)} − ${formatEsNumber(two)} = ${formatEsNumber(ten - two)}.`,
      fin,
    ];
  }

  // 12% = 10% + 2%
  if (nearlyEq(pct, 12)) {
    const two = one * 2;
    return [
      `10% = ${formatEsNumber(ten)}.`,
      `2% = ${formatEsNumber(two)}.`,
      `Suma: ${formatEsNumber(ten)} + ${formatEsNumber(two)} = ${formatEsNumber(ten + two)}.`,
      fin,
    ];
  }

  // 18% = 20% − 2%
  if (nearlyEq(pct, 18)) {
    const twenty = ten * 2;
    const two = one * 2;
    return [
      `20% = doble del 10% = ${formatEsNumber(twenty)}.`,
      `2% = ${formatEsNumber(two)}.`,
      `18% = 20% − 2%: ${formatEsNumber(twenty)} − ${formatEsNumber(two)} = ${formatEsNumber(twenty - two)}.`,
      fin,
    ];
  }

  // 22% = 20% + 2%
  if (nearlyEq(pct, 22)) {
    const twenty = ten * 2;
    const two = one * 2;
    return [
      `20% = ${formatEsNumber(twenty)}.`,
      `2% = ${formatEsNumber(two)}.`,
      `Suma: ${formatEsNumber(twenty)} + ${formatEsNumber(two)} = ${formatEsNumber(twenty + two)}.`,
      fin,
    ];
  }

  // Genérico: armar desde 10% y 1% (sin pasar por 0,xx)
  if (Number.isInteger(pct) && pct > 0 && pct < 100) {
    const tens = Math.floor(pct / 10);
    const ones = pct % 10;
    const pasos: string[] = [`10% de ${formatEsNumber(base)} = ${formatEsNumber(ten)}.`];
    if (tens > 0) {
      pasos.push(
        `${tens}0% = ${formatEsNumber(ten)} × ${tens} = ${formatEsNumber(ten * tens)}.`
      );
    }
    if (ones > 0) {
      pasos.push(
        `1% = ${formatEsNumber(one)} → ${ones}% = ${formatEsNumber(one * ones)}.`
      );
      if (tens > 0) {
        pasos.push(
          `Suma: ${formatEsNumber(ten * tens)} + ${formatEsNumber(one * ones)} = ${formatEsNumber(result)}.`
        );
      }
    }
    pasos.push(fin);
    return pasos;
  }

  // Decimal % genérico: 10% y fracciones
  return [
    `10% de ${formatEsNumber(base)} = ${formatEsNumber(ten)}.`,
    `Necesitas el ${formatEsNumber(pct)}%: piensa cuántas décimas/partes de ese 10% son.`,
    `Cuenta: (${formatEsNumber(pct)} ÷ 10) × ${formatEsNumber(ten)} = ${formatEsNumber(result)}.`,
    fin,
  ];
}

/** Unifica multiplicación/división y porcentajes para cálculo mental. */
export function explainCalculoMental(enunciado: string): string[] | null {
  const pct = parsePercentOf(enunciado);
  if (pct) return techniquePercent(pct.pct, pct.base);
  const unknown = explainFindUnknown(enunciado);
  if (unknown) return unknown;
  const line = mathLineOf(enunciado);
  return explainSimpleBinary(line || enunciado);
}

function mathLineOf(enunciado: string): string | null {
  const lines = String(enunciado || "")
    .split(/\n/)
    .map((s) => s.trim())
    .filter((s) => s && !/^Elija|^Elige|^Opciones/i.test(s));
  return (
    lines.find((l) => /\?/.test(l) && /\d/.test(l)) ||
    lines.find((l) => /[xX]/.test(l) && /=/.test(l) && /\d/.test(l)) ||
    null
  );
}

function evalExpr(expr: string, q: number): number | null {
  let e = expr
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/–/g, "-")
    .replace(/\{/g, "(")
    .replace(/\}/g, ")")
    .replace(/²/g, "**2")
    .replace(/³/g, "**3")
    .replace(/(\d)\s*\(/g, "$1*(")
    .replace(/(\d)[xX]/g, `$1*(${q})`)
    .replace(/[?]/g, `(${q})`)
    .replace(/\b[xX]\b/g, `(${q})`);
  e = e.replace(/(\d)\s*\(/g, "$1*(");
  if (!/^[\d+\-*/().\s]+$/.test(e.replace(/\*\*/g, ""))) return null;
  try {
    const v = Function(`"use strict"; return (${e});`)();
    return typeof v === "number" && Number.isFinite(v) ? v : null;
  } catch {
    return null;
  }
}

/** Por qué un cociente entero sale de un número redondo cercano. */
export function atajoDivision(dividend: number, divisor: number): string {
  if (!Number.isInteger(dividend) || !Number.isInteger(divisor) || divisor === 0) {
    return `Atajo: divide ${formatEsNumber(dividend)} entre ${formatEsNumber(divisor)} y comprueba multiplicando al revés.`;
  }
  const q = dividend / divisor;
  if (!Number.isInteger(q)) {
    return `Atajo: ${formatEsNumber(dividend)} ÷ ${formatEsNumber(divisor)} = ${formatEsNumber(q)}. Comprueba al revés: ${formatEsNumber(divisor)} × ${formatEsNumber(q)} = ${formatEsNumber(dividend)}.`;
  }
  const up = q >= 10 ? Math.ceil(q / 10) * 10 : q + 1;
  if (up !== q && up > q && up - q <= 3) {
    const prod = divisor * up;
    const extra = prod - dividend;
    const times = extra / divisor;
    if (Number.isInteger(times) && times > 0) {
      return `Atajo: prueba el redondo ${up}. ${formatEsNumber(divisor)} × ${up} = ${formatEsNumber(prod)}. Te pasas por ${formatEsNumber(prod)} − ${formatEsNumber(dividend)} = ${formatEsNumber(extra)}, y ${formatEsNumber(extra)} es ${times} vez ${formatEsNumber(divisor)}. Bajas ${times}: ${up} − ${times} = ${q}.`;
    }
  }
  const down = q >= 10 ? Math.floor(q / 10) * 10 : 0;
  if (down > 0 && down < q && q - down <= 3) {
    const prod = divisor * down;
    const missing = dividend - prod;
    const times = missing / divisor;
    if (Number.isInteger(times) && times > 0) {
      return `Atajo: ${formatEsNumber(divisor)} × ${down} = ${formatEsNumber(prod)}. Faltan ${formatEsNumber(missing)}, que son ${times} × ${formatEsNumber(divisor)}. Subes ${times}: ${down} + ${times} = ${q}.`;
    }
  }
  return `Atajo: comprueba al revés. ${formatEsNumber(divisor)} × ${q} = ${formatEsNumber(dividend)}, por eso ${formatEsNumber(dividend)} ÷ ${formatEsNumber(divisor)} = ${q}.`;
}

/**
 * Ecuaciones con ? o x en medio (no solo «= ?» al final).
 * El atajo dice de dónde sale el número redondo y por qué se suma o se resta.
 */
export function explainFindUnknown(enunciado: string): string[] | null {
  const line = mathLineOf(enunciado);
  if (!line) return null;
  if (/=\s*\?\s*$/.test(line) && !/[?xX]/.test(line.replace(/=\s*\?\s*$/, ""))) return null;

  const bits = line
    .split("=")
    .map((s) => s.trim())
    .filter(Boolean);
  if (bits.length < 2) return null;
  const left = bits[0];
  const right = /^\?$/.test(bits[bits.length - 1]) && bits.length >= 3 ? bits[1] : bits[1];
  const f = (q: number) => {
    const L = evalExpr(left, q);
    const R = evalExpr(right, q);
    if (L == null || R == null) return null;
    return L - R;
  };
  // q = 0 revienta si el ? está en un divisor. Prueba otro par.
  let qA = 0;
  let qB = 1;
  let fA = f(qA);
  let fB = f(qB);
  if (fA == null || fB == null) {
    qA = 1;
    qB = 2;
    fA = f(qA);
    fB = f(qB);
  }
  if (fA == null || fB == null) return null;
  const slope = (fB - fA) / (qB - qA);
  if (!slope) return null;
  const q = qA - fA / slope;
  if (!Number.isFinite(q)) return null;

  const shown = line.replace(/\s*=\s*\?\s*$/, "").trim();

  const mulSub = shown.match(
    /^(-?\d+(?:[.,]\d+)?)\s*[×*]\s*\?\s*[−-]\s*(\d+(?:[.,]\d+)?)\s*=\s*(-?\d+(?:[.,]\d+)?)$/
  );
  if (mulSub) {
    const a = parseEsNumber(mulSub[1])!;
    const b = parseEsNumber(mulSub[2])!;
    const c = parseEsNumber(mulSub[3])!;
    const prod = c + b;
    return [
      `El −${formatEsNumber(b)} está restando. Pásalo al otro lado sumando: ${formatEsNumber(a)} × ? = ${formatEsNumber(c)} + ${formatEsNumber(b)} = ${formatEsNumber(prod)}.`,
      `Ahora solo falta dividir: ? = ${formatEsNumber(prod)} ÷ ${formatEsNumber(a)}.`,
      atajoDivision(prod, a),
      `Respuesta: ${formatEsNumber(q)}.`,
    ];
  }

  const mulAdd = shown.match(
    /^(-?\d+(?:[.,]\d+)?)\s*[×*]\s*\?\s*\+\s*(\d+(?:[.,]\d+)?)\s*=\s*(-?\d+(?:[.,]\d+)?)$/
  );
  if (mulAdd) {
    const a = parseEsNumber(mulAdd[1])!;
    const b = parseEsNumber(mulAdd[2])!;
    const c = parseEsNumber(mulAdd[3])!;
    const prod = c - b;
    return [
      `El +${formatEsNumber(b)} pasa restando: ${formatEsNumber(a)} × ? = ${formatEsNumber(c)} − ${formatEsNumber(b)} = ${formatEsNumber(prod)}.`,
      `? = ${formatEsNumber(prod)} ÷ ${formatEsNumber(a)}.`,
      atajoDivision(prod, a),
      `Respuesta: ${formatEsNumber(q)}.`,
    ];
  }

  const plainMul = shown.match(
    /^(?:(-?\d+(?:[.,]\d+)?)\s*[×*]\s*\?|\?\s*[×*]\s*(-?\d+(?:[.,]\d+)?))\s*=\s*(-?\d+(?:[.,]\d+)?)$/
  );
  if (plainMul) {
    const a = parseEsNumber(plainMul[1] || plainMul[2])!;
    const c = parseEsNumber(plainMul[3])!;
    return [
      `? está multiplicado por ${formatEsNumber(a)}. Para dejarlo solo, divide: ? = ${formatEsNumber(c)} ÷ ${formatEsNumber(a)}.`,
      atajoDivision(c, a),
      `Respuesta: ${formatEsNumber(q)}.`,
    ];
  }

  const plainDiv = shown.match(/^\?\s*[÷/]\s*(-?\d+(?:[.,]\d+)?)\s*=\s*(-?\d+(?:[.,]\d+)?)$/);
  if (plainDiv) {
    const a = parseEsNumber(plainDiv[1])!;
    const c = parseEsNumber(plainDiv[2])!;
    return [
      `? está dividido entre ${formatEsNumber(a)}. Multiplica al otro lado: ? = ${formatEsNumber(c)} × ${formatEsNumber(a)} = ${formatEsNumber(c * a)}.`,
      `Atajo: dividir y luego multiplicar por el mismo número se cancelan. El ? es el producto ${formatEsNumber(c)} × ${formatEsNumber(a)}.`,
      `Respuesta: ${formatEsNumber(q)}.`,
    ];
  }

  const detailed = explainStructuredUnknown(shown);
  if (detailed) return detailed;

  // Sin patrón claro: no inventar un texto vacío. El banco trae los pasos.
  return null;
}

/** Pasos concretos para X, «+ ?» y «÷ ?». */
function explainStructuredUnknown(shown: string): string[] | null {
  const norm = shown.replace(/\s+/g, " ").trim();

  const fracX = norm.match(/^(-?\d+)\s*[xX]\s*\/\s*(-?\d+)\s*=\s*(-?\d+(?:[.,]\d+)?)$/);
  if (fracX) {
    const a = Number(fracX[1]);
    const b = Number(fracX[2]);
    const c = parseEsNumber(fracX[3])!;
    if (a === c) {
      return [
        `A la izquierda ${formatEsNumber(a)}X está dividido entre ${formatEsNumber(b)}, y a la derecha está el mismo ${formatEsNumber(a)}.`,
        `Divide los dos lados entre ${formatEsNumber(a)}: X ÷ ${formatEsNumber(b)} = 1. Entonces X = ${formatEsNumber(b)}.`,
        `Comprueba: ${formatEsNumber(a)} × ${formatEsNumber(b)} ÷ ${formatEsNumber(b)} = ${formatEsNumber(a)}.`,
        `Respuesta: ${formatEsNumber(b)}.`,
      ];
    }
    const prod = c * b;
    return [
      `${formatEsNumber(a)}X está dividido entre ${formatEsNumber(b)}. Multiplica los dos lados por ${formatEsNumber(b)}: ${formatEsNumber(a)}X = ${formatEsNumber(c)} × ${formatEsNumber(b)} = ${formatEsNumber(prod)}.`,
      `Ahora X está multiplicado por ${formatEsNumber(a)}. Divide: X = ${formatEsNumber(prod)} ÷ ${formatEsNumber(a)} = ${formatEsNumber(prod / a)}.`,
      `Atajo: X = (${formatEsNumber(c)} × ${formatEsNumber(b)}) ÷ ${formatEsNumber(a)}.`,
      `Comprueba: ${formatEsNumber(a)} × ${formatEsNumber(prod / a)} ÷ ${formatEsNumber(b)} = ${formatEsNumber(c)}.`,
      `Respuesta: ${formatEsNumber(prod / a)}.`,
    ];
  }

  const timesX = norm.match(/^(-?\d+)\s*[xX]\s*=\s*(.+)$/);
  if (timesX && !/[?xX]/.test(timesX[2])) {
    const a = Number(timesX[1]);
    const right = evalExpr(timesX[2], 0);
    if (right == null) return null;
    return [
      `Calcula el lado derecho: ${timesX[2].trim()} = ${formatEsNumber(right)}.`,
      `${formatEsNumber(a)}X = ${formatEsNumber(right)}. Divide entre ${formatEsNumber(a)}: X = ${formatEsNumber(right)} ÷ ${formatEsNumber(a)} = ${formatEsNumber(right / a)}.`,
      atajoDivision(right, a),
      `Respuesta: ${formatEsNumber(right / a)}.`,
    ];
  }

  const xTimes = norm.match(/^[xX]\s*[×*]\s*(-?\d+(?:[.,]\d+)?)\s*=\s*(-?\d+(?:[.,]\d+)?)$/);
  if (xTimes) {
    const a = parseEsNumber(xTimes[1])!;
    const c = parseEsNumber(xTimes[2])!;
    return [
      `X está multiplicado por ${formatEsNumber(a)}. Divide: X = ${formatEsNumber(c)} ÷ ${formatEsNumber(a)} = ${formatEsNumber(c / a)}.`,
      atajoDivision(c, a),
      `Respuesta: ${formatEsNumber(c / a)}.`,
    ];
  }

  const divUnknown = norm.match(/^(.+?)\s*[÷/]\s*\?\s*=\s*(-?\d+(?:[.,]\d+)?)$/);
  if (divUnknown && !/[?]/.test(divUnknown[1])) {
    const numer = evalExpr(divUnknown[1], 0);
    const c = parseEsNumber(divUnknown[2])!;
    if (numer == null || c === 0) return null;
    const ans = numer / c;
    const cancels = Math.abs(ans - Math.round(ans)) < 1e-6 && divUnknown[1].includes(String(Math.round(ans)));
    return [
      `Calcula el numerador: ${divUnknown[1].trim()} = ${formatEsNumber(numer)}.`,
      `${formatEsNumber(numer)} ÷ ? = ${formatEsNumber(c)}. Entonces ? = ${formatEsNumber(numer)} ÷ ${formatEsNumber(c)} = ${formatEsNumber(ans)}.`,
      cancels
        ? `Atajo: el numerador ya incluye × ${formatEsNumber(ans)}. Dividir entre ese mismo número lo cancela y deja ${formatEsNumber(c)}. Por eso ? = ${formatEsNumber(ans)}.`
        : `Atajo: ? = ${formatEsNumber(numer)} ÷ ${formatEsNumber(c)}. Comprueba: ${formatEsNumber(c)} × ${formatEsNumber(ans)} = ${formatEsNumber(numer)}.`,
      `Respuesta: ${formatEsNumber(ans)}.`,
    ];
  }

  const mulDiv = norm.match(
    /^(?:(-?\d+(?:[.,]\d+)?)\s*[×*]\s*\?|\?\s*[×*]\s*(-?\d+(?:[.,]\d+)?))\s*[÷/]\s*(-?\d+(?:[.,]\d+)?)\s*=\s*(-?\d+(?:[.,]\d+)?)$/
  );
  if (mulDiv) {
    const a = parseEsNumber(mulDiv[1] || mulDiv[2])!;
    const b = parseEsNumber(mulDiv[3])!;
    const c = parseEsNumber(mulDiv[4])!;
    if (a === c) {
      return [
        `${formatEsNumber(a)} multiplica al ? y el resultado, después de ÷ ${formatEsNumber(b)}, vuelve a ser ${formatEsNumber(a)}.`,
        `Ese ${formatEsNumber(a)} se cancela: ? ÷ ${formatEsNumber(b)} = 1, así que ? = ${formatEsNumber(b)}.`,
        `Comprueba: ${formatEsNumber(a)} × ${formatEsNumber(b)} ÷ ${formatEsNumber(b)} = ${formatEsNumber(a)}.`,
        `Respuesta: ${formatEsNumber(b)}.`,
      ];
    }
    const prod = c * b;
    return [
      `? está multiplicado por ${formatEsNumber(a)} y dividido entre ${formatEsNumber(b)}.`,
      `Multiplica el resultado por ${formatEsNumber(b)}: ${formatEsNumber(a)} × ? = ${formatEsNumber(c)} × ${formatEsNumber(b)} = ${formatEsNumber(prod)}.`,
      `Divide entre ${formatEsNumber(a)}: ? = ${formatEsNumber(prod)} ÷ ${formatEsNumber(a)} = ${formatEsNumber(prod / a)}.`,
      `Atajo: ? = ${formatEsNumber(c)} × ${formatEsNumber(b)} ÷ ${formatEsNumber(a)}.`,
      `Respuesta: ${formatEsNumber(prod / a)}.`,
    ];
  }

  const plusUnknown = norm.match(/^(.+?)\s*\+\s*\?\s*=\s*(-?\d+(?:[.,]\d+)?)$/);
  if (plusUnknown && !/[?]/.test(plusUnknown[1])) {
    const known = evalExpr(plusUnknown[1], 0);
    const c = parseEsNumber(plusUnknown[2])!;
    if (known == null) return null;
    const knownTxt = known < 0 ? `(${formatEsNumber(known)})` : formatEsNumber(known);
    return [
      `Calcula lo que no tiene ?: ${plusUnknown[1].trim()} = ${formatEsNumber(known)}.`,
      `Eso más ? da ${formatEsNumber(c)}. Entonces ? = ${formatEsNumber(c)} − ${knownTxt} = ${formatEsNumber(c - known)}.`,
      `Atajo: el ? es lo que falta para llegar de ${formatEsNumber(known)} a ${formatEsNumber(c)}.`,
      `Respuesta: ${formatEsNumber(c - known)}.`,
    ];
  }

  const qMulRest = norm.match(/^\?\s*[×*]\s*(-?\d+(?:[.,]\d+)?)\s*(.+)\s*=\s*(-?\d+(?:[.,]\d+)?)$/);
  if (qMulRest) {
    const a = parseEsNumber(qMulRest[1])!;
    const rest = qMulRest[2].trim();
    const c = parseEsNumber(qMulRest[3])!;
    const restVal = evalExpr(rest, 0);
    if (restVal == null) return null;
    const isolated = c - restVal;
    return [
      `Aparte de ? × ${formatEsNumber(a)} está ${rest}, que vale ${formatEsNumber(restVal)}.`,
      `Pásalo al otro lado (cambia de signo): ${formatEsNumber(a)} × ? = ${formatEsNumber(c)} − (${formatEsNumber(restVal)}) = ${formatEsNumber(isolated)}.`,
      `? = ${formatEsNumber(isolated)} ÷ ${formatEsNumber(a)} = ${formatEsNumber(isolated / a)}.`,
      atajoDivision(isolated, a),
      `Respuesta: ${formatEsNumber(isolated / a)}.`,
    ];
  }

  const qDivRest = norm.match(/^\?\s*[÷/]\s*(-?\d+(?:[.,]\d+)?)\s*(.+)\s*=\s*(-?\d+(?:[.,]\d+)?)$/);
  if (qDivRest) {
    const a = parseEsNumber(qDivRest[1])!;
    const rest = qDivRest[2].trim();
    const c = parseEsNumber(qDivRest[3])!;
    const restVal = evalExpr(rest, 0);
    if (restVal == null) return null;
    const isolated = c - restVal;
    return [
      `Lo que acompaña a ? ÷ ${formatEsNumber(a)} es ${rest} = ${formatEsNumber(restVal)}.`,
      `Pásalo: ? ÷ ${formatEsNumber(a)} = ${formatEsNumber(c)} − (${formatEsNumber(restVal)}) = ${formatEsNumber(isolated)}.`,
      `? = ${formatEsNumber(isolated)} × ${formatEsNumber(a)} = ${formatEsNumber(isolated * a)}.`,
      `Respuesta: ${formatEsNumber(isolated * a)}.`,
    ];
  }

  const prodDivX = norm.match(/^(-?\d+(?:[.,]\d+)?)\s*[×*]\s*(-?\d+(?:[.,]\d+)?)\s*[÷/]\s*[xX]\s*=\s*(-?\d+(?:[.,]\d+)?)$/);
  if (prodDivX) {
    const a = parseEsNumber(prodDivX[1])!;
    const b = parseEsNumber(prodDivX[2])!;
    const c = parseEsNumber(prodDivX[3])!;
    const prod = a * b;
    return [
      `Primero el producto: ${formatEsNumber(a)} × ${formatEsNumber(b)} = ${formatEsNumber(prod)}.`,
      `Queda ${formatEsNumber(prod)} ÷ X = ${formatEsNumber(c)}. Entonces X = ${formatEsNumber(prod)} ÷ ${formatEsNumber(c)} = ${formatEsNumber(prod / c)}.`,
      atajoDivision(prod, c),
      `Respuesta: ${formatEsNumber(prod / c)}.`,
    ];
  }

  const parenDiv = norm.match(/^\((.+)\)\s*[÷/]\s*\?\s*=\s*(-?\d+(?:[.,]\d+)?)$/);
  if (parenDiv && !/[?]/.test(parenDiv[1])) {
    const numer = evalExpr(parenDiv[1], 0);
    const c = parseEsNumber(parenDiv[2])!;
    if (numer != null && numer !== 0) {
      const factor = numer / c;
      const cancel =
        Math.abs(factor - Math.round(factor)) < 1e-6
          ? ` ${parenDiv[1].trim()} ya incluye el factor ${formatEsNumber(factor)}, y al dividir entre ese mismo factor el ${formatEsNumber(c)} se queda igual. Por eso ? = ${formatEsNumber(factor)}.`
          : "";
      return [
        `Calcula el paréntesis: ${parenDiv[1].trim()} = ${formatEsNumber(numer)}.`,
        `${formatEsNumber(numer)} ÷ ? = ${formatEsNumber(c)}, así que ? = ${formatEsNumber(numer)} ÷ ${formatEsNumber(c)} = ${formatEsNumber(numer / c)}.${cancel}`,
        `Respuesta: ${formatEsNumber(numer / c)}.`,
      ];
    }
  }

  const divThenAdd = norm.match(/^(-?\d+(?:[.,]\d+)?)\s*[×*]\s*(-?\d+(?:[.,]\d+)?)\s*[÷/]\s*\?\s*\+\s*(-?\d+(?:[.,]\d+)?)\s*=\s*(-?\d+(?:[.,]\d+)?)$/);
  if (divThenAdd) {
    const a = parseEsNumber(divThenAdd[1])!;
    const b = parseEsNumber(divThenAdd[2])!;
    const add = parseEsNumber(divThenAdd[3])!;
    const c = parseEsNumber(divThenAdd[4])!;
    const prod = a * b;
    const isolated = c - add;
    const isoTxt = isolated < 0 ? `(${formatEsNumber(isolated)})` : formatEsNumber(isolated);
    return [
      `${formatEsNumber(a)} × ${formatEsNumber(b)} = ${formatEsNumber(prod)}. La ecuación queda ${formatEsNumber(prod)} ÷ ? + ${formatEsNumber(add)} = ${formatEsNumber(c)}.`,
      `Quita el +${formatEsNumber(add)}: ${formatEsNumber(prod)} ÷ ? = ${formatEsNumber(c)} − ${formatEsNumber(add)} = ${isoTxt}.`,
      `? = ${formatEsNumber(prod)} ÷ ${isoTxt} = ${formatEsNumber(prod / isolated)}.`,
      `Respuesta: ${formatEsNumber(prod / isolated)}.`,
    ];
  }

  return null;
}

