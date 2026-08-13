"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SpeakButton } from "@/components/SpeakButton";
import { VoiceTextarea } from "@/components/VoiceField";
import { Suspense } from "react";

function ConfirmInner() {
  const params = useSearchParams();
  const caseId = params.get("case") || "";
  const token = params.get("token") || "";
  const [info, setInfo] = useState<{
    allyName: string;
    specialty: string;
    status: string;
    commissionPercent: number;
    listedPriceCop?: number;
    billingMode?: string;
  } | null>(null);
  const [serviceDate, setServiceDate] = useState(new Date().toISOString().slice(0, 10));
  const [amount, setAmount] = useState("");
  const [proof, setProof] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!caseId || !token) return;
    fetch(`/api/experts/confirm?case=${encodeURIComponent(caseId)}&token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.case) {
          setInfo(d.case);
          if (d.case.listedPriceCop) setAmount(String(d.case.listedPriceCop));
        } else setMsg(d.error || "Caso no encontrado");
      })
      .catch(() => setMsg("Error de red"));
  }, [caseId, token]);

  async function submit(dispute = false) {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/experts/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId,
          token,
          serviceDate,
          amountPaidCop: Number(amount) || 0,
          proofNote: proof,
          dispute,
        }),
      });
      const data = await res.json();
      setMsg(data.message || data.error || (res.ok ? "OK" : "Error"));
      if (res.ok && data.status) {
        setInfo((i) => (i ? { ...i, status: data.status } : i));
      }
    } catch {
      setMsg("Error de red");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Confirmar servicio</h1>
            <p className="text-sm muted">
              Dejas constancia de que tomaste el servicio con el aliado. LOTIC usa esto para el corte
              semanal de comisiones (no es un cobro automático a ti).
            </p>
          </div>
          <SpeakButton text="Indica fecha, monto pagado al aliado y una nota. Eso genera la prueba de conciliación." />
        </div>
      </section>

      {!caseId || !token ? (
        <p className="text-sm muted">Falta el enlace completo (case + token). Revisa el correo.</p>
      ) : info ? (
        <section className="bento-card space-y-3">
          <p className="text-sm">
            Caso <code>{caseId}</code> · {info.allyName} · {info.specialty}
          </p>
          <p className="text-xs muted">
            Estado: {info.status} · Comisión LOTIC: {info.commissionPercent}%
            {info.listedPriceCop != null
              ? ` · Precio listado ${info.listedPriceCop.toLocaleString("es-CO")} COP`
              : ""}
          </p>
          {info.billingMode === "platform_collect" && (
            <p className="text-xs muted">
              Modo plataforma: confirma el monto pagado en ATSAdvisor (suele ser el precio listado).
            </p>
          )}
          {info.status === "requested" || info.status === "disputed" ? (
            <>
              <label className="block text-sm">
                Fecha del servicio
                <input
                  className="field mt-1"
                  type="date"
                  value={serviceDate}
                  onChange={(e) => setServiceDate(e.target.value)}
                />
              </label>
              <label className="block text-sm">
                Monto pagado al aliado (COP)
                <input
                  className="field mt-1"
                  type="number"
                  min={0}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Ej. 80000"
                />
              </label>
              <VoiceTextarea
                label="Prueba / nota (opcional)"
                value={proof}
                onChange={setProof}
                className="field min-h-[80px]"
                placeholder="Ej.: sesión Zoom 45 min, revisión de CV enviada por correo…"
                dictationLabel="Dictar nota"
              />
              <button
                type="button"
                className="btn-primary"
                disabled={loading}
                onClick={() => submit(false)}
              >
                {loading ? "Guardando…" : "Confirmar que tomé el servicio"}
              </button>
              <button
                type="button"
                className="btn-secondary"
                disabled={loading}
                onClick={() => submit(true)}
              >
                Marcar disputa / no hubo servicio
              </button>
            </>
          ) : (
            <p className="text-sm">Este caso ya está en estado «{info.status}».</p>
          )}
        </section>
      ) : (
        <p className="text-sm muted">Cargando…</p>
      )}

      {msg && <p className="text-sm">{msg}</p>}
      <Link href="/outplacement/experto" className="btn-secondary">
        Volver a expertos
      </Link>
    </div>
  );
}

export default function ConfirmarServicioPage() {
  return (
    <Suspense fallback={<p className="p-4 text-sm muted">Cargando…</p>}>
      <ConfirmInner />
    </Suspense>
  );
}
