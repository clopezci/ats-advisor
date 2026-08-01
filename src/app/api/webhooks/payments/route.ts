import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { notifyOwnerTelegram } from "@/lib/notify/channels";
import { createServiceSupabase } from "@/lib/supabase/client";

type Normalized = {
  provider: "wompi" | "mercadopago" | "unknown";
  event: string;
  reference: string;
  status: string;
  planHint: string | null;
};

function planFromReference(reference: string) {
  const planMatch = reference.match(/^ATS-(carrera|plus|out09_extra)-/i);
  return planMatch?.[1]?.toLowerCase() || null;
}

function normalizeWompi(body: Record<string, unknown>): Normalized {
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
      }
    } catch {
      /* ignore fetch errors; still ack webhook */
    }
  } else if (body.external_reference) {
    reference = String(body.external_reference);
    status = String(body.status || "n/d").toUpperCase();
  }

  return {
    provider: "mercadopago",
    event: topic,
    reference,
    status,
    planHint: planFromReference(reference),
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

/**
 * Webhook unificado Wompi + Mercado Pago.
 * Wompi: checksum con WOMPI_EVENTS_SECRET (fail closed) salvo WOMPI_CHECKSUM_MODE=skip.
 * MP: consulta payment si hay MP_ACCESS_TOKEN.
 */
export async function POST(req: Request) {
  const raw = await req.text();
  const url = new URL(req.url);
  let body: Record<string, unknown> = {};
  try {
    body = raw ? JSON.parse(raw) : {};
  } catch {
    // MP a veces manda query-only
    body = {};
  }

  let normalized: Normalized;

  if (looksLikeMercadoPago(body, url) && !body.event) {
    normalized = await normalizeMercadoPago(body, url);
  } else {
    const secret = process.env.WOMPI_EVENTS_SECRET;
    const checksum = req.headers.get("x-event-checksum") || "";
    const skip = process.env.WOMPI_CHECKSUM_MODE === "skip";

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
    }
    normalized = normalizeWompi(body);
  }

  await notifyOwnerTelegram(
    `Pago webhook (${normalized.provider}): ${normalized.event} · ${normalized.status} · ${normalized.reference}${
      normalized.planHint ? ` · plan=${normalized.planHint}` : ""
    }`
  );

  const sb = createServiceSupabase();
  const approved =
    normalized.status.toUpperCase() === "APPROVED" ||
    normalized.status.toLowerCase() === "approved";
  if (sb && approved) {
    await sb.from("audit_events").insert({
      kind: "payment_approved",
      detail: normalized,
    });
  }

  return NextResponse.json({ ok: true, received: true, ...normalized });
}

export async function GET(req: Request) {
  // Mercado Pago IPN a veces usa GET
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
