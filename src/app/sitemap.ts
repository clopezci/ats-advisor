import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://ats-advisor-two.vercel.app";
  const paths = [
    "",
    "/ats",
    "/outplacement",
    "/outplacement/out09",
    "/tracker",
    "/outplacement/entrevista",
    "/outplacement/90-dias",
    "/outplacement/out09/player",
    "/precios",
    "/auth",
    "/cuenta",
    "/cuenta/cvs",
    "/legal/privacidad",
    "/legal/terminos",
    "/herramientas",
    "/herramientas/checklist",
    "/herramientas/linkedin",
    "/herramientas/carta",
    "/herramientas/salario",
  ];
  return paths.map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.7,
  }));
}
