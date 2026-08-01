import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { notifyOwnerTelegram } from "@/lib/notify/channels";
import { createServiceSupabase } from "@/lib/supabase/client";

/**
 * Webhook Wompi.
 * Con WOMPI_EVENTS_SECRET: valida checksum (fail closed).
 * Sin secret: acepta en modo preview/demo.
 *
 * Nota: Wompi documenta checksum sobre campos específicos del evento;
 * aquí usamos raw+secret como base y permitimos override con
 * WOMPI_CHECKSUM_MODE=skip solo en staging.
 */
export async function POST(req: Request) {
  const raw = await req.text();
  let body: Record<string, unknown> = {};
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const secret = process.env.WOMPI_EVENTS_SECRET;
  const checksum = req.headers.get("x-event-checksum") || "";
  const skip = process.env.WOMPI_CHECKSUM_MODE === "skip";

  if (secret && !skip) {
    if (!checksum) {
      return NextResponse.json({ error: "Falta x-event-checksum" }, { status: 401 });
    }
    const digest = createHash("sha256").update(`${raw}${secret}`).digest("hex");
    // También aceptamos checksum sobre properties concatenadas si vienen en el body
    const props = JSON.stringify(body.data || body);
    const digestAlt = createHash("sha256").update(`${props}${secret}`).digest("hex");
    if (checksum !== digest && checksum !== digestAlt) {
      await notifyOwnerTelegram("Webhook pagos: checksum inválido (rechazado)");
      return NextResponse.json({ error: "Checksum inválido" }, { status: 401 });
    }
  }

  const event = String(body.event || body.type || "unknown");
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

  // Parse plan from reference ATS-{plan}-{ts}
  const planMatch = reference.match(/^ATS-(carrera|plus|out09_extra)-/i);
  const planHint = planMatch?.[1]?.toLowerCase() || null;

  await notifyOwnerTelegram(
    `Pago webhook: ${event} · ${status} · ${reference}${planHint ? ` · plan=${planHint}` : ""}`
  );

  const sb = createServiceSupabase();
  if (sb && status.toUpperCase() === "APPROVED") {
    await sb.from("audit_events").insert({
      kind: "payment_approved",
      detail: { reference, event, status, planHint },
    });
  }

  return NextResponse.json({
    ok: true,
    received: true,
    event,
    status,
    reference,
    planHint,
    // Cliente puede llamar /api/payments/activate con reference cuando haya sesión real
  });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Webhook pagos ATSAdvisor. Apunta Wompi aquí.",
    url: "/api/webhooks/payments",
  });
}
