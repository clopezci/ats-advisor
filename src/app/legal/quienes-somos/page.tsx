import Link from "next/link";

export const metadata = { title: "Quiénes somos · ATSAdvisor" };

export default function QuienesSomosPage() {
  return (
    <div className="flex flex-1 flex-col gap-5">
      <h1 className="text-2xl font-semibold">Quiénes somos</h1>
      <section className="bento-card space-y-3 text-sm leading-relaxed">
        <p>
          <strong>ATSAdvisor</strong> es un producto de <strong>LOTIC Soluciones</strong>: PWA
          mobile-first para pasar filtros ATS en español y reconstruir la carrera con outplacement
          digital a precio local (COP).
        </p>
        <p>
          Nacimos de la fricción del software de escritorio y de la brecha entre optimizadores caros
          en inglés y outplacement corporativo de millones de pesos.
        </p>
        <p>
          Principios: voz inclusiva, máximo 2 decisiones por pantalla, Habeas Data 1-click, y motor
          ATS propio. Ofrecemos <strong>orientación y herramientas educativas</strong> para la
          búsqueda de empleo; no reemplazamos asesoría jurídica, laboral, tributaria ni psicológica
          clínica. Detalle en{" "}
          <Link href="/legal/terminos" style={{ color: "var(--brand)" }}>
            Términos de uso
          </Link>
          .
        </p>
        <p>
          Contacto: /legal/contacto · Feedback: /feedback · Empresas RH: /empresa
        </p>
      </section>
      <Link href="/" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
