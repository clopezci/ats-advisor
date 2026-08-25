import Link from "next/link";

export const metadata = { title: "Privacidad · ATSAdvisor" };

export default function PrivacidadPage() {
  return (
    <div className="flex flex-1 flex-col gap-5 prose-sm">
      <h1 className="text-2xl font-semibold">Política de privacidad</h1>
      <section className="bento-card space-y-3 text-sm leading-relaxed">
        <p>
          ATSAdvisor (LOTIC Soluciones) trata datos personales conforme a la Ley 1581 de 2012 (Habeas
          Data) y normas aplicables en Colombia / LATAM.
        </p>
        <p>
          <strong>Responsable:</strong> LOTIC Soluciones · contacto en{" "}
          <Link href="/legal/contacto">/legal/contacto</Link>.
        </p>
        <p>
          <strong>Datos que puedes aportar:</strong> nombre, correo, CV/texto, preferencias de canal,
          progreso de cursos, postulaciones y pagos.
        </p>
        <p>
          <strong>Finalidad:</strong> análisis ATS, outplacement, microlearning, soporte, facturación,
          mejora del servicio y, en el plan gratuito, mostrar anuncios propios (LOTIC) o de
          operadores de publicidad configurados.
        </p>
        <p>
          <strong>Publicidad y terceros:</strong> En páginas free podemos mostrar{" "}
          <em>anuncios propios</em> (p. ej. ArriendoSeguro y otras apps LOTIC) y/o anuncios de
          redes como Google AdSense u otros operadores que configures. Terceros pueden colocar y
          leer cookies, usar web beacons o identificadores (incl. dirección IP) para servir anuncios
          y medir rendimiento. Sobre el uso de datos por Google cuando hay AdSense, consulta:{" "}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            target="_blank"
            rel="noopener noreferrer"
          >
            Cómo usa Google los datos en sitios o apps de partners
          </a>
          .
        </p>
        <p>
          <strong>Base:</strong> consentimiento y ejecución del servicio. Puedes retirar el
          consentimiento (banner de cookies → solo esenciales) y ejercer acceso, rectificación,
          cancelación y oposición.
        </p>
        <p>
          <strong>Exportación y baja:</strong> en /cuenta puedes descargar un ZIP/JSON (Habeas Data)
          y solicitar borrado local + cloud. Con Resend activos también se envía copia por correo.
        </p>
        <p>
          <strong>Encargados:</strong> Vercel (hosting), Supabase (auth/DB), Resend (email),
          proveedores de IA configurados, Wompi/Mercado Pago (pagos), Telegram/WhatsApp (canales
          opcionales), Google / otros operadores de anuncios si están activos.
        </p>
        <p>
          Más detalle de cookies: <Link href="/legal/cookies">/legal/cookies</Link>. Quiénes
          somos: <Link href="/legal/quienes-somos">/legal/quienes-somos</Link>.
        </p>
        <p className="muted text-xs">Última actualización: 2026-08-25.</p>
        <p className="text-xs muted leading-relaxed">
          El uso del servicio implica orientación educativa; límites de responsabilidad y naturaleza
          del producto están en{" "}
          <Link href="/legal/terminos" style={{ color: "var(--brand)" }}>
            Términos de uso
          </Link>
          .
        </p>
      </section>
      <Link href="/" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
