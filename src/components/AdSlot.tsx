"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdSlot({ slot = "ats-free" }: { slot?: string }) {
  const [enabled, setEnabled] = useState(true);
  const pushed = useRef(false);
  const pub = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (localStorage.getItem("ats_feature_ads") === "0") {
          if (!cancelled) setEnabled(false);
          return;
        }
        const res = await fetch("/api/features");
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) {
            setEnabled(Boolean(data.ads));
            localStorage.setItem("ats_feature_ads", data.ads ? "1" : "0");
          }
        }
      } catch {
        /* keep default */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!pub || !enabled || pushed.current) return;
    const existing = document.querySelector(`script[data-ats-adsense="1"]`);
    if (!existing) {
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pub}`;
      s.crossOrigin = "anonymous";
      s.dataset.atsAdsense = "1";
      document.head.appendChild(s);
    }
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
      pushed.current = true;
    } catch {
      /* ignore */
    }
  }, [pub, enabled]);

  if (!enabled) return null;

  if (!pub) {
    return (
      <div className="bento-card text-center text-xs muted">
        Espacio de anuncios (plan free) · define NEXT_PUBLIC_ADSENSE_CLIENT_ID para AdSense
        <span className="sr-only">{slot}</span>
      </div>
    );
  }

  return (
    <div className="bento-card overflow-hidden text-center">
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight: 90 }}
        data-ad-client={pub}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
