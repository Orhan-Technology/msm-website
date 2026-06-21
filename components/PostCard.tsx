import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Post } from "@/lib/posts";

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

type Props = {
  post: Post;
  variant?: "grid" | "horizontal";
};

export default function PostCard({ post, variant = "grid" }: Props) {
  const horizontal = variant === "horizontal";
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group flex overflow-hidden rounded-card border border-line-light bg-white transition-all duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.25)]",
        horizontal ? "flex-col sm:flex-row" : "flex-col",
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden",
          horizontal ? "sm:w-2/5" : "w-full",
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.image}
          alt={post.title}
          className={cn(
            "w-full object-cover transition-transform duration-500 group-hover:scale-105",
            horizontal ? "h-52 sm:h-full" : "h-52",
          )}
        />
        <span className="absolute left-4 top-4 rounded-full bg-charcoal/85 px-3 py-1 text-xs font-medium text-sand">
          {post.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3
          className={cn(
            "leading-snug group-hover:text-accent",
            horizontal ? "text-2xl" : "text-xl",
          )}
        >
          {post.title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/60">
          {post.excerpt}
        </p>
        <span className="mt-5 text-xs text-ink/45">
          {fmtDate(post.date)} · {post.author}
        </span>
      </div>
    </Link>
  );
}
