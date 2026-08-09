import { NextResponse } from "next/server";
import { applyPromotion, readSettings, resolveWhatsappAddonCop } from "@/lib/settings";
import { notifyOwnerTelegram } from "@/lib/notify/channels";
import { hydrateSettingsFromCloud } from "@/lib/settingsPersist";
import { parseCheckoutPlan, clampText } from "@/lib/validation";
import { rateLimit, rateLimitedResponse } from "@/lib/api/rateLimit";
import { reportError } from "@/lib/observability";
import { recordPaymentIntent } from "@/lib/payments/entitlementsCloud";

export async function POST(req: Request) {
  const limited = rateLimit(req, "checkout", { limit: 15, windowMs: 60_000 });
  if (!limited.ok) return rateLimitedResponse(limited.retryAfterSec);

  try {
    await hydrateSettingsFromCloud();
    const body = await req.json().catch(() => ({}));
    const plan = parseCheckoutPlan(body.plan);
    if (!plan) {
      return NextResponse.json({ error: "Plan inválido" }, { status: 400 });
    }
    const email = clampText(body.email || "", 120).trim();
    const coupon = clampText(body.coupon || "", 40).trim();
    const preferred = String(body.provider || "auto");
    const channel = String(body.channel || "telegram");
    const settings = readSettings();
    const baseAmount = settings.pricing[plan];
    if (typeof baseAmount !== "number" || !Number.isFinite(baseAmount)) {
      return NextResponse.json({ error: "Precio de plan no configurado" }, { status: 500 });
    }
    const priced = coupon
      ? applyPromotion(baseAmount, coupon, settings.promotions)
      : { amount: baseAmount, applied: null, discount: 0 };
    const waAddon =
      channel === "whatsapp" && plan !== "out09_extra" && settings.features.whatsapp
        ? resolveWhatsappAddonCop(settings)
        : 0;
    const amount = priced.amount + waAddon;
    const base = process.env.NEXT_PUBLIC_APP_URL || "https://ats-advisor-two.vercel.app";
    const reference = `ATS-${plan}${waAddon ? "-WA" : ""}-${Date.now()}`;

    await recordPaymentIntent({
      reference,
      plan,
      email: email.includes("@") ? email : null,
      amount,
      provider: preferred,
      channel,
    });

    const wompiPub = process.env.WOMPI_PUBLIC_KEY;
    const wompiPriv = process.env.WOMPI_PRIVATE_KEY;
    const mpToken = process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN;

    const wantMp = preferred === "mercadopago" || (preferred === "auto" && !wompiPub && !!mpToken);
    const wantWompi = preferred === "wompi" || (preferred === "auto" && !!wompiPub);
    const titleExtra = waAddon ? ` + WhatsApp ${waAddon}` : "";

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
                title: `ATSAdvisor ${plan}${priced.applied ? ` (${priced.applied})` : ""}${titleExtra}`,
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
          `Checkout MP: ${plan} ${amount} COP (base ${baseAmount}${waAddon ? ` +WA ${waAddon}` : ""}${priced.applied ? ` · cupón ${priced.applied}` : ""}) · ${email || "sin email"} · ${reference}`
        );
        return NextResponse.json({
          ok: true,
          mode: "mercadopago",
          reference,
          plan,
          amount,
          baseAmount,
          whatsappAddon: waAddon,
          channel,
          email: email.includes("@") ? email : null,
          coupon: priced.applied,
          discount: priced.discount,
          currency: "COP",
          initPoint: data.init_point || data.sandbox_init_point,
          preferenceId: data.id,
        });
      } catch (e) {
        await reportError({ where: "api/payments/checkout:mp", error: e, notifyOwner: true });
        return NextResponse.json({ error: "No se pudo crear preferencia Mercado Pago" }, { status: 500 });
      }
    }

    if (wantWompi && wompiPub && wompiPriv) {
      await notifyOwnerTelegram(
        `Checkout Wompi: ${plan} ${amount} COP${waAddon ? ` +WA ${waAddon}` : ""}${priced.applied ? ` · cupón ${priced.applied}` : ""} · ${email || "sin email"} · ${reference}`
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
        whatsappAddon: waAddon,
        channel,
        email: email.includes("@") ? email : null,
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
      whatsappAddon: waAddon,
      channel,
      coupon: priced.applied,
      discount: priced.discount,
      currency: settings.pricing.currency,
      plan,
      providersAvailable: {
        wompi: Boolean(wompiPub && wompiPriv),
        mercadopago: Boolean(mpToken),
      },
    });
  } catch (e) {
    await reportError({ where: "api/payments/checkout", error: e, notifyOwner: true });
    return NextResponse.json({ error: "Checkout falló" }, { status: 500 });
  }
}
