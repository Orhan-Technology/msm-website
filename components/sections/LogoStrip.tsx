import SectionHeading from "@/components/SectionHeading";
import { section } from "@/lib/cms/content";

type LogosContent = {
  eyebrowNumber: string;
  eyebrowLabel: string;
  title: string;
  partners: { name: string; logo?: string }[];
};

export default async function LogoStrip({ eyebrowNumber }: { eyebrowNumber?: string }) {
  const content = await section<LogosContent>("home.logos");
  const partners = (content.partners ?? []).filter((partner) => partner?.name || partner?.logo);
  if (!partners.length) return null;

  // Duplicated so the marquee can loop seamlessly at -50%.
  const row = [...partners, ...partners];

  return (
    <section className="section bg-sand text-ink">
      <div className="container-x">
        <SectionHeading
          eyebrowNumber={eyebrowNumber ?? content.eyebrowNumber}
          eyebrowLabel={content.eyebrowLabel}
          align="center"
          title={content.title}
        />
      </div>
      <div className="group relative mt-12 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-sand to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-sand to-transparent" />
        <div className="flex w-max animate-marquee items-center gap-14 group-hover:[animation-play-state:paused]">
          {row.map((partner, index) =>
            partner.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={index}
                src={partner.logo}
                alt={partner.name}
                loading="lazy"
                decoding="async"
                className="h-14 w-auto max-w-[200px] object-contain opacity-70 mix-blend-multiply transition-opacity hover:opacity-100"
              />
            ) : (
              <span
                key={index}
                className="whitespace-nowrap font-display text-2xl font-semibold tracking-tight text-ink/35"
              >
                {partner.name}
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
