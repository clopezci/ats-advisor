import type { ReactNode } from "react";
import Link from "next/link";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 pb-8 pt-5">
      <a
        href="#contenido-principal"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:shadow-md"
        style={{ color: "var(--brand)" }}
      >
        Saltar al contenido
      </a>
      <header className="mb-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="" width={36} height={36} className="h-9 w-9 rounded-full" />
          <div>
            <div className="text-base font-semibold tracking-tight">ATSAdvisor</div>
            <div className="text-xs muted">by LOTIC</div>
          </div>
        </Link>
        <nav className="flex items-center gap-3 text-sm muted" aria-label="Principal">
          <Link href="/capacidades" className="hover:opacity-80">
            Mapa
          </Link>
          <Link href="/tracker" className="hover:opacity-80">
            Tracker
          </Link>
          <Link href="/precios" className="hover:opacity-80">
            Precios
          </Link>
          <Link href="/cuenta" className="hover:opacity-80">
            Cuenta
          </Link>
        </nav>
      </header>
      <main id="contenido-principal" className="flex flex-1 flex-col">
        {children}
      </main>
      <footer
        className="mt-10 space-y-2 border-t pt-4 text-center text-xs muted"
        style={{ borderColor: "var(--border)" }}
      >
        <nav className="flex flex-wrap justify-center gap-x-3 gap-y-1">
          <Link href="/legal/privacidad">Privacidad</Link>
          <Link href="/legal/terminos">Términos</Link>
          <Link href="/legal/cookies">Cookies</Link>
          <Link href="/legal/contacto">Contacto</Link>
          <Link href="/legal/quienes-somos">Quiénes somos</Link>
          <Link href="/capacidades">Capacidades</Link>
          <Link href="/empresa">Empresas</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/herramientas">Herramientas</Link>
        </nav>
        <p>© {new Date().getFullYear()} LOTIC Soluciones</p>
      </footer>
    </div>
  );
}
