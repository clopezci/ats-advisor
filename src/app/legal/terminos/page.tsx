import Link from "next/link";

export const metadata = { title: "Términos · ATSAdvisor" };

export default function TerminosPage() {
  return (
    <div className="flex flex-1 flex-col gap-5">
      <h1 className="text-2xl font-semibold">Términos de uso</h1>
      <section className="bento-card space-y-3 text-sm leading-relaxed">
        <p>
          Al usar ATSAdvisor aceptas estos términos. El servicio se ofrece “tal cual” durante la fase
          de construcción, con mejoras continuas.
        </p>
        <p>
          <strong>ATS gratis:</strong> sujeto a límites diarios y, en el futuro, anuncios. No garantiza
          empleo ni entrevistas.
        </p>
        <p>
          <strong>Planes de pago:</strong> Carrera / Plus / curso a tu medida extra según /precios. Los pagos se
          procesan vía Wompi o Mercado Pago. Activaciones demo locales no sustituyen un pago real.
        </p>
        <p>
          <strong>IA:</strong> las sugerencias pueden errar. Eres responsable de no inventar
          experiencia en CV o entrevistas.
        </p>
        <p>
          <strong>Contenido:</strong> outplacement y blog son informativos, no asesoría jurídica ni
          psicológica clínica.
        </p>
        <p>
          <strong>Cuentas:</strong> no compartas accesos. Podemos suspender abuso (rate limits, fraude
          de pagos, spam).
        </p>
        <p className="muted text-xs">Última actualización: 2026-07-31.</p>
      </section>
      <Link href="/" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
