/**
 * Pruebas de seguridad de las puertas que un visitante puede tocar.
 * No imprime secretos ni cuerpos con datos personales.
 * Run: npm run test:security
 */
import { rateLimit } from "../src/lib/api/rateLimit";
import { isAdminSecret } from "../src/lib/admin/auth";

type Fail = { name: string; detail: string };
const fails: Fail[] = [];
const passes: string[] = [];

function assert(name: string, cond: boolean, detail: string) {
  if (cond) passes.push(name);
  else fails.push({ name, detail });
}

function req(url: string, init?: RequestInit & { headers?: Record<string, string> }) {
  return new Request(url, init);
}

async function main() {
  const spoofA = req("http://local/api/ats/analyze", {
    headers: {
      "x-forwarded-for": "1.1.1.1, 9.9.9.9",
      "x-vercel-forwarded-for": "203.0.113.10",
    },
  });
  const spoofB = req("http://local/api/ats/analyze", {
    headers: {
      "x-forwarded-for": "8.8.8.8, 9.9.9.9",
      "x-vercel-forwarded-for": "203.0.113.10",
    },
  });
  const first = rateLimit(spoofA, "sec-spoof", { limit: 1, windowMs: 60_000 });
  const second = rateLimit(spoofB, "sec-spoof", { limit: 1, windowMs: 60_000 });
  assert("rate-limit ignora el IP inventado al inicio", first.ok === true && second.ok === false, "dos X-Forwarded-For distintos con el mismo IP de plataforma deben compartir cupo");

  const prevNode = process.env.NODE_ENV;
  const prevVercel = process.env.VERCEL_ENV;
  const prevAdmin = process.env.ADMIN_SECRET;
  process.env.NODE_ENV = "production";
  process.env.VERCEL_ENV = "production";
  delete process.env.ADMIN_SECRET;
  assert("admin cerrado si falta el secreto en producción", isAdminSecret("dev-admin") === false && isAdminSecret(null) === false, "dev-admin no abre producción");
  process.env.NODE_ENV = prevNode;
  if (prevVercel === undefined) delete process.env.VERCEL_ENV;
  else process.env.VERCEL_ENV = prevVercel;
  if (prevAdmin === undefined) delete process.env.ADMIN_SECRET;
  else process.env.ADMIN_SECRET = prevAdmin;

  const { POST: analyze } = await import("../src/app/api/ats/analyze/route");
  const short = await analyze(
    req("http://local/api/ats/analyze", {
      method: "POST",
      headers: { "content-type": "application/json", "x-vercel-forwarded-for": "203.0.113.20" },
      body: JSON.stringify({ cvText: "corto", jobText: "corto" }),
    })
  );
  const shortBody = await short.json();
  assert("análisis rechaza texto insuficiente", short.status === 400, `status ${short.status}`);
  assert(
    "el rechazo no trae stack",
    typeof shortBody.error === "string" && !/at\s+\S+\s+\(/.test(shortBody.error) && !shortBody.stack,
    String(shortBody.error || "")
  );

  const huge = "palabra ".repeat(20000);
  const over = await analyze(
    req("http://local/api/ats/analyze", {
      method: "POST",
      headers: { "content-type": "application/json", "x-vercel-forwarded-for": "203.0.113.21" },
      body: JSON.stringify({ cvText: huge, jobText: huge }),
    })
  );
  assert("análisis rechaza texto enorme", over.status === 400, `status ${over.status}`);

  const { POST: habeas } = await import("../src/app/api/account/habeas/route");
  const wipe = await habeas(
    req("http://local/api/account/habeas", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "persona@example.com", action: "wipe" }),
    })
  );
  assert("borrar datos exige sesión", wipe.status === 401, `status ${wipe.status}`);

  const { GET: adminGet } = await import("../src/app/api/admin/settings/route");
  const admin = await adminGet(
    req("http://local/api/admin/settings", { headers: { "x-admin-secret": "no-es-el-secreto" } })
  );
  assert("settings de admin rechaza secreto ajeno", admin.status === 401, `status ${admin.status}`);

  process.env.NODE_ENV = "production";
  process.env.VERCEL_ENV = "production";
  const prevWompi = process.env.WOMPI_EVENTS_SECRET;
  const prevSkip = process.env.WOMPI_CHECKSUM_MODE;
  delete process.env.WOMPI_EVENTS_SECRET;
  delete process.env.WOMPI_CHECKSUM_MODE;
  const { POST: pay } = await import("../src/app/api/webhooks/payments/route");
  const forged = await pay(
    req("http://local/api/webhooks/payments", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        event: "transaction.updated",
        data: { transaction: { reference: "ATS-carrera-forge", status: "APPROVED" } },
      }),
    })
  );
  const forgedBody = await forged.json();
  assert(
    "un pago inventado no activa un plan",
    forged.status === 503 || forgedBody.entitlement == null,
    `status ${forged.status}`
  );
  if (prevWompi === undefined) delete process.env.WOMPI_EVENTS_SECRET;
  else process.env.WOMPI_EVENTS_SECRET = prevWompi;
  if (prevSkip === undefined) delete process.env.WOMPI_CHECKSUM_MODE;
  else process.env.WOMPI_CHECKSUM_MODE = prevSkip;
  process.env.NODE_ENV = prevNode;
  if (prevVercel === undefined) delete process.env.VERCEL_ENV;
  else process.env.VERCEL_ENV = prevVercel;

  console.log(`\nSeguridad: ${passes.length} ok, ${fails.length} fallos`);
  for (const f of fails) console.log(`FAIL ${f.name} — ${f.detail}`);
  if (fails.length) process.exit(1);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : "error");
  process.exit(1);
});
