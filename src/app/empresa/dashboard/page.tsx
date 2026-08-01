"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { listSeats, readOrg, seatStats, updateSeatStatus, type CompanySeat } from "@/lib/b2b/org";

export default function EmpresaDashboardPage() {
  const [seats, setSeats] = useState<CompanySeat[]>([]);
  const [orgName, setOrgName] = useState("Tu empresa");
  const [purchased, setPurchased] = useState(0);

  function refresh() {
    setSeats(listSeats());
    const o = readOrg();
    if (o) {
      setOrgName(o.name);
      setPurchased(o.seatsPurchased);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const stats = useMemo(() => seatStats(seats), [seats]);
  const usedPct = purchased ? Math.min(100, Math.round((stats.total / purchased) * 100)) : 0;

  function exportReport() {
    const lines = [
      "email,nombre,estado,modulos,invitado",
      ...seats.map(
        (s) =>
          `${s.email},${JSON.stringify(s.name)},${s.status},${s.modulesDone},${new Date(s.invitedAt).toISOString()}`
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `atsadvisor-rh-${orgName.replace(/\s+/g, "-").toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs muted">{orgName}</p>
            <h1 className="text-xl font-semibold">Dashboard RH</h1>
          </div>
          <SpeakButton text="Vista agregada de adopción de outplacement. No muestra CVs. Puedes exportar un CSV de estados." />
        </div>
        <p className="text-sm muted">Privacidad: solo estados y progreso de módulos, sin contenido de CV.</p>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <div className="bento-card">
          <p className="text-xs muted">Cupos usados</p>
          <p className="text-2xl font-semibold">
            {stats.total}/{purchased || "—"}
          </p>
          <div className="progress-track mt-2">
            <div className="progress-fill" style={{ width: `${usedPct}%` }} />
          </div>
        </div>
        <div className="bento-card">
          <p className="text-xs muted">Módulos promedio</p>
          <p className="text-2xl font-semibold">{stats.avgModules}</p>
        </div>
        <div className="bento-card">
          <p className="text-xs muted">Activos</p>
          <p className="text-2xl font-semibold">{stats.active}</p>
        </div>
        <div className="bento-card">
          <p className="text-xs muted">Completados</p>
          <p className="text-2xl font-semibold">{stats.completed}</p>
        </div>
      </div>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold text-sm">Cohorte</h2>
        {seats.length === 0 && (
          <p className="text-sm muted">Aún no hay invitados. Carga un CSV en Invitaciones.</p>
        )}
        {seats.map((s) => (
          <div key={s.id} className="flex flex-col gap-2 border-b pb-3" style={{ borderColor: "var(--border)" }}>
            <div className="flex justify-between gap-2">
              <div>
                <p className="text-sm font-medium">{s.name}</p>
                <p className="text-xs muted">{s.email}</p>
              </div>
              <span className="pill-brand">{s.status}</span>
            </div>
            <p className="text-xs muted">{s.modulesDone} cápsulas registradas</p>
            <div className="flex flex-wrap gap-2">
              {(["invited", "active", "completed", "paused"] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  className="btn-secondary"
                  style={{ width: "auto", minHeight: "2.25rem", padding: "0.35rem 0.7rem", fontSize: "0.75rem" }}
                  onClick={() => {
                    updateSeatStatus(s.id, st);
                    refresh();
                  }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>

      <button type="button" className="btn-primary" onClick={exportReport} disabled={!seats.length}>
        Exportar reporte CSV
      </button>
      <Link href="/empresa/invitaciones" className="btn-secondary">
        Gestionar invitaciones
      </Link>
      <Link href="/empresa" className="btn-secondary">
        Volver a empresa
      </Link>
    </div>
  );
}
