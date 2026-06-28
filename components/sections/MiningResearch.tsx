import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import { mining } from "@/lib/content";

export default function MiningResearch({
  eyebrowNumber,
}: {
  eyebrowNumber?: string;
}) {
  return (
    <section className="section bg-sand text-ink">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className="order-2 lg:order-1">
          <div className="grid grid-cols-2 gap-4">
            {/* Left column — offset down for an editorial stagger */}
            <div className="flex flex-col gap-4 pt-10">
              {[
                "/images/plant/molten-ladle.jpg",
                "/images/plant/furnace-sparks.jpg",
              ].map((src) => (
                <div key={src} className="overflow-hidden rounded-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt="Molten steel and casting at the Maisam mill"
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
              ))}
            </div>
            {/* Right column */}
            <div className="flex flex-col gap-4">
              {[
                "/images/plant/billet-glow.jpg",
                "/images/plant/molten-stream.jpg",
              ].map((src) => (
                <div key={src} className="overflow-hidden rounded-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt="Molten steel and casting at the Maisam mill"
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="order-1 lg:order-2">
          <SectionHeading
            eyebrowNumber={eyebrowNumber}
            eyebrowLabel={mining.eyebrow}
            title={mining.title}
            description={mining.lead}
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {mining.points.map((p) => (
              <div key={p.title} className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-btn bg-white text-accent ring-1 ring-line-light">
                  <Icon name={p.icon} className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base">{p.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink/60">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
