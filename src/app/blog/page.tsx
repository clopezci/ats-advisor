import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog/posts";

export const metadata = { title: "Blog · ATSAdvisor" };

export default function BlogPage() {
  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="bento-card space-y-2">
        <h1 className="text-2xl font-semibold">Blog</h1>
        <p className="text-sm muted">Guías gratis de ATS, empleo y outplacement en español LATAM.</p>
      </section>
      <div className="space-y-3">
        {BLOG_POSTS.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="bento-card block">
            <h2 className="font-semibold">{p.title}</h2>
            <p className="mt-1 text-sm muted">{p.excerpt}</p>
          </Link>
        ))}
      </div>
      <Link href="/" className="btn-secondary">
        Volver
      </Link>
    </div>
  );
}
