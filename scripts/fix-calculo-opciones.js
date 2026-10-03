/**
 * Asegura 5 opciones en cada ítem de cálculo mental + stems limpios.
 * Uso: node scripts/fix-calculo-opciones.js
 */
const fs = require("fs");
const path = require("path");

function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(arr, rnd) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function canon(s) {
  return String(s)
    .replace(/^[A-E]\)\s*/i, "")
    .replace(/,/g, "")
    .replace(/−/g, "-")
    .replace(/\s+/g, "")
    .trim();
}

function parseNum(s) {
  const t = canon(s);
  if (/^-?\d+\/\d+$/.test(t)) {
    const [a, b] = t.split("/").map(Number);
    return b ? a / b : null;
  }
  if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);
  return null;
}

function display(s) {
  return canon(s).replace(/-/g, "−");
}

function sameValue(a, b) {
  if (canon(a) === canon(b)) return true;
  const na = parseNum(a);
  const nb = parseNum(b);
  return na != null && nb != null && Math.abs(na - nb) < 1e-9;
}

function fmtFromNumber(n, preferFrac) {
  if (preferFrac && /^-?\d+\/\d+$/.test(preferFrac)) return preferFrac;
  if (Number.isInteger(n)) return String(n);
  const r = Math.round(n * 1000) / 1000;
  if (Math.abs(n * 2 - Math.round(n * 2)) < 1e-9) {
    return `${Math.round(n * 2)}/2`.replace(/^(-?)(\d+)\/2$/, (_, sgn, num) => {
      // reduce */2 only if even
      const n2 = Number(num);
      if (n2 % 2 === 0) return `${sgn}${n2 / 2}`;
      return `${sgn}${n2}/2`;
    });
  }
  return String(r);
}

function extractStem(enunciado) {
  let e = enunciado
    .replace(/^Elija la respuesta correcta\.\s*/i, "")
    .replace(/^Calcula:\s*/i, "")
    .replace(/^Halla el valor de X:\s*/i, "")
    .replace(/^Simplifica la fracción:\s*/i, "")
    .replace(/Escribe el resultado[^\n]*\n?/gi, "")
    .trim();

  e = e.replace(/\n*Opciones:\s*[^\n]+/gi, "");
  e = e.replace(/(?:\n[A-E]\)\s*[^\n]+)+$/gim, "");
  e = e.replace(/=\s*\?\s*=\s*\?/g, " = ?");
  e = e.replace(/\s*=\s*\?\s*$/, "").trim();

  if (!/\?/.test(e)) {
    e = `${e.replace(/[.\s]+$/, "")} = ?`;
  }
  return e.replace(/=\s*\?\s*=\s*\?/g, " = ?").trim();
}

function extractExistingOptions(enunciado) {
  const pipe = enunciado.match(/Opciones:\s*([^\n]+)/i);
  if (pipe) {
    return pipe[1]
      .split("|")
      .map((p) => canon(p))
      .filter((p) => p && p !== "…" && !/^opcion/i.test(p));
  }
  const letters = [...enunciado.matchAll(/([A-E])\)\s*([^\n|]+)/gi)].map((m) => canon(m[2]));
  return letters.length >= 4 ? letters.slice(0, 5) : [];
}

function makeDistractors(correctRaw, seed) {
  const rnd = mulberry32(hash(seed + "|" + correctRaw));
  const correct = canon(correctRaw);
  const n = parseNum(correct);
  const out = [];

  const push = (v) => {
    const s = typeof v === "number" ? fmtFromNumber(v, /\//.test(correct) ? correct : undefined) : canon(String(v));
    if (!s) return;
    if (out.some((o) => sameValue(o, s))) return;
    out.push(s);
  };

  push(correct);

  if (n != null) {
    const cands = [
      -n,
      n + 1,
      n - 1,
      n + 2,
      n - 2,
      n * 2,
      n / 2,
      n + 10,
      n - 10,
      Math.abs(n),
      n === 0 ? 1 : 0,
      Math.round(n * 1.5),
      Math.floor(n) - 1,
      Math.ceil(n) + 1,
    ];
    if (/^-?\d+\/\d+$/.test(correct)) {
      const [a, b] = correct.split("/").map(Number);
      cands.push(b / a, a / (b * 2), (a * 2) / b, a, b, 1);
    }
    for (const c of shuffle(cands, rnd)) {
      if (out.length >= 5) break;
      if (!Number.isFinite(c)) continue;
      push(c);
    }
    let k = 3;
    while (out.length < 5 && k < 200) {
      push(n + (k % 2 === 0 ? k : -k));
      k++;
    }
  }

  let filler = 1001;
  while (out.length < 5 && filler < 1100) {
    push(filler++);
  }

  return shuffle(out.slice(0, 5), rnd);
}

function buildEnunciado(stem, options) {
  return `Elija la respuesta correcta.\n\n${stem}\n\nOpciones: ${options.map(display).join(" | ")}`;
}

const bancoPath = path.join(process.cwd(), "src/lib/psicotecnicas/bancoTipos.json");
const banco = JSON.parse(fs.readFileSync(bancoPath, "utf8"));
const tipo = banco.tipos.find((t) => t.id === "calculo-mental");

let regenerated = 0;
tipo.items = tipo.items.map((it, idx) => {
  const respuesta = canon(it.respuesta);
  const stem = extractStem(it.enunciado);
  let opts = extractExistingOptions(it.enunciado);

  const hasCorrect = opts.some((o) => sameValue(o, respuesta));
  if (opts.length !== 5 || !hasCorrect) {
    opts = makeDistractors(respuesta, stem + "|" + idx);
    regenerated++;
  }

  // Force correct in set
  if (!opts.some((o) => sameValue(o, respuesta))) {
    opts[0] = respuesta;
  }
  // Dedup + pad safely (max 20 tries)
  const uniq = [];
  for (const o of opts) {
    if (!uniq.some((u) => sameValue(u, o))) uniq.push(canon(o));
  }
  let guard = 0;
  while (uniq.length < 5 && guard < 20) {
    const extra = makeDistractors(respuesta, stem + "|pad|" + guard + "|" + uniq.length);
    for (const e of extra) {
      if (uniq.length >= 5) break;
      if (!uniq.some((u) => sameValue(u, e))) uniq.push(canon(e));
    }
    guard++;
  }
  while (uniq.length < 5) uniq.push(String(9000 + uniq.length));
  if (!uniq.some((o) => sameValue(o, respuesta))) uniq[hash(stem) % 5] = respuesta;

  const finalOpts = shuffle(uniq.slice(0, 5), mulberry32(hash(stem + "|final")));
  // keep correct somewhere
  if (!finalOpts.some((o) => sameValue(o, respuesta))) finalOpts[2] = respuesta;

  return {
    ...it,
    enunciado: buildEnunciado(stem, finalOpts),
    respuesta,
  };
});

fs.writeFileSync(bancoPath, JSON.stringify(banco, null, 2) + "\n");

const bad = tipo.items.filter((it) => !/Opciones:/.test(it.enunciado) || (it.enunciado.match(/\|/g) || []).length < 3);
let missAns = 0;
for (const [i, it] of tipo.items.entries()) {
  const m = it.enunciado.match(/Opciones:\s*([^\n]+)/i);
  const opts = m[1].split("|").map((s) => canon(s));
  if (!opts.some((o) => sameValue(o, it.respuesta))) {
    missAns++;
    console.log("MISS", i + 1, it.respuesta, opts.join(" | "));
  }
}
console.log({
  total: tipo.items.length,
  regenerated,
  bad: bad.length,
  missAns,
});
console.log("--- item 2 ---\n" + tipo.items[1].enunciado + "\n=> " + tipo.items[1].respuesta);
