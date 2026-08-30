import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { section } from "@/lib/cms/content";
import { getProjects } from "@/lib/cms/site-data";

type ProjectsContent = {
  eyebrowNumber: string;
  eyebrowLabel: string;
  title: string;
  limit: number;
  linkLabel: string;
  linkHref: string;
};

export default async function ProjectsShowcase({
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
  const [content, projects] = await Promise.all([section<ProjectsContent>("home.projects"), getProjects()]);
  const cap = limit ?? (showCta ? Number(content.limit) || undefined : undefined);
  const items = cap ? projects.slice(0, cap) : projects;
  const dark = tone === "dark";

  return (
    <section className={dark ? "section bg-charcoal text-sand" : "section bg-white text-ink"}>
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrowNumber={eyebrowNumber ?? content.eyebrowNumber}
            eyebrowLabel={content.eyebrowLabel}
            tone={tone}
            title={content.title}
          />
          {showCta && content.linkLabel && (
            <Link
              href={content.linkHref || "/projects"}
              className="hidden items-center gap-2 font-display text-sm font-medium text-accent hover:underline sm:inline-flex"
            >
              {content.linkLabel} <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {items.map((project, index) => (
            <Reveal key={`${project.title}-${index}`} delay={index * 0.08}>
              <article
                className={`group flex h-full flex-col overflow-hidden rounded-card border transition-all duration-300 hover:-translate-y-1 ${
                  dark
                    ? "border-line-dark bg-elevated hover:border-accent/40"
                    : "border-line-light bg-sand hover:border-ink/20"
                }`}
              >
                <div className="relative overflow-hidden">
                  {project.video ? (
                    <video
                      src={project.video}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      poster={project.image || undefined}
                      className="h-56 w-full object-cover"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <span className="absolute start-4 top-4 rounded-full bg-charcoal/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sand backdrop-blur">
                    {project.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <div className="flex items-center gap-2 text-xs text-accent">
                    <span className="font-display font-semibold">{project.year}</span>
                    <span className={dark ? "text-mist" : "text-ink/40"}>· {project.location}</span>
                  </div>
                  <h3 className={`mt-2 text-xl ${dark ? "text-sand" : ""}`}>{project.title}</h3>
                  <p className="mt-1 text-sm font-medium text-accent/90">{project.partner}</p>
                  <p className={`mt-3 flex-1 text-sm leading-relaxed ${dark ? "text-mist" : "text-ink/60"}`}>
                    {project.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {showCta && content.linkLabel && (
          <div className="mt-8 sm:hidden">
            <Link
              href={content.linkHref || "/projects"}
              className="inline-flex items-center gap-2 font-display text-sm font-medium text-accent hover:underline"
            >
              {content.linkLabel} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
