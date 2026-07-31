import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";

export const metadata = { title: "Mi cuenta" };

const COPY =
  "Aquí administrarás tu perfil, contraseña, suscripción, Habeas Data y baja. La autenticación se conecta en la siguiente fase.";

export default function CuentaPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] muted">Cuenta · F0</p>
            <h1 className="mt-1 text-2xl font-semibold">Mi cuenta</h1>
          </div>
          <SpeakButton text={COPY} />
        </div>
        <p className="muted text-sm leading-relaxed">{COPY}</p>
      </section>

      <div className="flex flex-col gap-3">
        <button type="button" className="btn-primary" disabled>
          Iniciar sesión (próximamente)
        </button>
        <Link href="/" className="btn-secondary">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
