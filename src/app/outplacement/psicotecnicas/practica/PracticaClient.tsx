"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { BLOQUES_PERFIL, PARES_CALIBRACION } from "@/lib/psicotecnicas/cuestionario";
import {
  buildPersonalidadMd,
  loadPerfil,
  loadSimulacros,
  perfilLleno,
  perfilListo,
  resumenFallos,
  savePerfil,
  saveSimulacro,
  type PerfilAnswers,
  type SimulacroGuardado,
} from "@/lib/psicotecnicas/perfil";
import {
  PSICO_PRACTICA_MONTHLY_CAP,
  PSICO_PRACTICA_PRICE_COP,
  hasPsicoPracticaLocal,
} from "@/lib/psicotecnicas/practicaAccess";
import { formatCop } from "@/lib/channels/pricing";

type Tab = "perfil" | "simulacro" | "aprendizaje" | "resumen";

export function PracticaClient() {
  const [tab, setTab] = useState<Tab>("perfil");
  const [answers, setAnswers] = useState<PerfilAnswers>({});
  const [bloqueI, setBloqueI] = useState(0);
  const [paid, setPaid] = useState(false);
  const [pregunta, setPregunta] = useState("");
  const [image, setImage] = useState<{ mime: string; data: string; name: string } | null>(null);
  const [out, setOut] = useState("");
  const [pistas, setPistas] = useState<string[]>([]);
  const [tipo, setTipo] = useState("");
  const [loading, setLoading] = useState(false);
  const [hist, setHist] = useState<SimulacroGuardado[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setAnswers(loadPerfil());
    setHist(loadSimulacros());
    setPaid(hasPsicoPracticaLocal());
  }, []);

  const bloque = BLOQUES_PERFIL[bloqueI];
  const perfil = useMemo(() => buildPersonalidadMd(answers), [answers]);
  const listo = perfilListo(answers);
  const fallos = resumenFallos(hist);
  const precios = `/precios?plan=psico_practica&next=${encodeURIComponent("/outplacement/psicotecnicas/practica")}`;

  function setAnswer(id: string, value: string) {
    setAnswers((prev) => {
      const next = { ...prev, [id]: value };
      savePerfil(next);
      return next;
    });
  }

  async function onFile(file: File | null) {
    if (!file) {
      setImage(null);
      return;
    }
    if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 900_000) {
      setError("Usa una foto JPG, PNG o WebP de menos de 900 KB.");
      return;
    }
    const dataUrl = await file.arrayBuffer();
    const bytes = new Uint8Array(dataUrl);
    let binary = "";
    for (const b of bytes) binary += String.fromCharCode(b);
    setImage({ mime: file.type, data: btoa(binary), name: file.name });
    setError("");
  }

  async function ask(modo: "simulacro" | "pista" | "revelar") {
    if (!paid) return;
    if (!listo) {
      setError("Responde al menos 15 preguntas del perfil. Si no aplica, escribe «no aplica».");
      setTab("perfil");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const previas = hist.slice(-6).map((h) => ({ pregunta: h.pregunta, respuesta: h.respuesta }));
      const res = await fetch("/api/psicotecnicas/practica", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modo,
          pregunta,
          perfil,
          image: image ? { mime: image.mime, data: image.data } : undefined,
          hintCount: pistas.length,
          previas,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "No se pudo practicar");
      if (data.offTopic) {
        setOut(data.text);
        return;
      }
      if (modo === "pista") {
        setPistas((prev) => [...prev, data.pista]);
        setTipo(data.tipo || tipo);
        setOut(data.pista);
        return;
      }
      const line = `${data.respuesta}\n${data.porque || ""}`.trim();
      setOut(line);
      setTipo(data.tipo || "");
      const row: SimulacroGuardado = {
        at: new Date().toISOString(),
        modo: modo === "revelar" ? "aprendizaje" : "simulacro",
        pregunta: pregunta.slice(0, 240) || image?.name || "foto",
        respuesta: String(data.respuesta || ""),
        porque: String(data.porque || ""),
        tipo: String(data.tipo || "otro"),
        fallo: modo === "revelar",
      };
      setHist(saveSimulacro(row));
      if (modo === "revelar") {
        setPistas([]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo practicar");
    } finally {
      setLoading(false);
    }
  }

  function exportar() {
    const blob = new Blob([JSON.stringify({ perfil, simulacros: hist }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "simulacros-psicotecnicos.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-3">
        <p className="text-xs muted">Psicotécnicas · práctica</p>
        <h1 className="text-2xl font-semibold">Practicar con tu perfil</h1>
        <p className="text-sm muted leading-relaxed">
          Las fichas se leen gratis. Aquí armas tu personalidad una vez y practicas cualquier ítem
          (personalidad, situacional, numérico o abstracto) con coherencia. {formatCop(PSICO_PRACTICA_PRICE_COP)}
          /mes, hasta {PSICO_PRACTICA_MONTHLY_CAP} preguntas, con IA de pago.
        </p>
        <p className="text-xs muted">
          Sirve para ensayar desde quien usted es. Un perfil inventado se contradice y las escalas de validez lo notan.
        </p>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["perfil", "Perfil"],
              ["simulacro", "Simulacro"],
              ["aprendizaje", "Aprendizaje"],
              ["resumen", "Resumen"],
            ] as const
          ).map(([id, label]) => (
            <button key={id} type="button" className="btn-secondary" onClick={() => setTab(id)}>
              {label}
            </button>
          ))}
        </div>
        <p className="text-xs muted">
          Perfil: {perfilLleno(answers)} respuestas. {paid ? "Práctica activa." : "Práctica sin activar."}
        </p>
      </section>

      {tab === "perfil" && bloque && (
        <section className="bento-card space-y-3">
          <p className="text-xs muted">
            Bloque {bloqueI + 1} de {BLOQUES_PERFIL.length}
          </p>
          <h2 className="font-semibold">{bloque.titulo}</h2>
          {bloque.nota && <p className="text-sm muted">{bloque.nota}</p>}
          {bloque.preguntas.map((p) => (
            <label key={p.id} className="block text-sm">
              {p.texto}
              <textarea
                className="field mt-1"
                rows={2}
                value={answers[p.id] || ""}
                onChange={(e) => setAnswer(p.id, e.target.value)}
              />
            </label>
          ))}
          {bloque.id === "futuro" && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Desempates</h3>
              <p className="text-xs muted">En cada par, marque qué pesa más para usted.</p>
              {PARES_CALIBRACION.map((par) => (
                <fieldset key={par.id} className="text-sm space-y-1">
                  <legend>
                    {par.a} vs {par.b}
                  </legend>
                  <label className="block">
                    <input
                      type="radio"
                      name={par.id}
                      checked={answers[par.id] === "A"}
                      onChange={() => setAnswer(par.id, "A")}
                    />{" "}
                    {par.a}
                  </label>
                  <label className="block">
                    <input
                      type="radio"
                      name={par.id}
                      checked={answers[par.id] === "B"}
                      onChange={() => setAnswer(par.id, "B")}
                    />{" "}
                    {par.b}
                  </label>
                </fieldset>
              ))}
              <label className="block text-sm">
                Una situación laboral difícil: qué pasó, qué hizo y por qué.
                <textarea
                  className="field mt-1"
                  rows={4}
                  value={answers.historia || ""}
                  onChange={(e) => setAnswer("historia", e.target.value)}
                />
              </label>
            </div>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              className="btn-secondary"
              disabled={bloqueI <= 0}
              onClick={() => setBloqueI((n) => Math.max(0, n - 1))}
            >
              Anterior
            </button>
            <button
              type="button"
              className="btn-primary"
              disabled={bloqueI >= BLOQUES_PERFIL.length - 1}
              onClick={() => setBloqueI((n) => Math.min(BLOQUES_PERFIL.length - 1, n + 1))}
            >
              Siguiente bloque
            </button>
          </div>
          <details>
            <summary className="text-sm cursor-pointer">Ver personalidad.md</summary>
            <pre className="text-xs whitespace-pre-wrap mt-2">{perfil}</pre>
          </details>
        </section>
      )}

      {(tab === "simulacro" || tab === "aprendizaje") && !paid && (
        <section className="bento-card space-y-2">
          <h2 className="font-semibold">La práctica se cobra aparte</h2>
          <p className="text-sm muted">
            Simulacro y aprendizaje usan IA de pago en cada pregunta. {formatCop(PSICO_PRACTICA_PRICE_COP)} al
            mes, con tope de {PSICO_PRACTICA_MONTHLY_CAP} ítems. Las fichas siguen gratis. Carrera no incluye
            este cupo: la foto de cada ítem tiene costo propio.
          </p>
          <Link href={precios} className="btn-primary">
            Activar práctica
          </Link>
        </section>
      )}

      {tab === "simulacro" && paid && (
        <QuestionBox
          pregunta={pregunta}
          setPregunta={setPregunta}
          onFile={onFile}
          imageName={image?.name || ""}
          loading={loading}
          out={out}
          error={error}
          actionLabel="Responder"
          onAction={() => ask("simulacro")}
          hint="Pega el ítem o una foto. Sale la respuesta y una línea. Sin saludo."
        />
      )}

      {tab === "aprendizaje" && paid && (
        <QuestionBox
          pregunta={pregunta}
          setPregunta={setPregunta}
          onFile={onFile}
          imageName={image?.name || ""}
          loading={loading}
          out={out}
          error={error}
          actionLabel={pistas.length >= 3 ? "Ver respuesta" : `Pista ${pistas.length + 1} de 3`}
          onAction={() => ask(pistas.length >= 3 ? "revelar" : "pista")}
          hint="Tres pistas sin la respuesta. La respuesta se abre solo si la pides después."
          extra={
            pistas.length > 0 ? (
              <ol className="list-decimal pl-4 text-sm space-y-1">
                {pistas.map((p) => (
                  <li key={p.slice(0, 24)}>{p}</li>
                ))}
              </ol>
            ) : null
          }
        />
      )}

      {tab === "resumen" && (
        <section className="bento-card space-y-3">
          <h2 className="font-semibold">Qué se le atravesó</h2>
          {fallos.length === 0 ? (
            <p className="text-sm muted">
              Aún no hay fallos. En aprendizaje, abrir la respuesta después de 3 pistas cuenta como fallo de ese tipo.
            </p>
          ) : (
            <ul className="text-sm space-y-1">
              {fallos.map((f) => (
                <li key={f.tipo}>
                  {f.tipo}: {f.n}
                </li>
              ))}
            </ul>
          )}
          <p className="text-xs muted">{hist.length} preguntas guardadas en este navegador.</p>
          <button type="button" className="btn-secondary" onClick={exportar}>
            Descargar simulacros.json
          </button>
        </section>
      )}

      <Link href={precios} className="btn-secondary">
        {paid ? "Renovar práctica" : `Activar práctica · ${formatCop(PSICO_PRACTICA_PRICE_COP)}/mes`}
      </Link>
      <Link href="/outplacement/psicotecnicas" className="btn-secondary">
        Volver a fichas y pruebas de muestra
      </Link>
    </div>
  );
}

function QuestionBox(props: {
  pregunta: string;
  setPregunta: (v: string) => void;
  onFile: (file: File | null) => void;
  imageName: string;
  loading: boolean;
  out: string;
  error: string;
  actionLabel: string;
  onAction: () => void;
  hint: string;
  extra?: ReactNode;
}) {
  return (
    <section className="bento-card space-y-3">
      <p className="text-sm muted">{props.hint}</p>
      <textarea
        className="field"
        rows={5}
        value={props.pregunta}
        placeholder="Pega la pregunta"
        onChange={(e) => props.setPregunta(e.target.value)}
      />
      <label className="text-sm block">
        Foto del ítem (opcional)
        <input
          className="mt-1 block text-sm"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => props.onFile(e.target.files?.[0] || null)}
        />
      </label>
      {props.imageName && <p className="text-xs muted">{props.imageName}</p>}
      {props.extra}
      <button type="button" className="btn-primary" disabled={props.loading} onClick={props.onAction}>
        {props.loading ? "Pensando…" : props.actionLabel}
      </button>
      {props.error && <p className="text-sm text-red-700">{props.error}</p>}
      {props.out && <p className="text-sm whitespace-pre-wrap">{props.out}</p>}
    </section>
  );
}
