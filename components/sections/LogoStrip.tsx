import SectionHeading from "@/components/SectionHeading";

const partners = [
  "Kabul Construction",
  "Herat Infrastructure",
  "Bagram Builders",
  "Nangarhar Cement",
  "Balkh Engineering",
  "Kandahar Contractors",
];

export default function LogoStrip({
  eyebrowNumber = "07",
}: {
  eyebrowNumber?: string;
}) {
  const row = [...partners, ...partners];
  return (
    <section className="section bg-sand text-ink">
      <div className="container-x">
        <SectionHeading
          eyebrowNumber={eyebrowNumber}
          eyebrowLabel="Partners"
          align="center"
          title="Brands & companies we worked with"
        />
      </div>
      <div className="group relative mt-12 overflow-hidden">
        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-sand to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-sand to-transparent" />
        <div className="flex w-max animate-marquee items-center gap-14 group-hover:[animation-play-state:paused]">
          {row.map((name, i) => (
            <span
              key={i}
              className="whitespace-nowrap font-display text-2xl font-semibold tracking-tight text-ink/35"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
