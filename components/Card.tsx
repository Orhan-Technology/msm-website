import { cn } from "@/lib/utils";

type Props = {
  tone?: "light" | "dark";
  hover?: boolean;
  className?: string;
  children: React.ReactNode;
};

/** Base elevated card. Lifts and brightens its border on hover. */
export default function Card({
  tone = "light",
  hover = true,
  className,
  children,
}: Props) {
  return (
    <div
      className={cn(
        "rounded-card border transition-all duration-300",
        tone === "dark"
          ? "border-line-dark bg-elevated text-sand"
          : "border-line-light bg-white text-ink",
        hover &&
          (tone === "dark"
            ? "hover:-translate-y-1 hover:border-white/20"
            : "hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.25)]"),
        className,
      )}
    >
      {children}
    </div>
  );
}
