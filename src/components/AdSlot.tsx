"use client";

import { useEffect, useRef, useState } from "react";
import type { HouseCreative, AdOperator } from "@/lib/ads/config";
import { pickArriendoCreative, ARRIENDO_URL } from "@/lib/ads/arriendoCreatives";
import { canAccessOutplacement, readEntitlement } from "@/lib/entitlements";

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

function trackClick(id: string) {
  try {
    const key = "ats_ad_clicks";
    const prev = JSON.parse(localStorage.getItem(key) || "{}");
    prev[id] = (prev[id] || 0) + 1;
    localStorage.setItem(key, JSON.stringify(prev));
  } catch {
    /* ignore */
  }
}

function HouseAd({ slot }: { slot: string }) {
  const [creative, setCreative] = useState<ReturnType<typeof pickArriendoCreative> | null>(null);

  useEffect(() => {
    setCreative(pickArriendoCreative(slot));
  }, [slot]);

  if (!creative) {
    return <aside className="ad-unit ad-unit--loading" aria-hidden />;
  }

  return (
    <aside
      className="ad-unit"
      data-ad-operator="house"
      data-ad-id={creative.id}
      aria-label="Publicidad"
    >
      <div className="ad-unit__bar">
        <span className="ad-unit__tag">Publicidad</span>
        <span className="ad-unit__brand">ArriendoSeguro</span>
      </div>
      <p className="ad-unit__headline">{creative.headline}</p>
      <p className="ad-unit__body">{creative.body}</p>
      <a
        href={ARRIENDO_URL}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="ad-unit__cta"
        onClick={() => trackClick(creative.id)}
      >
        {creative.cta}
        <span aria-hidden> →</span>
      </a>
      <p className="ad-unit__foot">Se abre arriendoseguro.app · no es parte de ATSAdvisor</p>
    </aside>
  );
}

/**
 * Slot multi-operador:
 * - house (default): campañas ArriendoSeguro
 * - adsense / custom: cuando hay env
 */
export function AdSlot({ slot = "ats-free" }: { slot?: string }) {
  const [cfg, setCfg] = useState<AdsApi | null>(null);
  const [enabled, setEnabled] = useState(true);
  const [hideForPaid, setHideForPaid] = useState(false);
  const pushed = useRef(false);

  useEffect(() => {
    try {
      setHideForPaid(canAccessOutplacement(readEntitlement().plan));
    } catch {
      /* ignore */
    }
  }, []);

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

  if (!enabled || hideForPaid) return null;

  if (operator === "house" || (operator === "adsense" && !pub)) {
    return <HouseAd slot={slot} />;
  }

  if (operator === "custom") {
    return (
      <div className="ad-unit ad-unit--external" data-ad-operator="custom">
        <p className="ad-unit__tag">Publicidad</p>
        <div id={`ats-ad-slot-${slot}`} data-ad-network={cfg?.customSlotHtmlHint || "custom"} />
      </div>
    );
  }

  return (
    <div className="ad-unit ad-unit--external" data-ad-operator="adsense">
      <p className="ad-unit__tag">Publicidad</p>
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
