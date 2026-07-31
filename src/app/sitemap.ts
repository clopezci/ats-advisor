import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://ats-advisor-two.vercel.app";
  const paths = ["", "/ats", "/outplacement", "/outplacement/out09", "/cuenta", "/legal/privacidad", "/legal/terminos", "/herramientas", "/herramientas/checklist"];
  return paths.map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.7,
  }));
}
