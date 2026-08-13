/**
 * Catálogo de anuncios internos / multi-operador.
 * - house: ArriendoSeguro (creatividades de campaña, rotan al azar)
 * - adsense / mediavine / ezoic / custom: operadores externos vía env
 */
import { ARRIENDO_CREATIVES, ARRIENDO_URL } from "@/lib/ads/arriendoCreatives";

export type AdOperator = "house" | "adsense" | "mediavine" | "ezoic" | "custom";

export type HouseCreative = {
  id: string;
  brand: string;
  headline: string;
  body: string;
  cta: string;
  href: string;
};

export function houseCreatives(): HouseCreative[] {
  return ARRIENDO_CREATIVES.map((c) => ({
    id: c.id,
    brand: "ArriendoSeguro",
    headline: c.headline,
    body: c.body,
    cta: c.cta,
    href: ARRIENDO_URL,
  }));
}

export function resolveAdOperator(): AdOperator {
  const forced = (process.env.NEXT_PUBLIC_AD_OPERATOR || "").toLowerCase();
  if (
    forced === "adsense" ||
    forced === "mediavine" ||
    forced === "ezoic" ||
    forced === "custom" ||
    forced === "house"
  ) {
    return forced;
  }
  if (process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID) return "adsense";
  return "house";
}

export type PublicAdConfig = {
  operator: AdOperator;
  adsenseClientId: string | null;
  customScriptUrl: string | null;
  customSlotHtmlHint: string | null;
  house: HouseCreative[];
  disclosure: string;
};

export function publicAdConfig(): PublicAdConfig {
  const operator = resolveAdOperator();
  return {
    operator,
    adsenseClientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || null,
    customScriptUrl: process.env.NEXT_PUBLIC_AD_CUSTOM_SCRIPT_URL || null,
    customSlotHtmlHint: process.env.NEXT_PUBLIC_AD_NETWORK_NAME || null,
    house: houseCreatives(),
    disclosure: "Publicidad",
  };
}
