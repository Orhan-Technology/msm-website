"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductContent } from "@/lib/cms/site-data";

export default function ProductsCatalog({
  products,
  categories,
}: {
  products: ProductContent[];
  categories: string[];
}) {
  const t = useTranslations("common");
  // The first chip is the catch-all. It comes from the CMS and is translated, so
  // it has to be compared by value rather than against a hard-coded "All".
  const allLabel = categories[0] ?? "All";
  const [active, setActive] = useState<string>(allLabel);
  const filtered =
    active === allLabel ? products : products.filter((product) => product.category === active);

  return (
    <div>
      {/* Filter chips */}
      <div className="flex flex-wrap gap-2.5">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActive(category)}
            className={cn(
              "rounded-full border px-4 py-2 font-display text-sm font-medium transition-colors",
              active === category
                ? "border-accent bg-accent text-white"
                : "border-line-light bg-white text-ink/70 hover:border-ink/30",
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <article
            key={product.slug}
            className="group flex flex-col overflow-hidden rounded-card border border-line-light bg-white transition-all duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.25)]"
          >
            <Link href={`/product/${product.slug}`} className="relative overflow-hidden">
              {product.video ? (
                <video
                  src={product.video}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={product.image || undefined}
                  className="h-56 w-full object-cover"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              {product.comingSoon && (
                <span className="absolute end-4 top-4 rounded-full bg-ink/80 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {t("comingSoon")}
                </span>
              )}
            </Link>
            <div className="flex flex-1 flex-col p-6">
              <span className="text-xs font-medium uppercase tracking-wide text-accent">{product.category}</span>
              <Link href={`/product/${product.slug}`}>
                <h3 className="mt-2 group-hover:text-accent">{product.name}</h3>
              </Link>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/60">
                {product.description.length > 92
                  ? `${product.description.slice(0, 92)}…`
                  : product.description}
              </p>
              <Link
                href={`/product/${product.slug}`}
                className="mt-5 inline-flex items-center gap-2 font-display text-sm font-medium text-accent hover:text-accent-hover"
              >
                {t("viewProduct")}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
