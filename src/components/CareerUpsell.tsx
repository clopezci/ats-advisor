import Link from "next/link";

/**
 * Soft-sell a Carrera: valor de mercado vs fracción del precio.
 * Usar en herramientas gratis sin tapar el valor inmediato.
 */
export function CareerUpsell({
  context = "Para ahondar en tu búsqueda completa (mapa, red, entrevistas y oferta)",
  nextHref = "/outplacement/cuadernillo",
}: {
  context?: string;
  nextHref?: string;
}) {
  const precios = `/precios?plan=carrera&next=${encodeURIComponent(nextHref)}`;

  return (
    <section
      className="bento-card space-y-2"
      style={{ borderColor: "var(--brand)", background: "rgba(124,58,237,0.04)" }}
    >
      <p className="text-xs uppercase tracking-[0.12em] muted">Plan Carrera</p>
      <p className="text-sm leading-relaxed">
        {context}: el acompañamiento cuesta una{" "}
        <strong>mínima fracción</strong> de lo que suele valer un outplacement
        empresarial en el mercado — misma idea de guía, al alcance de una persona.
      </p>
      <Link href={precios} className="btn-primary">
        Ver plan Carrera
      </Link>
      <Link href="/ats" className="text-center text-sm muted">
        Seguir con el analizador gratis
      </Link>
    </section>
  );
}
