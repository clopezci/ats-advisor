import { NextResponse } from "next/server";
import { applyPromotion, readSettings } from "@/lib/settings";
import { notifyOwnerTelegram } from "@/lib/notify/channels";
import { hydrateSettingsFromCloud } from "@/lib/settingsPersist";

export async function POST(req: Request) {
  await hydrateSettingsFromCloud();
  const body = await req.json().catch(() => ({}));
  const plan = String(body.plan || "carrera") as "carrera" | "plus" | "out09_extra";
  const email = String(body.email || "").trim();
  const coupon = String(body.coupon || "").trim();
  const preferred = String(body.provider || "auto");
  const settings = readSettings();
  const baseAmount = settings.pricing[plan] || settings.pricing.carrera;
  const priced = coupon ? applyPromotion(baseAmount, coupon, settings.promotions) : { amount: baseAmount, applied: null, discount: 0 };
  const amount = priced.amount;
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://ats-advisor-two.vercel.app";
  const reference = `ATS-${plan}-${Date.now()}`;

  const wompiPub = process.env.WOMPI_PUBLIC_KEY;
  const wompiPriv = process.env.WOMPI_PRIVATE_KEY;
  const mpToken = process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN;

  const wantMp = preferred === "mercadopago" || (preferred === "auto" && !wompiPub && !!mpToken);
  const wantWompi = preferred === "wompi" || (preferred === "auto" && !!wompiPub);

  if (wantMp && mpToken) {
    try {
      const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${mpToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          external_reference: reference,
          items: [
            {
              title: `ATSAdvisor ${plan}${priced.applied ? ` (${priced.applied})` : ""}`,
              quantity: 1,
              currency_id: "COP",
              unit_price: amount,
            },
          ],
          payer: email.includes("@") ? { email } : undefined,
          back_urls: {
            success: `${base}/precios?paid=1&provider=mp&plan=${plan}`,
            pending: `${base}/precios?paid=pending&provider=mp`,
            failure: `${base}/precios?paid=0&provider=mp`,
          },
          auto_return: "approved",
          notification_url: `${base}/api/webhooks/payments`,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        return NextResponse.json(
          { error: data.message || "Mercado Pago rechazó la preferencia", detail: data },
          { status: 502 }
        );
      }
      await notifyOwnerTelegram(
        `Checkout MP: ${plan} ${amount} COP (base ${baseAmount}${priced.applied ? ` · cupón ${priced.applied}` : ""}) · ${email || "sin email"} · ${reference}`
      );
      return NextResponse.json({
        ok: true,
        mode: "mercadopago",
        reference,
        plan,
        amount,
        baseAmount,
        coupon: priced.applied,
        discount: priced.discount,
        currency: "COP",
        initPoint: data.init_point || data.sandbox_init_point,
        preferenceId: data.id,
      });
    } catch {
      return NextResponse.json({ error: "No se pudo crear preferencia Mercado Pago" }, { status: 500 });
    }
  }

  if (wantWompi && wompiPub && wompiPriv) {
    await notifyOwnerTelegram(
      `Checkout Wompi: ${plan} ${amount} COP${priced.applied ? ` · cupón ${priced.applied}` : ""} · ${email || "sin email"} · ${reference}`
    );
    return NextResponse.json({
      ok: true,
      mode: "wompi",
      publicKey: wompiPub,
      reference,
      amountInCents: amount * 100,
      currency: "COP",
      plan,
      baseAmount,
      coupon: priced.applied,
      discount: priced.discount,
      redirectUrl: `${base}/precios?paid=1&plan=${plan}`,
    });
  }

  return NextResponse.json({
    ok: false,
    mode: "demo",
    message:
      "Sin Wompi ni Mercado Pago. Agrega WOMPI_* o MP_ACCESS_TOKEN en Vercel (MANUAL-ACCIONES.md).",
    amount,
    baseAmount,
    coupon: priced.applied,
    discount: priced.discount,
    currency: settings.pricing.currency,
    plan,
    providersAvailable: {
      wompi: Boolean(wompiPub && wompiPriv),
      mercadopago: Boolean(mpToken),
    },
  });
}
