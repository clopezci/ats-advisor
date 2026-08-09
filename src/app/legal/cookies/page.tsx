import Link from "next/link";

export const metadata = { title: "Cookies · ATSAdvisor" };

export default function CookiesPage() {
  return (
    <div className="flex flex-1 flex-col gap-5">
      <h1 className="text-2xl font-semibold">Cookies y almacenamiento</h1>
      <section className="bento-card space-y-3 text-sm leading-relaxed">
        <p>
          Usamos almacenamiento local del navegador (y cookies técnicas del hosting) para sesión,
          preferencias, progreso, tracker y consentimiento.
        </p>
        <p>
          <strong>Esenciales:</strong> funcionamiento de la PWA, auth (Supabase), seguridad y
          preferencia de cookies.
        </p>
        <p>
          <strong>Preferencias:</strong> canal de aprendizaje, onboarding, racha, plan local.
        </p>
        <p>
          <strong>Publicidad:</strong> si aceptas cookies (no solo esenciales) y el flag de ads
          está activo, podemos cargar:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Anuncios propios LOTIC</strong> (house): p. ej. ArriendoSeguro — no requieren
            cookies de terceros.
          </li>
          <li>
            <strong>Google AdSense</strong> (si está configurado): cookies/identificadores de Google
            y partners para anuncios personalizados o no personalizados.
          </li>
          <li>
            <strong>Otros operadores</strong> (EthicalAds, Carbon, Media.net, etc.) vía{" "}
            <code>NEXT_PUBLIC_AD_OPERATOR=custom</code>.
          </li>
        </ul>
        <p>
          Política de privacidad: <Link href="/legal/privacidad">/legal/privacidad</Link>. Enlace
          Google partners:{" "}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            target="_blank"
            rel="noopener noreferrer"
          >
            policies.google.com/technologies/partner-sites
          </a>
          .
        </p>
        <p>
          Puedes elegir <em>Solo esenciales</em> en el banner (oculta ads de terceros) o limpiar
          datos en /cuenta.
        </p>
        <p className="muted text-xs">Última actualización: 2026-08-09.</p>
      </section>
      <Link href="/" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
