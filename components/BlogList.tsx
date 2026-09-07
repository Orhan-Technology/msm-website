"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import PostCard from "@/components/PostCard";
import { cn } from "@/lib/utils";
import type { PostContent } from "@/lib/cms/site-data";

type Props = {
  posts: PostContent[];
  categories: string[];
  variant?: "grid" | "horizontal";
};

export default function BlogList({ posts, categories, variant = "grid" }: Props) {
  const t = useTranslations("blog");
  const allLabel = t("allCategories");
  const [active, setActive] = useState<string>(allLabel);
  const filtered = active === allLabel ? posts : posts.filter((post) => post.category === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2.5">
        {[allLabel, ...categories].map((c) => (
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

      <div
        className={cn(
          "mt-10 grid gap-6",
          variant === "horizontal" ? "lg:grid-cols-2" : "md:grid-cols-3",
        )}
      >
        {filtered.map((p) => (
          <PostCard key={p.slug} post={p} variant={variant} />
        ))}
      </div>
    </div>
  );
}
