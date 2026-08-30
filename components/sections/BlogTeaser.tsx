import { Link } from "@/i18n/navigation";
import Button from "@/components/Button";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { section } from "@/lib/cms/content";
import { getPosts } from "@/lib/cms/site-data";

type BlogContent = {
  eyebrowNumber: string;
  eyebrowLabel: string;
  title: string;
  description: string;
  limit: number;
  linkLabel: string;
  linkHref: string;
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

export default async function BlogTeaser({ eyebrowNumber }: { eyebrowNumber?: string }) {
  const [content, posts] = await Promise.all([section<BlogContent>("home.blog"), getPosts()]);
  const latest = posts.slice(0, Number(content.limit) || 3);
  if (!latest.length) return null;

  return (
    <section className="section bg-sand text-ink">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrowNumber={eyebrowNumber ?? content.eyebrowNumber}
            eyebrowLabel={content.eyebrowLabel}
            title={content.title}
            description={content.description}
          />
          {content.linkLabel && (
            <Button href={content.linkHref || "/blog"} variant="secondary" arrow={false}>
              {content.linkLabel}
            </Button>
          )}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {latest.map((post, index) => (
            <Reveal key={post.slug} delay={index * 0.08} as="article">
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-card border border-line-light bg-white transition-all duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.25)]"
              >
                <div className="relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    decoding="async"
                    className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute start-4 top-4 rounded-full bg-charcoal/85 px-3 py-1 text-xs font-medium text-sand">
                    {post.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl leading-snug group-hover:text-accent">{post.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/60">{post.excerpt}</p>
                  <span className="mt-5 text-xs text-ink/45">
                    {fmtDate(post.date)} · {post.author}
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
