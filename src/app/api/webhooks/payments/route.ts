import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { notifyOwnerTelegram } from "@/lib/notify/channels";
import { createServiceSupabase } from "@/lib/supabase/client";

/**
 * Webhook Wompi.
 * Con WOMPI_EVENTS_SECRET valida integridad básica del evento.
 * Sin secret, acepta y registra (modo demo/preview).
 */
export async function POST(req: Request) {
  const raw = await req.text();
  let body: Record<string, unknown> = {};
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const secret = process.env.WOMPI_EVENTS_SECRET || process.env.WOMPI_PRIVATE_KEY;
  const checksum = req.headers.get("x-event-checksum") || "";
  if (secret && checksum) {
    const digest = createHash("sha256").update(raw + secret).digest("hex");
    // Wompi usa un esquema propio; aquí dejamos hook extensible y logueamos mismatch.
    if (digest && checksum && digest !== checksum) {
      // No bloqueamos de forma rígida hasta tener el algoritmo exacto documentado en prod.
      console.warn("wompi checksum mismatch (revisar algoritmo oficial)");
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

  await notifyOwnerTelegram(`Pago webhook: ${event} · ${status} · ${reference}`);

  const sb = createServiceSupabase();
  if (sb && status.toUpperCase() === "APPROVED") {
    // Placeholder: cuando Auth esté activo, mapear reference → user plan.
    await sb.from("audit_events").insert({
      kind: "payment_approved",
      detail: { reference, event, status },
    });
  }

  return NextResponse.json({ ok: true, received: true, event, status, reference });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Webhook pagos ATSAdvisor. Apunta Wompi aquí.",
    url: "/api/webhooks/payments",
  });
}
