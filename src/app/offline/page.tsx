import Link from "next/link";

export const metadata = { title: "Sin conexión" };

export default function OfflinePage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <h1 className="text-xl font-semibold">Sin conexión</h1>
      <p className="text-sm muted">
        Estás offline. Algunas pantallas cacheadas pueden seguir funcionando. Reintenta cuando vuelva
        la red.
      </p>
      <Link href="/" className="btn-primary">
        Reintentar inicio
      </Link>
    </div>
  );
}
