import type { ReactNode } from "react";
import Link from "next/link";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 pb-8 pt-5">
      <header className="mb-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ background: "var(--brand)", boxShadow: "var(--shadow-brand)" }}
          >
            A
          </span>
          <div>
            <div className="text-base font-semibold tracking-tight">ATSAdvisor</div>
            <div className="text-xs muted">by LOTIC</div>
          </div>
        </Link>
        <nav className="flex items-center gap-3 text-sm muted">
          <Link href="/tracker" className="hover:opacity-80">
            Tracker
          </Link>
          <Link href="/precios" className="hover:opacity-80">
            Precios
          </Link>
          <Link href="/auth" className="hover:opacity-80">
            Entrar
          </Link>
          <Link href="/cuenta" className="hover:opacity-80">
            Cuenta
          </Link>
        </nav>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
      <footer
        className="mt-10 space-y-2 border-t pt-4 text-center text-xs muted"
        style={{ borderColor: "var(--border)" }}
      >
        <nav className="flex flex-wrap justify-center gap-x-3 gap-y-1">
          <Link href="/legal/privacidad">Privacidad</Link>
          <Link href="/legal/terminos">Términos</Link>
          <Link href="/legal/cookies">Cookies</Link>
          <Link href="/legal/contacto">Contacto</Link>
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
