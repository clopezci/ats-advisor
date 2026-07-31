import Link from "next/link";

export const metadata = { title: "Cookies" };

export default function CookiesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Cookies</h1>
      <div className="bento-card text-sm muted leading-relaxed">
        Usamos cookies técnicas necesarias para la PWA y, en el plan gratuito, posibles cookies de
        medición/anuncios. Podrás gestionar preferencias cuando se active el banner de consentimiento.
      </div>
      <Link href="/" className="btn-secondary inline-flex">
        Volver
      </Link>
    </div>
  );
}
