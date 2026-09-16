import { NextResponse } from "next/server";
import type { PremiumSalaryResult } from "@/lib/salary/premiumTypes";
import {
  JOBICY_DEFAULT_COUNTRY,
  isJobicyCountry,
  jobicyCountryCode,
} from "@/lib/salary/jobicyIntl";
import { getJobicyCached, setJobicyCached } from "@/lib/salary/jobicyCache";
import { recordJobicyLookup } from "@/lib/salary/jobicyWallet";

/**
 * Validación salarial internacional (Jobicy).
 * Pricing: request_cost en respuesta ($0.109 o $0 repeat). Cache 30 días + updated_at.
 * Docs: https://jobicy.com/salary-api
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const role = (url.searchParams.get("role") || "").trim().slice(0, 80);
  const countryRaw = (url.searchParams.get("country") || JOBICY_DEFAULT_COUNTRY).trim();

  if (role.length < 3) {
    return NextResponse.json({ error: "Indica un cargo (role) de al menos 3 caracteres." }, { status: 400 });
  }

  if (!isJobicyCountry(countryRaw)) {
    const body: PremiumSalaryResult = {
      source: "unavailable",
      role,
      country: countryRaw,
      message:
        "Jobicy no cubre ese país (Colombia y LATAM no están disponibles). Elige un país de la lista internacional. No descuentes crédito.",
    };
    return NextResponse.json(body, { status: 400 });
  }

  const country = countryRaw;
  const countryParam = jobicyCountryCode(country);
  const key = process.env.JOBICY_API_KEY || process.env.SALARY_API_KEY || "";
  if (!key) {
    const body: PremiumSalaryResult = {
      source: "unavailable",
      role,
      country,
      message:
        "Validación internacional no configurada en el servidor (falta JOBICY_API_KEY). Usa la matriz Colombia gratuita.",
    };
    return NextResponse.json(body);
  }

  try {
    const cached = await getJobicyCached(role, country);
    if (cached && cached.source === "jobicy") {
      try {
        await recordJobicyLookup({
          role: cached.role,
          country: cached.country,
          billable: false,
          costUsd: 0,
        });
      } catch {
        /* ignore */
      }
      return NextResponse.json(cached);
    }

    const endpoint =
      process.env.JOBICY_SALARY_URL ||
      `https://jobicy.com/api/v2/salary?title=${encodeURIComponent(role)}&country=${encodeURIComponent(countryParam)}`;

    const res = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${key}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      const lowBalance = /balance|insufficient|wallet|fund/i.test(errText);
      const status = res.status === 429 ? 429 : res.status === 401 ? 401 : 502;
      return NextResponse.json(
        {
          source: "unavailable",
          role,
          country,
          message: lowBalance
            ? "Wallet Jobicy sin saldo. Fondea en el dashboard y registra el monto con /jobicy_fondeo N. No descuentes crédito."
            : res.status === 429
              ? "Jobicy rate limit (máx. 10 req/s). Espera un momento. No descuentes crédito."
              : res.status === 401
                ? "API key Jobicy inválida o expirada. No descuentes crédito."
                : `El proveedor internacional no respondió (${res.status}). No descuentes crédito e inténtalo luego.`,
          rawNote: errText.slice(0, 200),
        } satisfies PremiumSalaryResult,
        { status }
      );
    }

    const data = (await res.json()) as Record<string, unknown>;
    if (data.success === false) {
      return NextResponse.json({
        source: "unavailable",
        role,
        country,
        message:
          String(data.message || data.error || "Jobicy rechazó la consulta.") +
          " No descuentes crédito.",
        rawNote: JSON.stringify(data).slice(0, 300),
      } satisfies PremiumSalaryResult);
    }

    const min = num(data.min ?? data.salary_min ?? nested(data, "salary_tiers", "middle", "min"));
    const max = num(data.max ?? data.salary_max ?? nested(data, "salary_tiers", "middle", "max"));
    const median = num(data.median ?? data.salary_median ?? nested(data, "salary_tiers", "middle", "median"));
    const currency = String(data.currency || "USD");
    const confidence = num(data.confidence);
    const updatedAt = String(data.updated_at || data.updatedAt || "");
    const requestCost = num(data.request_cost ?? data.requestCost);
    const billable = requestCost == null ? true : requestCost > 0;
    const costLabel =
      requestCost == null
        ? "~$0.109 (estimado)"
        : requestCost > 0
          ? `$${requestCost}`
          : "$0 (unchanged repeat)";

    const body: PremiumSalaryResult = {
      source: "jobicy",
      role: String(data.job_title || data.position || role),
      country: String(data.country || country),
      currency,
      min: min ?? undefined,
      median: median ?? undefined,
      max: max ?? undefined,
      confidence: confidence ?? undefined,
      updatedAt: updatedAt || undefined,
      cached: false,
      billable,
      message:
        `Validación internacional (Jobicy · ${costLabel}` +
        (updatedAt ? ` · updated_at ${updatedAt}` : "") +
        "). Orientativo; no es banda Colombia. Compáralo con tu matriz local.",
    };

    if (body.min == null && body.median == null && body.max == null) {
      return NextResponse.json({
        source: "unavailable",
        role,
        country,
        message:
          "Jobicy no trajo rangos para ese cargo/país. Prueba otro título en inglés o otro país de la lista. No descuentes crédito.",
        rawNote: JSON.stringify(data).slice(0, 300),
      } satisfies PremiumSalaryResult);
    }

    try {
      await setJobicyCached(role, country, body);
      await recordJobicyLookup({
        role: body.role,
        country: body.country,
        billable,
        costUsd: requestCost ?? undefined,
      });
    } catch {
      /* no bloquees la respuesta al usuario */
    }

    return NextResponse.json(body);
  } catch (e) {
    return NextResponse.json(
      {
        source: "unavailable",
        role,
        country,
        message: e instanceof Error ? e.message : "Error al consultar validación internacional.",
      } satisfies PremiumSalaryResult,
      { status: 500 }
    );
  }
}

function num(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() && !Number.isNaN(Number(v))) return Number(v);
  return null;
}

function nested(obj: Record<string, unknown>, ...keys: string[]): unknown {
  let cur: unknown = obj;
  for (const k of keys) {
    if (!cur || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[k];
  }
  return cur;
}
