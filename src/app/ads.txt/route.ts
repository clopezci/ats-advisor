import { NextResponse } from "next/server";

/**
 * ads.txt — requerido / recomendado por Google AdSense y otros operadores.
 * Publisher ID vía NEXT_PUBLIC_ADSENSE_CLIENT_ID (ca-pub-XXXX).
 * House ads no necesitan línea; se documentan en comentario.
 */
export async function GET() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || process.env.ADSENSE_CLIENT_ID || "";
  const pub = client.replace(/^ca-pub-/i, "").trim();
  const lines = [
    "# ATSAdvisor · ads.txt",
    "# House ads LOTIC (ArriendoSeguro) no requieren entrada aquí.",
    "# Alternativas (EthicalAds / Carbon / Media.net): añade líneas del operador cuando las tengas.",
  ];
  if (pub) {
    lines.push(`google.com, pub-${pub}, DIRECT, f08c47fec0942fa0`);
  } else {
    lines.push("# google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0  ← tras aprobación AdSense");
  }
  return new NextResponse(lines.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
