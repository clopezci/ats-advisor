"use client";

export function AdSlot({ slot = "ats-free" }: { slot?: string }) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || process.env.ADSENSE_CLIENT_ID;
  if (!client) {
    return (
      <div className="bento-card text-center text-xs muted">
        Espacio de anuncios (plan free) · activa ADSENSE_CLIENT_ID para mostrar AdSense
        <span className="sr-only">{slot}</span>
      </div>
    );
  }
  return (
    <div className="bento-card text-center text-xs muted">
      {/* Integración AdSense real al tener aprobación */}
      Anuncio · {slot}
    </div>
  );
}
