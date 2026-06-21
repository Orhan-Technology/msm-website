"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { products, productCategories } from "@/lib/products";

export default function ProductsCatalog() {
  const [active, setActive] = useState<string>("All");
  const filtered =
    active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <div>
      {/* Filter chips */}
      <div className="flex flex-wrap gap-2.5">
        {productCategories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={cn(
              "rounded-full border px-4 py-2 font-display text-sm font-medium transition-colors",
              active === c
                ? "border-accent bg-accent text-white"
                : "border-line-light bg-white text-ink/70 hover:border-ink/30",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <article
            key={p.slug}
            className="group flex flex-col overflow-hidden rounded-card border border-line-light bg-white transition-all duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.25)]"
          >
            <Link href={`/product/${p.slug}`} className="overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image}
                alt={p.name}
                className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
            <div className="flex flex-1 flex-col p-6">
              <span className="text-xs font-medium uppercase tracking-wide text-accent">
                {p.category}
              </span>
              <Link href={`/product/${p.slug}`}>
                <h3 className="mt-2 group-hover:text-accent">{p.name}</h3>
              </Link>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/60">
                {p.description.slice(0, 92)}…
              </p>
              <Link
                href={`/product/${p.slug}`}
                className="mt-5 inline-flex items-center gap-2 font-display text-sm font-medium text-accent hover:text-accent-hover"
              >
                View product
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
