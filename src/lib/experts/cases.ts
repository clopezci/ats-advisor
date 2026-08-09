/**
 * Casos de servicio con aliados + cortes semanales de comisión.
 * Persistencia: app_settings.key = expert_ops (Supabase service role).
 */

import { createServiceSupabase } from "@/lib/supabase/client";
import { randomBytes } from "crypto";

export type ExpertCaseStatus = "requested" | "confirmed" | "disputed" | "cancelled" | "settled";

export type ExpertCase = {
  id: string;
  createdAt: string;
  allyId: string;
  allyName: string;
  allyEmail: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  specialty: string;
  message: string;
  status: ExpertCaseStatus;
  confirmToken: string;
  confirmedAt?: string;
  serviceDate?: string;
  amountPaidCop?: number;
  proofNote?: string;
  commissionPercent: number;
  commissionCop?: number;
  settlementId?: string;
  notify: { email: boolean; telegram: boolean; whatsapp: boolean };
};

export type ExpertSettlement = {
  id: string;
  weekLabel: string;
  createdAt: string;
  caseIds: string[];
  totalCommissionCop: number;
  notes: string;
  status: "draft" | "closed";
};

export type ExpertOps = {
  cases: ExpertCase[];
  settlements: ExpertSettlement[];
};

const OPS_KEY = "expert_ops";
const g = globalThis as unknown as { __expertOps?: ExpertOps };

function emptyOps(): ExpertOps {
  return { cases: [], settlements: [] };
}

export async function loadExpertOps(): Promise<ExpertOps> {
  const sb = createServiceSupabase();
  if (sb) {
    const { data } = await sb.from("app_settings").select("value").eq("key", OPS_KEY).maybeSingle();
    if (data?.value && typeof data.value === "object") {
      const v = data.value as ExpertOps;
      const ops = {
        cases: Array.isArray(v.cases) ? v.cases : [],
        settlements: Array.isArray(v.settlements) ? v.settlements : [],
      };
      g.__expertOps = ops;
      return ops;
    }
  }
  if (!g.__expertOps) g.__expertOps = emptyOps();
  return g.__expertOps;
}

export async function saveExpertOps(ops: ExpertOps): Promise<{ cloud: boolean }> {
  g.__expertOps = ops;
  const sb = createServiceSupabase();
  if (!sb) return { cloud: false };
  const { error } = await sb.from("app_settings").upsert({
    key: OPS_KEY,
    value: ops,
    updated_at: new Date().toISOString(),
  });
  return { cloud: !error };
}

export function newCaseId() {
  return `exc_${Date.now()}_${randomBytes(3).toString("hex")}`;
}

export function newConfirmToken() {
  return randomBytes(16).toString("hex");
}

export function isoWeekLabel(d = new Date()) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

export function computeCommission(amountPaidCop: number, percent: number) {
  return Math.round(Math.max(0, amountPaidCop) * (Math.max(0, percent) / 100));
}
