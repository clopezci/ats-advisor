/**
 * Catálogo de anuncios internos / multi-operador.
 * - house: promoción de apps LOTIC (ej. ArriendoSeguro) mientras AdSense/otros aprueban
 * - adsense / mediavine / ethereal / custom: operadores externos vía env
 */
export type AdOperator = "house" | "adsense" | "mediavine" | "ezoic" | "custom";

export type HouseCreative = {
  id: string;
  brand: string;
  headline: string;
  body: string;
  cta: string;
  href: string;
  badge?: string;
};

/** Apps LOTIC a publicitar en slots free (URLs configurables por env). */
export function houseCreatives(): HouseCreative[] {
  const arriendoUrl =
    process.env.NEXT_PUBLIC_AD_ARRIENDOSEGURO_URL ||
    process.env.NEXT_PUBLIC_LOTIC_ARRIENDOSEGURO_URL ||
    "https://arriendoseguro.app/";

  return [
    {
      id: "arriendoseguro",
      brand: "ArriendoSeguro · LOTIC",
      headline: "Formaliza tu arriendo entre particulares",
      body: "Contrato con validez legal, validación de partes con IA, firma electrónica, inventario y pagos — sin complicaciones.",
      cta: "Probar ArriendoSeguro",
      href: arriendoUrl,
      badge: "Producto LOTIC",
    },
    {
      id: "lotic-hub",
      brand: "LOTIC Soluciones",
      headline: "Tecnología al alcance de mipymes",
      body: "Ingeniería e IA aplicada para procesos reales — sin costos de gran corporación.",
      cta: "Ver soluciones LOTIC",
      href: "https://lotic-soluciones.vercel.app/",
      badge: "Casa matriz",
    },
  ];
}

export function resolveAdOperator(): AdOperator {
  const forced = (process.env.NEXT_PUBLIC_AD_OPERATOR || "").toLowerCase();
  if (forced === "adsense" || forced === "mediavine" || forced === "ezoic" || forced === "custom" || forced === "house") {
    return forced;
  }
  // Auto: AdSense si hay client id; si no, house (ArriendoSeguro / LOTIC)
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
    disclosure:
      "Anuncio · Puede ser contenido propio LOTIC u operadores de publicidad según configuración.",
  };
}
