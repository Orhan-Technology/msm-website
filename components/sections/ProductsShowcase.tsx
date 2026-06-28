import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { products } from "@/lib/products";

export default function ProductsShowcase({
  eyebrowNumber = "02",
}: {
  eyebrowNumber?: string;
}) {
  return (
    <section className="section bg-sand text-ink">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrowNumber={eyebrowNumber}
            eyebrowLabel="Products"
            title="Steel built to specification"
            description="Certified rebar, angles and T-bars today — with new structural products to ASTM A36 and EN 10025 standards on the way."
          />
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 font-display text-sm font-medium text-accent hover:text-accent-hover"
          >
            Browse all products
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 6).map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 0.08} as="article">
              <Link
                href={`/product/${p.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-card border border-line-light bg-white transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_24px_50px_-28px_rgba(0,0,0,0.3)]"
              >
                <div className="relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    decoding="async"
                    className="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* accent line draws across on hover */}
                  <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100" />
                  {/* category badge */}
                  <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-medium text-white">
                    {p.category}
                  </span>
                  {p.comingSoon && (
                    <span className="absolute right-4 top-4 rounded-full bg-ink/80 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      Coming soon
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="group-hover:text-accent">{p.name}</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.specs.slice(0, 2).map((s) => (
                      <span
                        key={s.key}
                        className="rounded-full bg-sand px-3 py-1 text-xs text-ink/65 ring-1 ring-line-light"
                      >
                        {s.key}: {s.value}
                      </span>
                    ))}
                  </div>
                  <span className="mt-auto inline-flex items-center gap-2 pt-6 font-display text-sm font-medium text-ink">
                    View product
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
