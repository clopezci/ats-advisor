"use client";

import { useState } from "react";
import Link from "next/link";

export default function FeedbackPage() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, email }),
      });
      const data = await res.json();
      setMsg(res.ok ? "Gracias. Lo revisamos." : data.error || "No se pudo enviar");
      if (res.ok) setMessage("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <h1 className="text-xl font-semibold">Feedback</h1>
      <p className="text-sm muted">Cuéntanos qué mejorar. Si Telegram owner está activo, llega al instante.</p>
      <input className="field" placeholder="Correo (opcional)" value={email} onChange={(e) => setEmail(e.target.value)} />
      <textarea
        className="field min-h-32"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ejemplo: estaba en comparar vacantes, el recuadro del CV estaba en blanco y no supe qué pegar."
      />
      <button type="button" className="btn-primary" disabled={loading || message.length < 5} onClick={send}>
        {loading ? "Enviando…" : "Enviar"}
      </button>
      {msg && <p className="text-sm">{msg}</p>}
      <Link href="/" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
