/** Código de referido local + contador de compartidos. */

const KEY = "ats_referral_v1";

export type ReferralState = {
  code: string;
  createdAt: number;
  shares: number;
  claimedFrom?: string;
};

function randomCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "LOTIC";
  for (let i = 0; i < 4; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return s;
}

export function readReferral(): ReferralState {
  if (typeof window === "undefined") {
    return { code: "LOTIC----", createdAt: 0, shares: 0 };
  }
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as ReferralState;
  } catch {
    /* ignore */
  }
  const next: ReferralState = { code: randomCode(), createdAt: Date.now(), shares: 0 };
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function bumpShare(): ReferralState {
  const cur = readReferral();
  const next = { ...cur, shares: cur.shares + 1 };
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function claimReferral(code: string): ReferralState {
  const cur = readReferral();
  const next = { ...cur, claimedFrom: code.trim().toUpperCase().slice(0, 16) };
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function referralShareUrl(code: string, base?: string) {
  const origin =
    base ||
    (typeof window !== "undefined" ? window.location.origin : "https://ats-advisor-two.vercel.app");
  return `${origin}/auth?ref=${encodeURIComponent(code)}`;
}
