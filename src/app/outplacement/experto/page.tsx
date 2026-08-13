"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SpeakButton } from "@/components/SpeakButton";
import { VoiceInput, VoiceTextarea } from "@/components/VoiceField";
import { EXPERT_SPECIALTIES, specialtyLabel } from "@/lib/experts/specialties";
import { packageById } from "@/lib/outplacement/marketplacePackages";

type AllyPublic = {
  id: string;
  name: string;
  specialties: string[];
  specialtyLabels: string[];
  notes: string;
  servicePriceCop: number;
  commissionPercent: number;
};

function ExpertoInner() {
  const params = useSearchParams();
  const [allies, setAllies] = useState<AllyPublic[]>([]);
  const [enabled, setEnabled] = useState(true);
  const [billingCopy, setBillingCopy] = useState("");
  const [billingMode, setBillingMode] = useState<"platform_collect" | "ally_direct">("platform_collect");
  const [allyId, setAllyId] = useState("");
  const [specialty, setSpecialty] = useState("cv");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [confirmUrl, setConfirmUrl] = useState("");

  const packId = params.get("pack") || "";
  const pack = packId ? packageById(packId) : null;
  const qSpecialty = params.get("specialty") || "";

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem("ats_profile") || "null");
      if (p?.name) setName(p.name);
      if (p?.email) setEmail(p.email);
    } catch {
      /* ignore */
    }
    const spec = qSpecialty || pack?.specialty || "";
    if (spec) setSpecialty(spec);
    if (pack) {
      setMessage((prev) =>
        prev.trim()
          ? prev
          : `Quiero el paquete «${pack.title}» (${pack.duration}). Contexto: `
      );
      setOpen(true);
    }
    fetch("/api/experts")
      .then((r) => r.json())
      .then((d) => {
        setEnabled(Boolean(d.enabled));
        setAllies(d.allies || []);
        setBillingCopy(d.billingCopy || "");
        if (d.billingMode === "ally_direct" || d.billingMode === "platform_collect") {
          setBillingMode(d.billingMode);
        }
        const list = (d.allies || []) as AllyPublic[];
        const preferred = list.find((a) => a.specialties.includes(spec)) || list[0];
        if (preferred) setAllyId(preferred.id);
      })
      .catch(() => setEnabled(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qSpecialty, packId]);

  const selected = allies.find((a) => a.id === allyId);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setConfirmUrl("");
    try {
      const res = await fetch("/api/experts/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ allyId, name, email, phone, specialty, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error || "No se pudo enviar");
        return;
      }
      setMsg(data.message || "Enviado");
      if (data.confirmUrl) setConfirmUrl(data.confirmUrl);
      setOpen(false);
      setMessage("");
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
            <p className="text-xs uppercase tracking-[0.14em] muted">Aliados · conciliación</p>
            <h1 className="mt-1 text-2xl font-semibold">Hablar con un experto</h1>
          </div>
          <SpeakButton text="Elige aliado. El precio del servicio lo define el convenio. Confirma cuando lo tomes." />
        </div>
        <p className="text-sm muted">{billingCopy || "Convenios LOTIC con precio público por aliado."}</p>
        {pack && (
          <p className="text-xs muted">
            Paquete marketplace: <strong>{pack.title}</strong>
          </p>
        )}
      </section>

      {!enabled && (
        <p className="text-sm muted">Las solicitudes a expertos están desactivadas en admin.</p>
      )}

      {enabled && allies.length === 0 && (
        <section className="bento-card space-y-2 text-sm muted">
          <p>Aún no hay aliados activos. El owner debe cargarlos en /admin → Aliados expertos.</p>
        </section>
      )}

      {enabled &&
        allies.map((a) => (
          <section key={a.id} className="bento-card space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-semibold">{a.name}</h2>
              <p className="text-sm font-medium">
                {a.servicePriceCop?.toLocaleString("es-CO")} COP
              </p>
            </div>
            <p className="text-xs muted">{a.specialtyLabels.join(" · ")}</p>
            {a.notes ? <p className="text-sm muted">{a.notes}</p> : null}
            <p className="text-xs muted">
              {billingMode === "platform_collect"
                ? "Pagas este valor en ATSAdvisor (LOTIC liquida al aliado)."
                : "Precio de referencia · pagas al aliado."}
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setAllyId(a.id);
                setSpecialty(
                  qSpecialty && a.specialties.includes(qSpecialty)
                    ? qSpecialty
                    : a.specialties[0] || "carrera"
                );
                setOpen(true);
              }}
            >
              Solicitar a {a.name}
            </button>
          </section>
        ))}

      {open && selected && (
        <form className="bento-card space-y-3" onSubmit={submit}>
          <h2 className="font-semibold">Solicitud · {selected.name}</h2>
          <p className="text-sm">
            Valor del servicio:{" "}
            <strong>{selected.servicePriceCop?.toLocaleString("es-CO")} COP</strong>
          </p>
          <VoiceInput
            label="Tu nombre"
            value={name}
            onChange={setName}
            required
            placeholder="Ejemplo: María Gómez"
            dictationLabel="Dictar nombre"
          />
          <label className="block text-sm">
            Correo
            <input
              className="field mt-1"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <VoiceInput
            label="Teléfono / WhatsApp (opcional)"
            value={phone}
            onChange={setPhone}
            type="tel"
            placeholder="Ejemplo: 3001234567"
            dictationLabel="Dictar teléfono"
          />
          <label className="block text-sm">
            ¿Qué necesitas?
            <select
              className="field mt-1"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
            >
              {EXPERT_SPECIALTIES.filter(
                (s) => !selected.specialties.length || selected.specialties.includes(s.id)
              ).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
              {selected.specialties.length > 0 &&
                !EXPERT_SPECIALTIES.some((s) => selected.specialties.includes(s.id)) &&
                selected.specialties.map((id) => (
                  <option key={id} value={id}>
                    {specialtyLabel(id)}
                  </option>
                ))}
            </select>
          </label>
          <VoiceTextarea
            label="Cuéntale al experto (contexto breve)"
            value={message}
            onChange={setMessage}
            required
            minLength={12}
            className="field min-h-[100px]"
            placeholder="Ej.: necesito revisión de CV para rol de analista de datos en Bogotá…"
            dictationLabel="Dictar mensaje"
          />
          <div className="flex gap-2">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Enviando…" : "Enviar solicitud"}
            </button>
            <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {msg && <p className="text-sm">{msg}</p>}
      {confirmUrl && (
        <section className="bento-card space-y-2 text-sm">
          <p>Guarda este enlace: cuando tomes el servicio, confirma aquí.</p>
          <Link href={confirmUrl} className="btn-primary">
            Ir a confirmar servicio
          </Link>
        </section>
      )}

      <Link href="/outplacement/marketplace" className="btn-secondary">
        Ver empaques marketplace
      </Link>
      <Link href="/outplacement" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}

export default function ExpertoPage() {
  return (
    <Suspense fallback={<p className="p-4 text-sm muted">Cargando…</p>}>
      <ExpertoInner />
    </Suspense>
  );
}
