import { getTranslations } from "next-intl/server";
import { Check } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { section } from "@/lib/cms/content";
import { flattenTexts, getCompany } from "@/lib/cms/site-data";

type PresenceContent = {
  eyebrowNumber: string;
  eyebrowLabel: string;
  titleLead: string;
  titleAccent: string;
  description: string;
  tradingEyebrow: string;
  tradingTitle: string;
  tradingLead: string;
  tradingPoints: unknown;
};

export default async function GlobalPresence({ eyebrowNumber }: { eyebrowNumber?: string }) {
  const [content, company, t] = await Promise.all([
    section<PresenceContent>("home.presence"),
    getCompany(),
    getTranslations("common"),
  ]);
  const tradingPoints = flattenTexts(content.tradingPoints);
  const offices = company.offices ?? [];

  return (
    <section className="section bg-sand text-ink">
      <div className="container-x">
        <SectionHeading
          eyebrowNumber={eyebrowNumber ?? content.eyebrowNumber}
          eyebrowLabel={content.eyebrowLabel}
          title={
            <>
              {content.titleLead}{" "}
              {content.titleAccent && <span className="text-accent">{content.titleAccent}</span>}
            </>
          }
          description={content.description}
        />

        {/* Office cards — full-bleed city photos */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {offices.map((office, index) => (
            <Reveal key={`${office.city}-${index}`} delay={index * 0.08}>
              <div className="group relative h-[480px] cursor-default overflow-hidden rounded-card border-2 border-transparent transition-colors duration-500 hover:border-accent/50">
                {office.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={office.image}
                    alt={`${office.city}, ${office.country}`}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                  />
                ) : (
                  <span className="absolute inset-0 bg-charcoal" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/40 to-charcoal/20" />

                <div className="absolute end-4 top-4">
                  {office.status === "expanding" ? (
                    <span className="rounded-full bg-accent px-3 py-1 font-display text-[10px] font-semibold uppercase tracking-wider text-white shadow-lg">
                      {t("expanding")}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 font-display text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      {t("operating")}
                    </span>
                  )}
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="mb-4 block h-[2px] w-8 bg-accent transition-all duration-500 group-hover:w-16" />

                  <p className="font-display text-[11px] font-semibold uppercase tracking-[0.15em] text-accent">
                    {office.role}
                  </p>

                  <h3 className="mt-2 text-[1.9rem] leading-tight text-sand" style={{ fontStretch: "115%" }}>
                    {office.city}
                  </h3>
                  <p className="mt-0.5 font-display text-sm text-mist/70">{office.country}</p>

                  <p className="mt-3 translate-y-3 text-sm leading-relaxed text-mist/75 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                    {office.detail}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Trading division */}
        {(content.tradingTitle || tradingPoints.length > 0) && (
          <Reveal delay={0.1}>
            <div className="relative mt-6 overflow-hidden rounded-card bg-charcoal text-sand">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/15 blur-3xl"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.05]"
                style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "24px 24px" }}
              />
              <div className="relative grid gap-8 p-8 md:grid-cols-2 md:items-center md:p-12">
                <div>
                  <span className="eyebrow">{content.tradingEyebrow}</span>
                  <h3 className="mt-3 text-2xl text-sand md:text-3xl">{content.tradingTitle}</h3>
                  <p className="mt-4 text-base leading-relaxed text-mist">{content.tradingLead}</p>
                </div>
                <ul className="space-y-3">
                  {tradingPoints.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-3 rounded-card border border-line-dark bg-white/[0.03] p-4 text-sand/90"
                    >
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-white">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-sm leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
