import { setPlan, type PlanId } from "@/lib/entitlements";
import { grantPsicoPractica } from "@/lib/psicotecnicas/practicaAccess";

/**
 * Al entrar con correo: aplica plan cloud / tester / dueño.
 * El dueño (ADMIN_EMAIL o clpezci@gmail.com) recibe plan Tester + práctica psicotécnica.
 * /admin sigue pidiendo ADMIN_SECRET.
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

    if (tester?.tester || tester?.owner || ent?.source === "owner" || ent?.source === "tester") {
      setPlan("tester", "admin");
      try {
        grantPsicoPractica(90);
      } catch {
        /* ignore */
      }
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
