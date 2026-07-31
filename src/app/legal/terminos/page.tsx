import Link from "next/link";

export const metadata = { title: "Términos" };

export default function TerminosPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Términos de uso</h1>
      <div className="bento-card text-sm muted leading-relaxed">
        ATSAdvisor es una herramienta de apoyo a la búsqueda de empleo. No garantiza contratación.
        El análisis ATS y el outplacement son orientativos. Versión F0 — texto legal completo en
        fases siguientes.
      </div>
      <Link href="/" className="btn-secondary inline-flex">
        Volver
      </Link>
    </div>
  );
}
