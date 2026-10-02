import { setPlan, type PlanId } from "@/lib/entitlements";
import { grantPsicoPractica, revokePsicoPractica } from "@/lib/psicotecnicas/practicaAccess";

/**
 * Al entrar con correo: aplica plan cloud / tester / dueño.
 * Dueño y tester reciben plan Tester, pero NO práctica psicotécnica automática.
 * Práctica ilimitada solo con whitelist admin (psico_practica_emails) o compra del add-on.
 */
export async function applySessionPrivileges(email: string): Promise<PlanId | null> {
  const em = email.trim().toLowerCase();
  if (!em.includes("@")) return null;

  try {
    const [entRes, testerRes] = await Promise.all([
      fetch(`/api/entitlements?email=${encodeURIComponent(em)}`),
      fetch(`/api/testers/check?email=${encodeURIComponent(em)}`),
    ]);
    const ent = entRes.ok ? await entRes.json() : null;
    const tester = testerRes.ok ? await testerRes.json() : null;

    const elevated = Boolean(
      tester?.tester || tester?.owner || ent?.source === "owner" || ent?.source === "tester"
    );
    const psicoWhitelist = Boolean(tester?.psicoPractica);
    const psicoPaid = Boolean(
      ent?.plan === "psico_practica" ||
        ent?.psico_practica ||
        ent?.addons?.psico_practica ||
        ent?.cloud?.plan === "psico_practica"
    );

    if (psicoWhitelist || psicoPaid) {
      try {
        grantPsicoPractica(psicoWhitelist ? 90 : 31);
      } catch {
        /* ignore */
      }
    } else if (elevated) {
      // Dueño/tester sin permiso explícito: quitar grant automático viejo.
      try {
        revokePsicoPractica();
      } catch {
        /* ignore */
      }
    }

    if (elevated) {
      setPlan("tester", "admin");
      return "tester";
    }
    if (ent?.plan && ["carrera", "plus", "tester"].includes(ent.plan)) {
      setPlan(ent.plan as PlanId, "webhook");
      return ent.plan as PlanId;
    }
  } catch {
    /* ignore */
  }
  return null;
}
