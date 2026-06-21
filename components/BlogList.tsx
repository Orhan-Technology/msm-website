"use client";

import { useState } from "react";
import PostCard from "@/components/PostCard";
import { cn } from "@/lib/utils";
import { postCategories, type Post } from "@/lib/posts";

type Props = {
  posts: Post[];
  variant?: "grid" | "horizontal";
};

export default function BlogList({ posts, variant = "grid" }: Props) {
  const [active, setActive] = useState<string>("All");
  const filtered =
    active === "All" ? posts : posts.filter((p) => p.category === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2.5">
        {["All", ...postCategories].map((c) => (
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
