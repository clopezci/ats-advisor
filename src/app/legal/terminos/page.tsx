import Link from "next/link";
import {
  BANDS_DISCLAIMER,
  SALARY_LEGAL_NOTICE,
  SERVICE_NATURE_SHORT,
} from "@/lib/legal/notices";

export const metadata = { title: "Términos · ATSAdvisor" };

const UPDATED = "2026-08-25";

export default function TerminosPage() {
  return (
    <div className="flex flex-1 flex-col gap-5">
      <h1 className="text-2xl font-semibold">Términos de uso</h1>
      <section className="bento-card space-y-4 text-sm leading-relaxed">
        <p className="text-xs muted">Última actualización: {UPDATED}</p>

        <div className="space-y-2">
          <h2 className="font-semibold text-base">1. Aceptación</h2>
          <p>
            Al acceder o usar ATSAdvisor (producto de LOTIC Soluciones), aceptas estos Términos de
            uso y la{" "}
            <Link href="/legal/privacidad" style={{ color: "var(--brand)" }}>
              Política de privacidad
            </Link>
            . Si no estás de acuerdo, no uses el servicio.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-semibold text-base">2. Naturaleza del servicio</h2>
          <p>{SERVICE_NATURE_SHORT}</p>
          <p>
            El contenido, las herramientas (incluido el analizador ATS), los cursos, el cuadernillo
            de carrera, los rangos salariales, las plantillas, los coaches con IA y cualquier
            material relacionado se ofrecen con fines <strong>informativos, educativos y de
            orientación</strong> en la búsqueda de empleo y el desarrollo profesional.
          </p>
          <p>
            <strong>No</strong> constituimos ni sustituimos: asesoría jurídica o laboral formal;
            asesoría tributaria o contable; asesoría financiera regulada; diagnóstico o tratamiento
            psicológico o psiquiátrico; intermediación de empleo; ni representación ante empleadores,
            autoridades o terceros.
          </p>
          <p>
            Para decisiones con impacto legal, contractual, fiscal, de salud o de negociación
            compleja, debes consultar un profesional habilitado en la jurisdicción correspondiente.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-semibold text-base">3. Sin garantía de resultados</h2>
          <p>
            El uso de ATSAdvisor <strong>no garantiza</strong> empleo, entrevistas, ofertas,
            salarios, aceptación de CV por sistemas ATS de terceros, ni ningún resultado concreto.
            Los puntajes, probabilidad de entrevista, “encaje”, bandas salariales y recomendaciones
            son <strong>orientativos</strong> y pueden diferir de lo que haga un empleador o un
            software de reclutamiento real.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-semibold text-base">4. Bandas salariales e información de mercado</h2>
          <p>{SALARY_LEGAL_NOTICE}</p>
          <p className="text-xs muted">{BANDS_DISCLAIMER}</p>
          <p>
            Los rangos pueden actualizarse periódicamente (por ejemplo, mediante factores de ajuste).
            Eso no convierte la información en una encuesta oficial ni en un dato vinculante para
            ninguna empresa.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-semibold text-base">5. Analizador ATS y herramientas gratuitas</h2>
          <p>
            Las herramientas gratuitas (entre otras: analizador ATS, encaje rápido, tracker,
            checklist de CV y bandas salariales) pueden estar sujetas a límites de uso, disponibilidad
            y, en el futuro, anuncios. El análisis ATS es una estimación basada en reglas y modelos
            propios frente al texto que tú aportas; no reproduce de forma exacta el comportamiento de
            Workday, Greenhouse, Taleo u otros sistemas de terceros.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-semibold text-base">6. Plan Carrera y contenidos de acompañamiento</h2>
          <p>
            El plan Carrera y add-ons (según{" "}
            <Link href="/precios" style={{ color: "var(--brand)" }}>
              /precios
            </Link>
            ) dan acceso a acompañamiento digital, cursos, cuadernillo y herramientas adicionales.
            Sigue siendo orientación educativa: no es outplacement presencial corporativo ni contrato
            de colocación laboral. Los pagos se procesan vía proveedores como Wompi o Mercado Pago.
            Activaciones demo o planes locales de prueba no sustituyen un pago real verificado.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-semibold text-base">7. Inteligencia artificial</h2>
          <p>
            Las respuestas generadas por IA pueden contener errores, omisiones o generalizaciones.
            Eres el único responsable de revisar, editar y validar cualquier texto (CV, carta,
            mensajes, respuestas de entrevista) antes de usarlo. Queda prohibido inventar experiencia,
            títulos, fechas, habilidades o logros. ATSAdvisor no se hace responsable por
            declaraciones falsas que el usuario publique o presente a terceros.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-semibold text-base">8. Bienestar y marco laboral (Colombia / LATAM)</h2>
          <p>
            Cualquier checklist o guía sobre liquidación, derechos laborales, bienestar o transición
            es <strong>educativa y general</strong>. No constituye concepto jurídico, ni dictamen de
            la UGPP, MinTrabajo u otra autoridad. Los marcos legales cambian; verifica la norma
            vigente o consulta un abogado laboral cuando tu caso lo requiera.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-semibold text-base">9. Responsabilidad del usuario</h2>
          <ul className="list-disc pl-5 space-y-1 muted">
            <li>Proporcionar información veraz en la medida de lo posible.</li>
            <li>No compartir credenciales ni abusar del servicio (spam, fraude, scraping abusivo).</li>
            <li>Cumplir la ley aplicable al usar el contenido generado.</li>
            <li>Mantener copias de seguridad de tu CV y datos que consideres críticos.</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h2 className="font-semibold text-base">10. Limitación de responsabilidad</h2>
          <p>
            En la máxima medida permitida por la ley aplicable, LOTIC Soluciones y ATSAdvisor
            entregan el servicio “tal cual” y “según disponibilidad”, sin garantías expresas o
            implícitas de comerciabilidad, idoneidad para un fin particular o no infracción. No
            seremos responsables por daños indirectos, lucro cesante, pérdida de oportunidad laboral,
            decisiones de negociación basadas en rangos orientativos, ni por actos u omisiones de
            empleadores, portales de empleo o sistemas ATS de terceros.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-semibold text-base">11. Cuentas y suspensión</h2>
          <p>
            Podemos suspender o limitar el acceso ante abuso, fraude de pagos, incumplimiento de
            estos términos o riesgo para la seguridad del servicio.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-semibold text-base">12. Cambios</h2>
          <p>
            Podemos actualizar estos términos. La fecha de “Última actualización” indica la versión
            vigente. El uso continuado después de un cambio implica aceptación de la nueva versión,
            salvo que la ley exija un consentimiento distinto.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-semibold text-base">13. Contacto</h2>
          <p>
            Consultas:{" "}
            <Link href="/legal/contacto" style={{ color: "var(--brand)" }}>
              /legal/contacto
            </Link>
            . Quiénes somos:{" "}
            <Link href="/legal/quienes-somos" style={{ color: "var(--brand)" }}>
              /legal/quienes-somos
            </Link>
            .
          </p>
        </div>
      </section>
      <Link href="/" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
