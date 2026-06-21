import { cn } from "@/lib/utils";

type Props = {
  eyebrowNumber?: string; // "01", "02", ...
  eyebrowLabel?: string; // optional text after the number
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
};

export default function SectionHeading({
  eyebrowNumber,
  eyebrowLabel,
  title,
  description,
  align = "left",
  tone = "light",
  className,
}: Props) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {(eyebrowNumber || eyebrowLabel) && (
        <div
          className={cn(
            "flex items-center gap-3",
            align === "center" && "justify-center",
          )}
        >
          {eyebrowNumber && (
            <span className="font-display text-5xl font-bold leading-none text-accent md:text-6xl">
              {eyebrowNumber}
            </span>
          )}
          {eyebrowLabel && (
            <span className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-accent/75">
              {eyebrowLabel}
            </span>
          )}
        </div>
      )}
      <h2 className={cn("mt-5", tone === "dark" ? "text-sand" : "text-ink")}>
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-5 text-base leading-relaxed md:text-lg",
            tone === "dark" ? "text-mist" : "text-ink/70",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
