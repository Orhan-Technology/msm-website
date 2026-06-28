import { Check } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { company } from "@/lib/company";
import { trading } from "@/lib/content";

const OFFICE_IMAGES: Record<string, string> = {
  Kabul: "/images/offices/kabul.jpg",
  Nationwide: "/images/offices/nationwide.jpg",
  Dubai: "/images/offices/dubai.jpg",
  Istanbul: "/images/offices/istanbul.jpg",
};

export default function GlobalPresence({
  eyebrowNumber,
}: {
  eyebrowNumber?: string;
}) {
  return (
    <section className="section bg-sand text-ink">
      <div className="container-x">
        <SectionHeading
          eyebrowNumber={eyebrowNumber}
          eyebrowLabel="Where we operate"
          title={
            <>
              A growing footprint across the{" "}
              <span className="text-accent">region</span>
            </>
          }
          description="From our mill in Kabul to trading offices reaching the Gulf and Türkiye — connecting Afghan industry to international supply."
        />

        {/* Office cards — full-bleed city photos */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {company.offices.map((o, i) => (
            <Reveal key={o.city} delay={i * 0.08}>
              <div className="group relative h-[480px] cursor-default overflow-hidden rounded-card border-2 border-transparent transition-colors duration-500 hover:border-accent/50">
                {/* City background image — ken-burns on hover */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={OFFICE_IMAGES[o.city] ?? ""}
                  alt={`${o.city}, ${o.country}`}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                />

                {/* Two-layer gradient: light vignette at top, heavy at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/40 to-charcoal/20" />

                {/* Status badge — top right */}
                <div className="absolute right-4 top-4">
                  {o.status === "expanding" ? (
                    <span className="rounded-full bg-accent px-3 py-1 font-display text-[10px] font-semibold uppercase tracking-wider text-white shadow-lg">
                      Expanding
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 font-display text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Operating
                    </span>
                  )}
                </div>

                {/* Card content — pinned to bottom */}
                <div className="absolute inset-x-0 bottom-0 p-6">
                  {/* Accent grow-line */}
                  <span className="mb-4 block h-[2px] w-8 bg-accent transition-all duration-500 group-hover:w-16" />

                  <p className="font-display text-[11px] font-semibold uppercase tracking-[0.15em] text-accent">
                    {o.role}
                  </p>

                  <h3
                    className="mt-2 text-[1.9rem] leading-tight text-sand"
                    style={{ fontStretch: "115%" }}
                  >
                    {o.city}
                  </h3>
                  <p className="mt-0.5 font-display text-sm text-mist/70">
                    {o.country}
                  </p>

                  {/* Detail — slides up on hover */}
                  <p className="mt-3 translate-y-3 text-sm leading-relaxed text-mist/75 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                    {o.detail}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Trading division */}
        <Reveal delay={0.1}>
          <div className="relative mt-6 overflow-hidden rounded-card bg-charcoal text-sand">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/15 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative grid gap-8 p-8 md:grid-cols-2 md:items-center md:p-12">
              <div>
                <span className="eyebrow">{trading.eyebrow}</span>
                <h3 className="mt-3 text-2xl text-sand md:text-3xl">
                  {trading.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-mist">
                  {trading.lead}
                </p>
              </div>
              <ul className="space-y-3">
                {trading.points.map((p) => (
                  <li
                    key={p}
                    className="flex items-start gap-3 rounded-card border border-line-dark bg-white/[0.03] p-4 text-sand/90"
                  >
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-white">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-sm leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
