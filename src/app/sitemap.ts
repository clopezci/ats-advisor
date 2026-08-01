import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://ats-advisor-two.vercel.app";
  const paths = [
    "",
    "/ats",
    "/outplacement",
    "/outplacement/out09",
    "/capacidades",
    "/empresa",
    "/empresa/dashboard",
    "/empresa/invitaciones",
    "/blog",
    "/blog/que-es-un-ats",
    "/blog/cv-una-columna",
    "/blog/keywords-sin-mentir",
    "/ats/historial",
    "/feedback",
    "/tracker",
    "/outplacement/entrevista",
    "/outplacement/filtro",
    "/outplacement/90-dias",
    "/outplacement/segunda-carrera",
    "/outplacement/certificado",
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
    "/herramientas/plantilla",
    "/herramientas/entrevistas",
    "/herramientas/cultura",
  ];
  return paths.map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.7,
  }));
}
