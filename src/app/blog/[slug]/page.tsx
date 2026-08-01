import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_POSTS, getPost } from "@/lib/blog/posts";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  return { title: post ? `${post.title} · ATSAdvisor` : "Blog" };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <div className="flex flex-1 flex-col gap-5">
      <article className="bento-card space-y-4">
        <h1 className="text-2xl font-semibold leading-tight">{post.title}</h1>
        <p className="text-sm muted">{post.excerpt}</p>
        {post.body.map((p) => (
          <p key={p.slice(0, 24)} className="text-sm leading-relaxed">
            {p}
          </p>
        ))}
      </article>
      <Link href="/blog" className="btn-secondary">
        Más artículos
      </Link>
      <Link href="/ats" className="btn-primary">
        Probar ATS gratis
      </Link>
    </div>
  );
}
