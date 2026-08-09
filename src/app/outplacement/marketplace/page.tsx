"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { formatCop } from "@/lib/channels/pricing";
import { MARKETPLACE_PACKAGES } from "@/lib/outplacement/marketplacePackages";

type AllyPublic = {
  id: string;
  name: string;
  specialties: string[];
  specialtyLabels: string[];
  notes: string;
  servicePriceCop: number;
};

export default function MarketplacePage() {
  const [allies, setAllies] = useState<AllyPublic[]>([]);
  const [enabled, setEnabled] = useState(true);
  const [billingCopy, setBillingCopy] = useState("");

  useEffect(() => {
    fetch("/api/experts")
      .then((r) => r.json())
      .then((d) => {
        setEnabled(Boolean(d.enabled));
        setAllies(d.allies || []);
        setBillingCopy(d.billingCopy || "");
      })
      .catch(() => setEnabled(false));
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] muted">Fase 3 · marketplace</p>
            <h1 className="mt-1 text-2xl font-semibold">Coach y revisión humana</h1>
          </div>
          <SpeakButton text="El precio lo define cada aliado en el convenio. Elige paquete y solicita." />
        </div>
        <p className="text-sm muted">
          {billingCopy ||
            "Empaques orientativos. El valor exacto lo muestra cada aliado al solicitar."}
        </p>
      </section>

      {!enabled && (
        <p className="text-sm muted">Marketplace de expertos desactivado en admin.</p>
      )}

      <div className="space-y-3">
        {MARKETPLACE_PACKAGES.map((pkg) => {
          const match = allies.filter((a) => a.specialties.includes(pkg.specialty));
          const fromAlly = match.length
            ? Math.min(...match.map((a) => a.servicePriceCop || pkg.fromCop))
            : pkg.fromCop;
          return (
            <article key={pkg.id} className="bento-card space-y-2">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-semibold">{pkg.title}</h2>
                <p className="text-sm muted">
                  Desde {formatCop(fromAlly)} · {pkg.duration}
                </p>
              </div>
              <p className="text-sm muted">{pkg.summary}</p>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {pkg.includes.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              {match.length > 0 ? (
                <div className="space-y-1 text-xs muted">
                  {match.map((a) => (
                    <p key={a.id}>
                      {a.name}: <strong>{formatCop(a.servicePriceCop)}</strong>
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-xs muted">
                  Aún no hay aliado para esta especialidad — precio orientativo del empaque.
                </p>
              )}
              <Link
                href={`/outplacement/experto?specialty=${encodeURIComponent(pkg.specialty)}&pack=${encodeURIComponent(pkg.id)}`}
                className="btn-primary"
              >
                Solicitar este paquete
              </Link>
            </article>
          );
        })}
      </div>

      <Link href="/outplacement/experto" className="btn-secondary">
        Ver todos los aliados
      </Link>
      <Link href="/outplacement" className="btn-secondary">
        Volver a outplacement
      </Link>
    </div>
  );
}
