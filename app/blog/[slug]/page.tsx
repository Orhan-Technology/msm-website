import { notFound } from "next/navigation";
import Link from "next/link";
import Markdown from "react-markdown";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostCard, { fmtDate } from "@/components/PostCard";
import NewsletterForm from "@/components/NewsletterForm";
import { posts } from "@/lib/posts";
import { team } from "@/lib/team";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = posts.find((x) => x.slug === slug);
  return {
    title: p ? `${p.title} — Maisam Steel Mill` : "Article",
    description: p?.excerpt,
  };
}

const md = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-10 text-3xl" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mt-8 text-xl" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mt-4 leading-relaxed text-ink/75" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mt-4 list-disc space-y-2 pl-6 text-ink/75" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-relaxed" {...props} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-ink" {...props} />
  ),
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();
  const author = team.find((t) => t.name === post.author);
  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-charcoal text-sand">
          <div className="container-x pb-12 pt-36 md:pt-40">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-mist transition-colors hover:text-accent"
            >
              <ArrowLeft className="h-4 w-4" /> Back to blog
            </Link>
            <span className="eyebrow mt-6 block">{post.category}</span>
            <h1 className="mt-3 max-w-3xl text-sand text-balance">{post.title}</h1>
            <p className="mt-4 text-sm text-mist">
              {fmtDate(post.date)} · By {post.author}
            </p>
          </div>
          <div className="container-x">
            <div className="overflow-hidden rounded-t-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt={post.title}
                className="h-[300px] w-full object-cover md:h-[440px]"
              />
            </div>
          </div>
        </section>

        {/* Body */}
        <section className="section bg-sand text-ink">
          <div className="container-x grid gap-12 lg:grid-cols-[1fr_300px]">
            <article className="max-w-2xl">
              <Markdown components={md}>{post.body}</Markdown>
            </article>

            <aside className="space-y-6">
              {author && (
                <div className="rounded-card border border-line-light bg-white p-6">
                  <p className="eyebrow mb-4">Author</p>
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={author.image}
                      alt={author.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-display font-semibold">{author.name}</p>
                      <p className="text-sm text-ink/55">{author.role}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-ink/60">
                    {author.bio}
                  </p>
                </div>
              )}
              <div className="rounded-card bg-charcoal p-6 text-sand">
                <p className="eyebrow mb-3">Newsletter</p>
                <p className="mb-4 text-sm text-mist">
                  Get new articles in your inbox.
                </p>
                <NewsletterForm />
              </div>
            </aside>
          </div>
        </section>

        {/* Related */}
        <section className="section bg-white text-ink">
          <div className="container-x">
            <h2 className="mb-10">Related articles</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p.slug} post={p} variant="grid" />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
