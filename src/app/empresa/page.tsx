"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeakButton } from "@/components/SpeakButton";
import { readOrg, writeOrg, type CompanyOrg } from "@/lib/b2b/org";

export default function EmpresaPage() {
  const [org, setOrg] = useState<CompanyOrg | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [seats, setSeats] = useState(25);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const o = readOrg();
    setOrg(o);
    if (o) {
      setName(o.name);
      setEmail(o.contactEmail);
      setSeats(o.seatsPurchased);
    }
  }, []);

  function save() {
    if (name.trim().length < 2 || !email.includes("@")) {
      setMsg("Nombre de empresa y correo de contacto son obligatorios.");
      return;
    }
    const next: CompanyOrg = {
      name: name.trim(),
      contactEmail: email.trim(),
      seatsPurchased: Math.max(5, Math.min(500, seats)),
      createdAt: org?.createdAt || Date.now(),
    };
    writeOrg(next);
    setOrg(next);
    setMsg("Organización guardada en este dispositivo (demo B2B). Con Supabase se sincroniza en cloud.");
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="pill-brand">B2B · F15</p>
            <h1 className="mt-2 text-2xl font-semibold">Portal empresas / RH</h1>
          </div>
          <SpeakButton text="Portal para empresas: compra cupos de outplacement, invita colaboradores y mira el progreso agregado sin acceder a CVs privados." />
        </div>
        <p className="text-sm muted leading-relaxed">
          Licencias de outplacement masivo para transiciones laborales. Dashboard agregado (privacidad
          primero): no se exponen hojas de vida individuales al RH.
        </p>
      </section>

      <section className="bento-card space-y-3">
        <h2 className="font-semibold">Tu organización</h2>
        <label className="block text-sm">
          Nombre empresa
          <input className="field mt-1" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="block text-sm">
          Correo RH / contacto
          <input
            className="field mt-1"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          Cupos contratados (demo)
          <input
            className="field mt-1"
            type="number"
            min={5}
            max={500}
            value={seats}
            onChange={(e) => setSeats(Number(e.target.value) || 5)}
          />
        </label>
        <button type="button" className="btn-primary" onClick={save}>
          Guardar organización
        </button>
        {msg && <p className="text-sm">{msg}</p>}
      </section>

      <div className="flex flex-col gap-3">
        <Link href="/empresa/dashboard" className="btn-primary">
          Dashboard RH
        </Link>
        <Link href="/empresa/invitaciones" className="btn-secondary">
          Invitaciones / CSV
        </Link>
        <Link href="/precios" className="btn-secondary">
          Ver precios B2C (referencia)
        </Link>
        <Link href="/capacidades" className="btn-secondary">
          Ver mapa completo del producto
        </Link>
      </div>

      <Link href="/" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
