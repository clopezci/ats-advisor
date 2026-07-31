"use client";

import { useEffect, useState } from "react";

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<{ prompt: () => Promise<void> } | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      const ev = e as unknown as { prompt: () => Promise<void> };
      setDeferred(ev);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler as EventListener);
    return () => window.removeEventListener("beforeinstallprompt", handler as EventListener);
  }, []);

  if (!visible || !deferred) return null;

  return (
    <div className="bento-card mb-4 flex flex-col gap-2">
      <p className="text-sm font-medium">Instala ATSAdvisor en tu celular</p>
      <p className="text-xs muted">Acceso rápido como app, sin tienda.</p>
      <div className="flex gap-2">
        <button
          type="button"
          className="btn-primary"
          onClick={async () => {
            await deferred.prompt();
            setVisible(false);
          }}
        >
          Instalar
        </button>
        <button type="button" className="btn-secondary" onClick={() => setVisible(false)}>
          Ahora no
        </button>
      </div>
    </div>
  );
}
