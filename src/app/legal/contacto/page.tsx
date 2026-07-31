import Link from "next/link";

export const metadata = { title: "Contacto" };

export default function ContactoPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Contacto</h1>
      <div className="bento-card text-sm muted leading-relaxed space-y-2">
        <p>LOTIC Soluciones</p>
        <p>
          GitHub owner:{" "}
          <a className="underline" href="mailto:clpezci@gmail.com">
            clpezci@gmail.com
          </a>
        </p>
        <p>
          Sitio:{" "}
          <a className="underline" href="https://lotic-soluciones.vercel.app/" target="_blank" rel="noreferrer">
            lotic-soluciones.vercel.app
          </a>
        </p>
      </div>
      <Link href="/" className="btn-secondary inline-flex">
        Volver
      </Link>
    </div>
  );
}
