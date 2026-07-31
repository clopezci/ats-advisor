import type { ReactNode } from "react";
import Link from "next/link";

export const metadata = { title: "Privacidad" };

export default function PrivacidadPage() {
  return (
    <LegalShell title="Privacidad y Habeas Data">
      <p>
        ATSAdvisor (LOTIC Soluciones) tratará datos personales conforme a la Ley 1581 de 2012
        (Colombia) y buenas prácticas de seguridad. En fases siguientes podrás exportar o eliminar
        tus datos con un solo clic.
      </p>
    </LegalShell>
  );
}

function LegalShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div className="bento-card space-y-3 text-sm muted leading-relaxed">{children}</div>
      <Link href="/" className="btn-secondary inline-flex">
        Volver
      </Link>
    </div>
  );
}
