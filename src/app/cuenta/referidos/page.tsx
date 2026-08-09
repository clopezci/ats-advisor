"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import {
  bumpShare,
  claimReferral,
  readReferral,
  referralShareUrl,
  type ReferralState,
} from "@/lib/growth/referral";

export default function ReferidosPage() {
  const [ref, setRef] = useState<ReferralState | null>(null);
  const [claim, setClaim] = useState("");
  const [msg, setMsg] = useState("");
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    const r = readReferral();
    setRef(r);
    setShareUrl(referralShareUrl(r.code));
    const params = new URLSearchParams(window.location.search);
    const incoming = params.get("ref") || "";
    if (incoming) {
      setClaim(incoming.toUpperCase());
    }
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setRef(bumpShare());
      setMsg("Enlace copiado. Compártelo por WhatsApp o LinkedIn.");
    } catch {
      setMsg("Copia manualmente el enlace de abajo.");
    }
  }

  function saveClaim() {
    if (claim.trim().length < 4) {
      setMsg("Código inválido");
      return;
    }
    setRef(claimReferral(claim));
    setMsg("Código de quien te invitó guardado. Cuando actives plan, LOTIC podrá atribuir el referido.");
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] muted">Fase 4 · crecimiento</p>
            <h1 className="mt-1 text-2xl font-semibold">Invita y gana impulso</h1>
          </div>
          <SpeakButton text="Comparte tu código. Quien se registre con tu enlace queda atribuido a tu referido." />
        </div>
        <p className="text-sm muted">
          Programa soft: el cobro de recompensas (días Plus / descuento) se activa cuando habilitemos
          pagos. Mientras tanto acumulas compartidos y atribución.
        </p>
      </section>

      {ref && (
        <section className="bento-card space-y-3">
          <p className="text-sm muted">Tu código</p>
          <p className="text-3xl font-semibold tracking-wide">{ref.code}</p>
          <p className="text-xs muted break-all">{shareUrl}</p>
          <p className="text-xs muted">Compartidos registrados: {ref.shares}</p>
          <button type="button" className="btn-primary" onClick={copy}>
            Copiar enlace de invitación
          </button>
          {typeof navigator !== "undefined" && "share" in navigator && (
            <button
              type="button"
              className="btn-secondary"
              onClick={async () => {
                try {
                  await navigator.share({
                    title: "ATSAdvisor",
                    text: "Pasa el ATS y reconstruye tu carrera",
                    url: shareUrl,
                  });
                  setRef(bumpShare());
                } catch {
                  /* cancel */
                }
              }}
            >
              Compartir nativo
            </button>
          )}
        </section>
      )}

      <section className="bento-card space-y-3">
        <h2 className="font-semibold text-sm">¿Te invitaron?</h2>
        <input
          className="field"
          value={claim}
          onChange={(e) => setClaim(e.target.value.toUpperCase())}
          placeholder="Código LOTIC…"
        />
        <button type="button" className="btn-secondary" onClick={saveClaim}>
          Guardar código de invitador
        </button>
        {ref?.claimedFrom && (
          <p className="text-xs muted">Atribuido a: {ref.claimedFrom}</p>
        )}
      </section>

      {msg && <p className="text-sm">{msg}</p>}
      <Link href="/cuenta" className="btn-secondary">
        Volver a cuenta
      </Link>
    </div>
  );
}
