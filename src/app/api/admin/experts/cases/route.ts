import { NextResponse } from "next/server";
import { isAdminSecret } from "@/lib/admin/auth";
import {
  loadExpertOps,
  saveExpertOps,
  isoWeekLabel,
  type ExpertCaseStatus,
} from "@/lib/experts/cases";
import { clampText } from "@/lib/validation";
import { notifyOwnerTelegram } from "@/lib/notify/channels";
import { reportError } from "@/lib/observability";

function auth(req: Request) {
  return isAdminSecret(req.headers.get("x-admin-secret"));
}

/** Lista casos + settlements. Query: status, week, allyId */
export async function GET(req: Request) {
  if (!auth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  try {
    const ops = await loadExpertOps();
    const url = new URL(req.url);
    const status = url.searchParams.get("status") || "";
    const allyId = url.searchParams.get("allyId") || "";
    let cases = ops.cases;
    if (status) cases = cases.filter((c) => c.status === status);
    if (allyId) cases = cases.filter((c) => c.allyId === allyId);

    const pendingCommission = cases
      .filter((c) => c.status === "confirmed" && !c.settlementId)
      .reduce((a, c) => a + (c.commissionCop || 0), 0);

    return NextResponse.json({
      ok: true,
      cases,
      settlements: ops.settlements,
      pendingCommission,
      weekHint: isoWeekLabel(),
    });
  } catch (e) {
    await reportError({ where: "api/admin/experts/cases:GET", error: e, notifyOwner: true });
    return NextResponse.json({ error: "Error listando casos" }, { status: 500 });
  }
}

/**
 * PATCH: actualizar estado manual.
 * Body: { caseId, status?, settlementId? }
 */
export async function PATCH(req: Request) {
  if (!auth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  try {
    const body = await req.json().catch(() => ({}));
    const caseId = clampText(body.caseId || "", 64);
    const status = clampText(body.status || "", 20) as ExpertCaseStatus;
    const ops = await loadExpertOps();
    const idx = ops.cases.findIndex((c) => c.id === caseId);
    if (idx < 0) return NextResponse.json({ error: "Caso no encontrado" }, { status: 404 });
    const allowed: ExpertCaseStatus[] = ["requested", "confirmed", "disputed", "cancelled", "settled"];
    if (status && !allowed.includes(status)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
    }
    if (status) ops.cases[idx] = { ...ops.cases[idx], status };
    await saveExpertOps(ops);
    return NextResponse.json({ ok: true, case: ops.cases[idx] });
  } catch (e) {
    await reportError({ where: "api/admin/experts/cases:PATCH", error: e, notifyOwner: true });
    return NextResponse.json({ error: "Error actualizando" }, { status: 500 });
  }
}

/**
 * POST: crear corte semanal con casos confirmed sin settlement.
 * Body: { caseIds?: string[], notes?, weekLabel?, close?: boolean }
 */
export async function POST(req: Request) {
  if (!auth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  try {
    const body = await req.json().catch(() => ({}));
    const notes = clampText(body.notes || "", 500);
    const weekLabel = clampText(body.weekLabel || isoWeekLabel(), 16);
    const close = body.close !== false;
    const ops = await loadExpertOps();

    let ids: string[] = Array.isArray(body.caseIds)
      ? body.caseIds.map((x: unknown) => String(x))
      : ops.cases.filter((c) => c.status === "confirmed" && !c.settlementId).map((c) => c.id);

    const selected = ops.cases.filter((c) => ids.includes(c.id) && c.status === "confirmed" && !c.settlementId);
    if (!selected.length) {
      return NextResponse.json({ error: "No hay casos confirmed pendientes de corte." }, { status: 400 });
    }

    const settlementId = `set_${Date.now()}`;
    const totalCommissionCop = selected.reduce((a, c) => a + (c.commissionCop || 0), 0);
    const settlement = {
      id: settlementId,
      weekLabel,
      createdAt: new Date().toISOString(),
      caseIds: selected.map((c) => c.id),
      totalCommissionCop,
      notes,
      status: close ? ("closed" as const) : ("draft" as const),
    };

    ops.settlements = [settlement, ...ops.settlements].slice(0, 200);
    ops.cases = ops.cases.map((c) =>
      selected.some((s) => s.id === c.id)
        ? { ...c, status: "settled" as const, settlementId }
        : c
    );
    await saveExpertOps(ops);

    await notifyOwnerTelegram(
      `Corte comisiones ${weekLabel}: ${selected.length} casos · ${totalCommissionCop} COP · ${settlementId}`
    );

    return NextResponse.json({ ok: true, settlement, cases: selected.length });
  } catch (e) {
    await reportError({ where: "api/admin/experts/cases:POST", error: e, notifyOwner: true });
    return NextResponse.json({ error: "Error creando corte" }, { status: 500 });
  }
}
