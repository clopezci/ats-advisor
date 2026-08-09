"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { formatCop } from "@/lib/channels/pricing";

type CaseRow = {
  id: string;
  createdAt: string;
  allyName: string;
  allyEmail: string;
  userName: string;
  userEmail: string;
  specialty: string;
  status: string;
  amountPaidCop?: number;
  commissionPercent: number;
  commissionCop?: number;
  serviceDate?: string;
  proofNote?: string;
  settlementId?: string;
  listedPriceCop?: number;
  allyNetCop?: number;
  billingMode?: string;
};

type Settlement = {
  id: string;
  weekLabel: string;
  createdAt: string;
  caseIds: string[];
  totalCommissionCop: number;
  notes: string;
  status: string;
};

export default function AdminExpertosPage() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [pending, setPending] = useState(0);
  const [weekHint, setWeekHint] = useState("");
  const [filter, setFilter] = useState("confirmed");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const s = sessionStorage.getItem("admin_secret");
    if (s) setSecret(s);
  }, []);

  async function load(sec = secret) {
    const res = await fetch("/api/admin/experts/cases", {
      headers: { "x-admin-secret": sec },
    });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error || "No autorizado");
      return;
    }
    setAuthed(true);
    setCases(data.cases || []);
    setSettlements(data.settlements || []);
    setPending(data.pendingCommission || 0);
    setWeekHint(data.weekHint || "");
    setMsg("");
    sessionStorage.setItem("admin_secret", sec);
  }

  const visible = useMemo(() => {
    if (filter === "all") return cases;
    if (filter === "pending_cut") {
      return cases.filter((c) => c.status === "confirmed" && !c.settlementId);
    }
    return cases.filter((c) => c.status === filter);
  }, [cases, filter]);

  async function createCut() {
    const ids = Object.entries(selected)
      .filter(([, v]) => v)
      .map(([k]) => k);
    const res = await fetch("/api/admin/experts/cases", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": secret,
      },
      body: JSON.stringify({
        caseIds: ids.length ? ids : undefined,
        weekLabel: weekHint,
        notes,
        close: true,
      }),
    });
    const data = await res.json();
    setMsg(res.ok ? `Corte ${data.settlement?.id}: ${data.cases} casos · ${formatCop(data.settlement?.totalCommissionCop || 0)}` : data.error);
    if (res.ok) {
      setSelected({});
      load();
    }
  }

  if (!authed) {
    return (
      <div className="flex flex-1 flex-col gap-4">
        <h1 className="text-2xl font-semibold">Conciliación aliados</h1>
        <input
          className="field"
          type="password"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder="ADMIN_SECRET"
        />
        <button type="button" className="btn-primary" onClick={() => load()}>
          Entrar
        </button>
        {msg && <p className="text-sm">{msg}</p>}
        <Link href="/admin" className="btn-secondary">
          Volver admin
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Tablero comisiones aliados</h1>
          <p className="text-sm muted">
            Pruebas de servicio confirmadas por el usuario · cortes semanales (no cobro unitario).
          </p>
        </div>
        <SpeakButton text="Filtra casos confirmados, selecciona y genera el corte de la semana." />
      </div>

      <section className="bento-card space-y-2">
        <p className="text-sm">
          Pendiente de corte: <strong>{formatCop(pending)}</strong> · Semana sugerida: {weekHint}
        </p>
        <label className="block text-sm">
          Filtro
          <select className="field mt-1" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="pending_cut">Confirmados sin corte</option>
            <option value="confirmed">Confirmados</option>
            <option value="requested">Solicitados</option>
            <option value="disputed">Disputa</option>
            <option value="settled">En corte</option>
            <option value="all">Todos</option>
          </select>
        </label>
        <button type="button" className="btn-secondary" onClick={() => load()}>
          Refrescar
        </button>
      </section>

      <div className="space-y-3">
        {visible.map((c) => (
          <article key={c.id} className="bento-card space-y-2 text-sm">
            <label className="flex items-start gap-2">
              {c.status === "confirmed" && !c.settlementId && (
                <input
                  type="checkbox"
                  checked={Boolean(selected[c.id])}
                  onChange={() => setSelected((s) => ({ ...s, [c.id]: !s[c.id] }))}
                />
              )}
              <div className="flex-1">
                <p className="font-medium">
                  {c.id} · {c.status}
                </p>
                <p className="muted">
                  {c.allyName} ← {c.userName} ({c.userEmail}) · {c.specialty}
                </p>
                <p className="muted">
                  Creado {new Date(c.createdAt).toLocaleString("es-CO")}
                  {c.serviceDate ? ` · Servicio ${c.serviceDate}` : ""}
                </p>
                {c.amountPaidCop != null && (
                  <p>
                    Pagó {formatCop(c.amountPaidCop)} · Comisión {c.commissionPercent}% ={" "}
                    <strong>{formatCop(c.commissionCop || 0)}</strong>
                    {c.allyNetCop != null ? ` · Neto aliado ${formatCop(c.allyNetCop)}` : ""}
                  </p>
                )}
                {c.listedPriceCop != null && c.amountPaidCop == null && (
                  <p className="muted">
                    Precio listado {formatCop(c.listedPriceCop)}
                    {c.billingMode ? ` · ${c.billingMode}` : ""}
                  </p>
                )}
                {c.proofNote && <p className="muted">Prueba: {c.proofNote}</p>}
                {c.settlementId && <p className="text-xs muted">Corte: {c.settlementId}</p>}
                {(c.status === "requested" || c.status === "disputed") && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn-secondary text-xs"
                      onClick={async () => {
                        await fetch("/api/admin/experts/cases", {
                          method: "PATCH",
                          headers: {
                            "Content-Type": "application/json",
                            "x-admin-secret": secret,
                          },
                          body: JSON.stringify({ caseId: c.id, status: "cancelled" }),
                        });
                        load();
                      }}
                    >
                      Cancelar caso
                    </button>
                    {c.status === "disputed" && (
                      <button
                        type="button"
                        className="btn-secondary text-xs"
                        onClick={async () => {
                          await fetch("/api/admin/experts/cases", {
                            method: "PATCH",
                            headers: {
                              "Content-Type": "application/json",
                              "x-admin-secret": secret,
                            },
                            body: JSON.stringify({ caseId: c.id, status: "requested" }),
                          });
                          load();
                        }}
                      >
                        Reabrir
                      </button>
                    )}
                  </div>
                )}
              </div>
            </label>
          </article>
        ))}
        {!visible.length && <p className="text-sm muted">Sin casos en este filtro.</p>}
      </div>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold">Generar corte semanal</h2>
        <p className="text-xs muted">
          Si no marcas checkboxes, incluye todos los «confirmados sin corte».
        </p>
        <textarea
          className="field min-h-16"
          placeholder="Notas del corte (transferencias, aliados, etc.)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button type="button" className="btn-primary" onClick={createCut}>
          Cerrar corte {weekHint}
        </button>
      </section>

      <section className="bento-card space-y-2">
        <h2 className="font-semibold text-sm">Cortes anteriores</h2>
        {settlements.map((s) => (
          <div key={s.id} className="text-sm border-b pb-2" style={{ borderColor: "var(--border)" }}>
            <p className="font-medium">
              {s.weekLabel} · {formatCop(s.totalCommissionCop)} · {s.caseIds.length} casos
            </p>
            <p className="text-xs muted">
              {s.id} · {new Date(s.createdAt).toLocaleString("es-CO")} · {s.status}
            </p>
            {s.notes && <p className="text-xs muted">{s.notes}</p>}
          </div>
        ))}
        {!settlements.length && <p className="text-xs muted">Aún no hay cortes.</p>}
      </section>

      {msg && <p className="text-sm">{msg}</p>}
      <Link href="/admin" className="btn-secondary">
        Volver al admin
      </Link>
    </div>
  );
}
