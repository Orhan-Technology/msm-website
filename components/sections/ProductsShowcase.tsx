import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { section } from "@/lib/cms/content";
import { getProducts } from "@/lib/cms/site-data";

type ProductsContent = {
  eyebrowNumber: string;
  eyebrowLabel: string;
  title: string;
  description: string;
  linkLabel: string;
  linkHref: string;
  limit: number;
};

export default async function ProductsShowcase({ eyebrowNumber }: { eyebrowNumber?: string }) {
  const [content, products, t] = await Promise.all([
    section<ProductsContent>("home.products"),
    getProducts(),
    getTranslations("common"),
  ]);
  const items = products.slice(0, Number(content.limit) || 6);

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
            <Link
              href={content.linkHref || "/products"}
              className="group inline-flex items-center gap-2 font-display text-sm font-medium text-accent hover:text-accent-hover"
            >
              {content.linkLabel}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((product, index) => (
            <Reveal key={product.slug} delay={(index % 3) * 0.08} as="article">
              <Link
                href={`/product/${product.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-card border border-line-light bg-white transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_24px_50px_-28px_rgba(0,0,0,0.3)]"
              >
                <div className="relative overflow-hidden">
                  {product.video ? (
                    <video
                      src={product.video}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      poster={product.image || undefined}
                      className="h-60 w-full object-cover"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      className="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100" />
                  <span className="absolute start-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-medium text-white">
                    {product.category}
                  </span>
                  {product.comingSoon && (
                    <span className="absolute end-4 top-4 rounded-full bg-ink/80 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      {t("comingSoon")}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="group-hover:text-accent">{product.name}</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(product.specs ?? []).slice(0, 2).map((spec) => (
                      <span
                        key={spec.key}
                        className="rounded-full bg-sand px-3 py-1 text-xs text-ink/65 ring-1 ring-line-light"
                      >
                        {spec.key}: {spec.value}
                      </span>
                    ))}
                  </div>
                  <span className="mt-auto inline-flex items-center gap-2 pt-6 font-display text-sm font-medium text-ink">
                    {t("viewProduct")}
                    <span className="grid h-8 w-8 place-items-center rounded-full border border-line-light transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
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
