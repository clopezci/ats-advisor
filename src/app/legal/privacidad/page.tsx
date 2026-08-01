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
          <strong>Responsable:</strong> LOTIC Soluciones · contacto en /legal/contacto.
        </p>
        <p>
          <strong>Datos que puedes aportar:</strong> nombre, correo, CV/texto, preferencias de canal,
          progreso de cursos, postulaciones y pagos.
        </p>
        <p>
          <strong>Finalidad:</strong> análisis ATS, outplacement, microlearning, soporte, facturación y
          mejora del servicio. No vendemos tu CV.
        </p>
        <p>
          <strong>Base:</strong> consentimiento y ejecución del servicio. Puedes retirar el
          consentimiento y ejercer acceso, rectificación, cancelación y oposición.
        </p>
        <p>
          <strong>Exportación y baja:</strong> en /cuenta puedes descargar un JSON completo (Habeas
          Data) y borrar datos locales. Con Supabase/Resend activos también se procesa solicitud por
          correo al responsable.
        </p>
        <p>
          <strong>Encargados:</strong> Vercel (hosting), Supabase (auth/DB si activado), Resend
          (email), proveedores de IA configurados, Wompi/Mercado Pago (pagos), Telegram/WhatsApp
          (canales opcionales).
        </p>
        <p className="muted text-xs">Última actualización: 2026-07-31.</p>
      </section>
      <Link href="/" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
