import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import BlogList from "@/components/BlogList";
import { fmtDate } from "@/components/PostCard";
import { posts } from "@/lib/posts";

export const metadata = { title: "Blog — Maisam Steel Mill" };

export default function BlogPage() {
  const sorted = [...posts].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const [featured, ...rest] = sorted;

  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="Blog"
          title={
            <>
              News &amp; <span className="text-accent">articles</span>
            </>
          }
          lead="Guides, resources and updates from the mill floor."
        />

        <section className="section bg-sand text-ink">
          <div className="container-x">
            {/* Featured */}
            <Link
              href={`/blog/${featured.slug}`}
              className="group grid overflow-hidden rounded-card border border-line-light bg-white transition-all duration-300 hover:border-ink/20 hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.25)] lg:grid-cols-2"
            >
              <div className="relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105 lg:h-full"
                />
                <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-medium text-white">
                  Featured · {featured.category}
                </span>
              </div>
              <div className="flex flex-col justify-center p-8 md:p-12">
                <h2 className="group-hover:text-accent">{featured.title}</h2>
                <p className="mt-4 text-base leading-relaxed text-ink/65">
                  {featured.excerpt}
                </p>
                <span className="mt-6 text-sm text-ink/45">
                  {fmtDate(featured.date)} · {featured.author}
                </span>
              </div>
            </Link>

            <div className="mt-12">
              <BlogList posts={rest} variant="grid" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
