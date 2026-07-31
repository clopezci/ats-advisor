import Link from "next/link";

export const metadata = {
  title: "Blog",
  description: "Guías gratuitas para pasar ATS y mejorar tu búsqueda de empleo en español.",
};

const POSTS = [
  {
    slug: "que-es-un-ats",
    title: "Qué es un ATS y por qué descarta CVs buenos",
    excerpt: "Entiende el filtro automático y cómo escribir para humanos y robots.",
  },
  {
    slug: "cv-una-columna",
    title: "Por qué tu CV debe ser de una columna",
    excerpt: "Diseño bonito vs parseable: la diferencia que te saca del proceso.",
  },
  {
    slug: "keywords-sin-mentir",
    title: "Keywords sin mentir: alinea tu CV a la oferta",
    excerpt: "Cómo integrar términos de la vacante sin inventar experiencia.",
  },
];

export default function BlogPage() {
  return (
    <div className="flex flex-1 flex-col gap-5">
      <h1 className="text-2xl font-semibold">Blog ATSAdvisor</h1>
      <p className="text-sm muted">Contenido SEO gratuito para hispanohablantes.</p>
      {POSTS.map((p) => (
        <Link key={p.slug} href={`/blog/${p.slug}`} className="bento-card block">
          <h2 className="font-semibold">{p.title}</h2>
          <p className="mt-1 text-sm muted">{p.excerpt}</p>
        </Link>
      ))}
      <Link href="/" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
