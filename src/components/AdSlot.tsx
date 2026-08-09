"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { HouseCreative, AdOperator } from "@/lib/ads/config";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdsApi = {
  enabled: boolean;
  operator: AdOperator;
  adsenseClientId: string | null;
  customScriptUrl: string | null;
  customSlotHtmlHint: string | null;
  house: HouseCreative[];
  disclosure: string;
};

function pickHouse(list: HouseCreative[], slot: string) {
  if (!list.length) return null;
  // Prefer ArriendoSeguro as primary creative
  const preferred = list.find((c) => c.id === "arriendoseguro");
  if (preferred && (slot.includes("ats") || slot.includes("blog") || slot.includes("home"))) {
    return preferred;
  }
  const idx = Math.abs(slot.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % list.length;
  return list[idx];
}

function HouseAd({ creative, disclosure }: { creative: HouseCreative; disclosure: string }) {
  return (
    <aside
      className="bento-card space-y-2 text-left"
      data-ad-operator="house"
      data-ad-id={creative.id}
      style={{
        background:
          "linear-gradient(135deg, color-mix(in srgb, var(--brand) 12%, transparent), transparent)",
      }}
    >
      <p className="text-[10px] uppercase tracking-wide muted">{disclosure}</p>
      {creative.badge ? (
        <p className="text-[11px] font-medium" style={{ color: "var(--brand)" }}>
          {creative.badge}
        </p>
      ) : null}
      <p className="text-xs muted">{creative.brand}</p>
      <p className="text-sm font-semibold leading-snug">{creative.headline}</p>
      <p className="text-xs muted leading-relaxed">{creative.body}</p>
      <a
        href={creative.href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="btn-primary inline-flex text-sm"
        onClick={() => {
          try {
            const key = "ats_ad_clicks";
            const prev = JSON.parse(localStorage.getItem(key) || "{}");
            prev[creative.id] = (prev[creative.id] || 0) + 1;
            localStorage.setItem(key, JSON.stringify(prev));
          } catch {
            /* ignore */
          }
        }}
      >
        {creative.cta}
      </a>
    </aside>
  );
}

/**
 * Slot multi-operador:
 * - house (default): ArriendoSeguro / LOTIC — listo ya, sin aprobación Google
 * - adsense: cuando NEXT_PUBLIC_ADSENSE_CLIENT_ID + operator
 * - custom: script externo (EthicalAds, Carbon, Media.net, etc.)
 */
export function AdSlot({ slot = "ats-free" }: { slot?: string }) {
  const [cfg, setCfg] = useState<AdsApi | null>(null);
  const [enabled, setEnabled] = useState(true);
  const pushed = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const consent = localStorage.getItem("ats_cookie_ok");
        if (consent === "essential") {
          if (!cancelled) setEnabled(false);
          return;
        }
        if (localStorage.getItem("ats_feature_ads") === "0") {
          if (!cancelled) setEnabled(false);
          return;
        }
        const res = await fetch("/api/ads/config");
        if (res.ok) {
          const data = (await res.json()) as AdsApi;
          if (!cancelled) {
            setCfg(data);
            setEnabled(Boolean(data.enabled));
            localStorage.setItem("ats_feature_ads", data.enabled ? "1" : "0");
          }
        } else {
          const feat = await fetch("/api/features");
          if (feat.ok) {
            const d = await feat.json();
            if (!cancelled) setEnabled(Boolean(d.ads));
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

  const operator = cfg?.operator || "house";
  const pub = cfg?.adsenseClientId || process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || null;
  const house = useMemo(() => pickHouse(cfg?.house || [], slot), [cfg?.house, slot]);

  useEffect(() => {
    if (!enabled || operator !== "adsense" || !pub || pushed.current) return;
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
  }, [enabled, operator, pub]);

  useEffect(() => {
    if (!enabled || operator !== "custom" || !cfg?.customScriptUrl) return;
    const id = "ats-ad-custom";
    if (document.getElementById(id)) return;
    const s = document.createElement("script");
    s.id = id;
    s.async = true;
    s.src = cfg.customScriptUrl;
    document.head.appendChild(s);
  }, [enabled, operator, cfg?.customScriptUrl]);

  if (!enabled) return null;

  const disclosure = cfg?.disclosure || "Anuncio";

  if (operator === "house" || (operator === "adsense" && !pub)) {
    if (!house) {
      return (
        <div className="bento-card text-center text-xs muted">
          Espacio publicitario (plan free) · house ads LOTIC
          <span className="sr-only">{slot}</span>
        </div>
      );
    }
    return <HouseAd creative={house} disclosure={disclosure} />;
  }

  if (operator === "custom") {
    return (
      <div className="bento-card space-y-2 text-center text-xs muted" data-ad-operator="custom">
        <p className="text-[10px] uppercase tracking-wide">{disclosure}</p>
        <div id={`ats-ad-slot-${slot}`} data-ad-network={cfg?.customSlotHtmlHint || "custom"} />
        <p className="text-[10px]">
          Operador: {cfg?.customSlotHtmlHint || "custom"} · define NEXT_PUBLIC_AD_CUSTOM_SCRIPT_URL
        </p>
      </div>
    );
  }

  // AdSense
  return (
    <div className="bento-card overflow-hidden text-center" data-ad-operator="adsense">
      <p className="mb-1 text-[10px] uppercase tracking-wide muted">{disclosure}</p>
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight: 90 }}
        data-ad-client={pub || undefined}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
