import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
};

/** Dark inner-page banner. Accounts for the fixed header height. */
export default function PageHero({ eyebrow, title, lead, align = "left" }: Props) {
  return (
    <section className="bg-charcoal text-sand">
      <div
        className={cn(
          "container-x pb-16 pt-36 md:pb-20 md:pt-40",
          align === "center" && "text-center",
        )}
      >
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1
          className={cn(
            "mt-4 max-w-3xl text-sand text-balance",
            align === "center" && "mx-auto",
          )}
        >
          {title}
        </h1>
        {lead && (
          <p
            className={cn(
              "mt-5 max-w-2xl text-base leading-relaxed text-mist md:text-lg",
              align === "center" && "mx-auto",
            )}
          >
            {lead}
          </p>
        )}
      </div>
    </section>
  );
}
