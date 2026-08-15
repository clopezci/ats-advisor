import { NextResponse, type NextRequest } from "next/server";
import { isFreeAppPath } from "@/lib/entitlements/freePaths";

const PAID = new Set(["carrera", "plus", "tester"]);

function needsCarrera(pathname: string): boolean {
  const p = pathname.replace(/\/$/, "") || "/";
  if (isFreeAppPath(p)) return false;
  if (p === "/outplacement") return false;
  if (p.startsWith("/outplacement/experto")) return false;
  if (p.startsWith("/outplacement/marketplace")) return false;
  if (p.startsWith("/outplacement/90-dias") || p.startsWith("/outplacement/certificado")) {
    return false; // paused_90 handled below; free users still blocked by client for other paths
  }
  if (p.startsWith("/outplacement")) return true;
  if (p.startsWith("/herramientas")) return true;
  if (p.startsWith("/ats/") && p !== "/ats") return true;
  return false;
}

function allowsPaused90(pathname: string): boolean {
  const p = pathname.replace(/\/$/, "") || "/";
  return p.startsWith("/outplacement/90-dias") || p.startsWith("/outplacement/certificado");
}

/**
 * Gate de rutas Carrera vía cookie `ats_plan` (espejo del entitlement local).
 * Sin cookie: deja pasar (el gate cliente cubre); con cookie free: redirige a precios.
 * Las APIs caras siguen exigiendo plan cloud.
 */
export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (!needsCarrera(path)) return NextResponse.next();

  const raw = req.cookies.get("ats_plan")?.value;
  if (!raw) return NextResponse.next();

  const plan = decodeURIComponent(raw).toLowerCase();
  if (PAID.has(plan)) return NextResponse.next();
  if (plan === "paused_90" && allowsPaused90(path)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/precios";
  url.search = "";
  url.searchParams.set("plan", "carrera");
  url.searchParams.set("next", path + (req.nextUrl.search || ""));
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/outplacement/:path*", "/herramientas/:path*", "/ats/:path*"],
};
