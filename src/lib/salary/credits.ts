/** Créditos locales para consultas salariales premium (prepago). */

const KEY = "ats_salary_credits_v1";
const LEDGER_KEY = "ats_salary_credit_ledger_v1";

export type SalaryCreditPackId = "pack5" | "pack20";

export const SALARY_CREDIT_PACKS: {
  id: SalaryCreditPackId;
  credits: number;
  label: string;
  priceCop: number;
  hint: string;
}[] = [
  {
    id: "pack5",
    credits: 5,
    label: "5 consultas premium",
    priceCop: 19_000,
    hint: "Para validar 1–2 roles con fuente externa",
  },
  {
    id: "pack20",
    credits: 20,
    label: "20 consultas premium",
    priceCop: 49_000,
    hint: "Búsqueda activa (varias industrias / tamaños)",
  },
];

export function readSalaryCredits(): number {
  if (typeof window === "undefined") return 0;
  try {
    const n = Number(localStorage.getItem(KEY) || "0");
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  } catch {
    return 0;
  }
}

export function writeSalaryCredits(n: number) {
  localStorage.setItem(KEY, String(Math.max(0, Math.floor(n))));
}

export function addSalaryCredits(n: number, note: string) {
  const next = readSalaryCredits() + Math.max(0, Math.floor(n));
  writeSalaryCredits(next);
  pushLedger({ at: Date.now(), delta: n, note, balance: next });
  return next;
}

export function consumeSalaryCredit(note: string): { ok: boolean; balance: number } {
  const cur = readSalaryCredits();
  if (cur < 1) return { ok: false, balance: cur };
  const next = cur - 1;
  writeSalaryCredits(next);
  pushLedger({ at: Date.now(), delta: -1, note, balance: next });
  return { ok: true, balance: next };
}

function pushLedger(entry: { at: number; delta: number; note: string; balance: number }) {
  try {
    const prev = JSON.parse(localStorage.getItem(LEDGER_KEY) || "[]");
    const list = Array.isArray(prev) ? prev : [];
    list.unshift(entry);
    localStorage.setItem(LEDGER_KEY, JSON.stringify(list.slice(0, 40)));
  } catch {
    /* ignore */
  }
}

/** Compra demo local (QA). En producción se amarra a checkout. */
export function purchaseSalaryPackDemo(packId: SalaryCreditPackId): number {
  const pack = SALARY_CREDIT_PACKS.find((p) => p.id === packId);
  if (!pack) return readSalaryCredits();
  return addSalaryCredits(pack.credits, `Pack demo ${pack.label}`);
}
