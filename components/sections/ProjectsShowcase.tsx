import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { projects } from "@/lib/projects";

export default function ProjectsShowcase({
  eyebrowNumber,
  limit,
  showCta = false,
  tone = "light",
}: {
  eyebrowNumber?: string;
  limit?: number;
  showCta?: boolean;
  tone?: "light" | "dark";
}) {
  const items = limit ? projects.slice(0, limit) : projects;
  const dark = tone === "dark";

  return (
    <section className={dark ? "section bg-charcoal text-sand" : "section bg-white text-ink"}>
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrowNumber={eyebrowNumber}
            eyebrowLabel="Major projects"
            tone={tone}
            title="Built into the nation's biggest works"
          />
          {showCta && (
            <Link
              href="/projects"
              className="hidden items-center gap-2 font-display text-sm font-medium text-accent hover:underline sm:inline-flex"
            >
              All projects <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {items.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <article
                className={`group flex h-full flex-col overflow-hidden rounded-card border transition-all duration-300 hover:-translate-y-1 ${
                  dark
                    ? "border-line-dark bg-elevated hover:border-accent/40"
                    : "border-line-light bg-sand hover:border-ink/20"
                }`}
              >
                <div className="relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    decoding="async"
                    className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-charcoal/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sand backdrop-blur">
                    {p.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <div className="flex items-center gap-2 text-xs text-accent">
                    <span className="font-display font-semibold">{p.year}</span>
                    <span className={dark ? "text-mist" : "text-ink/40"}>
                      · {p.location}
                    </span>
                  </div>
                  <h3 className={`mt-2 text-xl ${dark ? "text-sand" : ""}`}>
                    {p.title}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-accent/90">
                    {p.partner}
                  </p>
                  <p
                    className={`mt-3 flex-1 text-sm leading-relaxed ${
                      dark ? "text-mist" : "text-ink/60"
                    }`}
                  >
                    {p.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {showCta && (
          <div className="mt-8 sm:hidden">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 font-display text-sm font-medium text-accent hover:underline"
            >
              All projects <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
