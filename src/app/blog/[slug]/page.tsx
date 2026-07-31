import Link from "next/link";
import { notFound } from "next/navigation";

const POSTS: Record<string, { title: string; body: string[] }> = {
  "que-es-un-ats": {
    title: "Qué es un ATS y por qué descarta CVs buenos",
    body: [
      "Un ATS (Applicant Tracking System) es el software que usan muchas empresas para recibir, ordenar y filtrar candidaturas antes de que un reclutador humano las revise.",
      "No 'odia' a los candidatos: busca estructura, palabras clave y evidencia. Si tu CV es una imagen bonita, multi-columna o con iconos en vez de texto, el parse falla.",
      "ATSAdvisor te ayuda a medir compatibilidad contra una oferta concreta y a corregir formato, gaps y riesgos (como keyword stuffing).",
    ],
  },
  "cv-una-columna": {
    title: "Por qué tu CV debe ser de una columna",
    body: [
      "Los parsers de Workday, Taleo y similares leen de arriba abajo. Las columnas, tablas y sidebars rompen el orden del texto.",
      "Usa una columna, tipografía estándar, secciones claras (Experiencia, Educación, Skills) y PDF con texto seleccionable.",
      "Guarda el diseño creativo para tu portafolio o un one-pager humano, no para el primer filtro.",
    ],
  },
  "keywords-sin-mentir": {
    title: "Keywords sin mentir: alinea tu CV a la oferta",
    body: [
      "Copia el lenguaje de la oferta solo cuando refleje tu experiencia real. Si usaste 'flujo de caja', no digas 'tesorería corporativa' si nunca la hiciste.",
      "Mejor: traduce logros a los términos del aviso y añade evidencia (%, tiempo, alcance).",
      "ATSAdvisor lista faltantes y te sugiere reescrituras fieles con IA cuando configuras las API keys.",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(POSTS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = POSTS[slug];
  return { title: post?.title || "Blog" };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) notFound();

  return (
    <article className="flex flex-1 flex-col gap-5">
      <h1 className="text-2xl font-semibold leading-tight">{post.title}</h1>
      {post.body.map((p) => (
        <p key={p.slice(0, 24)} className="text-sm muted leading-relaxed">
          {p}
        </p>
      ))}
      <Link href="/ats" className="btn-primary">
        Probar analizador ATS
      </Link>
      <Link href="/blog" className="btn-secondary">
        Volver al blog
      </Link>
    </article>
  );
}
