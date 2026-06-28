import { Quote } from "lucide-react";
import Reveal from "@/components/Reveal";
import { ceoMessage } from "@/lib/content";

export default function CeoMessage({
  eyebrowNumber,
}: {
  eyebrowNumber?: string;
}) {
  return (
    <section className="section bg-white text-ink">
      <div className="container-x grid gap-12 lg:grid-cols-[360px_1fr] lg:gap-16">
        {/* Portrait + identity */}
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-card border border-line-light">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ceoMessage.image}
                alt={ceoMessage.name}
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <p className="mt-5 font-display text-xl font-semibold">
              {ceoMessage.name}
            </p>
            <p className="text-sm text-accent">{ceoMessage.role}</p>
          </div>
        </Reveal>

        {/* Message */}
        <Reveal delay={0.1}>
          <div className="flex items-center gap-3">
            {eyebrowNumber && (
              <span className="font-display text-5xl font-bold leading-none text-accent md:text-6xl">
                {eyebrowNumber}
              </span>
            )}
            <span className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-accent/75">
              A message from our CEO
            </span>
          </div>
          <Quote className="mt-6 h-12 w-12 text-accent/25" />
          <p className="mt-4 font-display text-2xl font-semibold leading-snug md:text-3xl">
            {ceoMessage.greeting}
          </p>
          <div className="mt-6 space-y-5">
            {ceoMessage.paragraphs.map((p, i) => (
              <p key={i} className="text-base leading-relaxed text-ink/70">
                {p}
              </p>
            ))}
          </div>
          <p className="mt-8 font-display text-lg font-semibold">
            {ceoMessage.name}
          </p>
          <span className="mt-2 block h-0.5 w-12 bg-accent" />
        </Reveal>
      </div>
    </section>
  );
}
