import Link from "next/link";

export const metadata = { title: "Contacto · ATSAdvisor" };

export default function ContactoPage() {
  return (
    <div className="flex flex-1 flex-col gap-5">
      <h1 className="text-2xl font-semibold">Contacto</h1>
      <section className="bento-card space-y-3 text-sm leading-relaxed">
        <p>
          <strong>Producto:</strong> ATSAdvisor by LOTIC Soluciones
        </p>
        <p>
          <strong>Soporte / Habeas Data:</strong> usa /feedback o el correo del owner configurado en
          el despliegue (ADMIN_EMAIL).
        </p>
        <p>
          <strong>Empresas / RH:</strong> portal /empresa para licencias de outplacement.
        </p>
        <p>
          También puedes escribir desde el formulario de feedback; si Telegram owner está activo,
          llega al instante.
        </p>
      </section>
      <Link href="/feedback" className="btn-primary">
        Enviar feedback
      </Link>
      <Link href="/" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
