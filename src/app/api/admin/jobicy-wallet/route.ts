import { NextResponse } from "next/server";
import { isAdminSecret } from "@/lib/admin/auth";
import {
  acknowledgeJobicyFund,
  getJobicyWallet,
  updateJobicyWalletMeta,
} from "@/lib/salary/jobicyWallet";
import { reportError } from "@/lib/observability";

export async function GET(req: Request) {
  if (!isAdminSecret(req.headers.get("x-admin-secret"))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const wallet = await getJobicyWallet({ notifyIfAlert: true });
    return NextResponse.json({ ok: true, wallet });
  } catch (e) {
    await reportError({ where: "api/admin/jobicy-wallet:GET", error: e, notifyOwner: true });
    return NextResponse.json({ error: "No se pudo cargar wallet Jobicy" }, { status: 500 });
  }
}

/**
 * POST body:
 * { action: "funded", amountUsd?: number } — Ya fondeé (default +10)
 * { action: "set_meta", costPerLookupUsd?, alertThresholdUsd? }
 * { action: "reset", fundedUsd?: number }
 */
export async function POST(req: Request) {
  if (!isAdminSecret(req.headers.get("x-admin-secret"))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const body = (await req.json().catch(() => null)) as {
      action?: string;
      amountUsd?: number;
      costPerLookupUsd?: number;
      alertThresholdUsd?: number;
      fundedUsd?: number;
    } | null;

    const action = body?.action || "";
    if (action === "funded") {
      const amount = typeof body?.amountUsd === "number" ? body.amountUsd : 10;
      const wallet = await acknowledgeJobicyFund(amount);
      return NextResponse.json({ ok: true, wallet });
    }
    if (action === "set_meta") {
      const wallet = await updateJobicyWalletMeta({
        costPerLookupUsd: body?.costPerLookupUsd,
        alertThresholdUsd: body?.alertThresholdUsd,
      });
      return NextResponse.json({ ok: true, wallet });
    }
    if (action === "reset") {
      const wallet = await updateJobicyWalletMeta({
        resetWithFundedUsd: typeof body?.fundedUsd === "number" ? body.fundedUsd : 10,
      });
      return NextResponse.json({ ok: true, wallet });
    }
    return NextResponse.json({ error: "action inválida" }, { status: 400 });
  } catch (e) {
    await reportError({ where: "api/admin/jobicy-wallet:POST", error: e, notifyOwner: true });
    return NextResponse.json({ error: "No se pudo actualizar wallet Jobicy" }, { status: 500 });
  }
}
