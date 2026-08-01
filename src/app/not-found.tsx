import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <h1 className="text-xl font-semibold">Página no encontrada</h1>
      <p className="text-sm muted">Esa ruta no existe o se movió. Vuelve al inicio o al mapa de capacidades.</p>
      <Link href="/" className="btn-primary text-center">
        Ir al inicio
      </Link>
      <Link href="/capacidades" className="btn-secondary text-center">
        Ver capacidades
      </Link>
    </div>
  );
}
