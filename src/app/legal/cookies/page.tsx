import Link from "next/link";

export const metadata = { title: "Cookies · ATSAdvisor" };

export default function CookiesPage() {
  return (
    <div className="flex flex-1 flex-col gap-5">
      <h1 className="text-2xl font-semibold">Cookies</h1>
      <section className="bento-card space-y-3 text-sm leading-relaxed">
        <p>
          Usamos almacenamiento local del navegador (y cookies técnicas si el hosting las requiere)
          para sesión, preferencias, progreso, tracker y consentimiento.
        </p>
        <p>
          <strong>Esenciales:</strong> funcionamiento de la PWA, auth (si Supabase), seguridad.
        </p>
        <p>
          <strong>Preferencias:</strong> canal de aprendizaje, onboarding, racha, plan local demo.
        </p>
        <p>
          <strong>Analítica / ads:</strong> solo si activas consentimiento y hay AdSense u otras
          herramientas configuradas.
        </p>
        <p>
          Puedes limpiar datos en /cuenta (Habeas Data) o desde la configuración del navegador.
        </p>
      </section>
      <Link href="/" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
