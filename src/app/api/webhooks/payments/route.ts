import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { notifyOwnerTelegram } from "@/lib/notify/channels";
import { createServiceSupabase } from "@/lib/supabase/client";
import { activatePlanFromPayment } from "@/lib/payments/entitlementsCloud";

type Normalized = {
  provider: "wompi" | "mercadopago" | "unknown";
  event: string;
  reference: string;
  status: string;
  planHint: string | null;
  verified: boolean;
};

function planFromReference(reference: string) {
  const planMatch = reference.match(/^ATS-(carrera|plus|out09_extra)-/i);
  return planMatch?.[1]?.toLowerCase() || null;
}

function normalizeWompi(body: Record<string, unknown>, verified: boolean): Normalized {
  const data = (body.data || body) as Record<string, unknown>;
  const reference =
    String(
      (data as { transaction?: { reference?: string } }).transaction?.reference ||
        (data as { reference?: string }).reference ||
        ""
    ) || "sin-ref";
  const status =
    String(
      (data as { transaction?: { status?: string } }).transaction?.status ||
        (data as { status?: string }).status ||
        ""
    ) || "n/d";
  return {
    provider: "wompi",
    event: String(body.event || body.type || "wompi"),
    reference,
    status,
    planHint: planFromReference(reference),
    verified,
  };
}

async function normalizeMercadoPago(
  body: Record<string, unknown>,
  url: URL
): Promise<Normalized> {
  const topic = String(body.type || body.topic || url.searchParams.get("topic") || "payment");
  const dataId = String(
    (body.data as { id?: string } | undefined)?.id ||
      body.id ||
      url.searchParams.get("id") ||
      ""
  );
  const token = process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN;
  let reference = "sin-ref";
  let status = "n/d";
  let verified = false;

  if (token && dataId && (topic === "payment" || topic.includes("payment"))) {
    try {
      const res = await fetch(`https://api.mercadopago.com/v1/payments/${dataId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const pay = await res.json();
        reference = String(pay.external_reference || reference);
        status = String(pay.status || status).toUpperCase();
        if (status === "APPROVED" || status === "approved") status = "APPROVED";
        verified = true;
      }
    } catch {
      /* ignore fetch errors; still ack webhook */
    }
  }
  // Sin consulta API no confiamos en body.external_reference (evita forge).

  return {
    provider: "mercadopago",
    event: topic,
    reference,
    status,
    planHint: planFromReference(reference),
    verified,
  };
}

function looksLikeMercadoPago(body: Record<string, unknown>, url: URL) {
  return Boolean(
    body.action ||
      body.live_mode != null ||
      body.topic ||
      url.searchParams.get("topic") ||
      url.searchParams.get("id") ||
      String(body.type || "").includes("payment")
  );
}

function isProdRuntime() {
  return process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
}

/**
 * Webhook unificado Wompi + Mercado Pago.
 * Wompi: checksum obligatorio en prod (salvo WOMPI_CHECKSUM_MODE=skip).
 * MP: solo activa si se verificó el payment vía API.
 */
export async function POST(req: Request) {
  const raw = await req.text();
  const url = new URL(req.url);
  let body: Record<string, unknown> = {};
  try {
    body = raw ? JSON.parse(raw) : {};
  } catch {
    body = {};
  }

  let normalized: Normalized;

  if (looksLikeMercadoPago(body, url) && !body.event) {
    normalized = await normalizeMercadoPago(body, url);
  } else {
    const secret = process.env.WOMPI_EVENTS_SECRET;
    const checksum = req.headers.get("x-event-checksum") || "";
    const skip = process.env.WOMPI_CHECKSUM_MODE === "skip";

    if (!secret && isProdRuntime() && !skip) {
      await notifyOwnerTelegram("Webhook Wompi rechazado: falta WOMPI_EVENTS_SECRET en producción");
      return NextResponse.json({ error: "Webhook no configurado" }, { status: 503 });
    }

    let verified = false;
    if (secret && !skip && Object.keys(body).length) {
      if (!checksum) {
        return NextResponse.json({ error: "Falta x-event-checksum" }, { status: 401 });
      }
      const digest = createHash("sha256").update(`${raw}${secret}`).digest("hex");
      const props = JSON.stringify(body.data || body);
      const digestAlt = createHash("sha256").update(`${props}${secret}`).digest("hex");
      if (checksum !== digest && checksum !== digestAlt) {
        await notifyOwnerTelegram("Webhook pagos: checksum inválido (rechazado)");
        return NextResponse.json({ error: "Checksum inválido" }, { status: 401 });
      }
      verified = true;
    } else if (skip || !isProdRuntime()) {
      verified = Boolean(Object.keys(body).length);
    }

    normalized = normalizeWompi(body, verified);
  }

  await notifyOwnerTelegram(
    `Pago webhook (${normalized.provider}): ${normalized.event} · ${normalized.status} · ${normalized.reference}${
      normalized.planHint ? ` · plan=${normalized.planHint}` : ""
    }${normalized.verified ? "" : " · UNVERIFIED"}`
  );

  const sb = createServiceSupabase();
  const approved =
    normalized.verified &&
    (normalized.status.toUpperCase() === "APPROVED" ||
      normalized.status.toLowerCase() === "approved");

  let entitlement: Awaited<ReturnType<typeof activatePlanFromPayment>> | null = null;
  if (approved) {
    if (sb) {
      await sb.from("audit_events").insert({
        kind: "payment_approved",
        detail: normalized,
      });
    }
    entitlement = await activatePlanFromPayment({
      reference: normalized.reference,
      planHint: normalized.planHint,
      provider: normalized.provider,
      status: normalized.status,
    });
  }

  return NextResponse.json({
    ok: true,
    received: true,
    ...normalized,
    entitlement,
  });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (url.searchParams.get("topic") || url.searchParams.get("id")) {
    return POST(
      new Request(req.url, {
        method: "POST",
        headers: req.headers,
        body: "{}",
      })
    );
  }
  return NextResponse.json({
    ok: true,
    message: "Webhook pagos ATSAdvisor (Wompi + Mercado Pago).",
    url: "/api/webhooks/payments",
  });
}
