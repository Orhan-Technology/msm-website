import { Quote, Star } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { testimonials } from "@/lib/testimonials";

export default function Testimonials() {
  return (
    <section className="section bg-charcoal text-sand">
      <div className="container-x">
        <SectionHeading
          eyebrowNumber="06"
          eyebrowLabel="Testimonials"
          tone="dark"
          align="center"
          title="What our clients say about our work"
        />
        <div className="mt-16 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible">
          {testimonials.map((t, i) => (
            <Reveal
              key={t.name}
              delay={i * 0.08}
              className="min-w-[85%] snap-center md:min-w-0"
            >
              <figure className="group relative flex h-full min-h-[440px] flex-col rounded-card bg-white p-8 pt-14 text-ink shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_34px_70px_-30px_rgba(0,0,0,0.7)]">
                {/* quote badge straddling the top edge */}
                <span className="absolute -top-6 left-8 grid h-14 w-14 place-items-center rounded-full bg-accent text-white shadow-lg">
                  <Quote className="h-6 w-6" fill="currentColor" strokeWidth={0} />
                </span>

                {/* rating */}
                <div className="flex gap-1 text-accent">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-4 w-4" fill="currentColor" strokeWidth={0} />
                  ))}
                </div>

                <blockquote className="mt-5 flex-1 text-[1.05rem] leading-relaxed text-ink/80">
                  “{t.quote}”
                </blockquote>

                <figcaption className="mt-7 flex items-center gap-3 border-t border-line-light pt-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.image}
                    alt={t.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-accent/30 ring-offset-2 ring-offset-white"
                  />
                  <div>
                    <p className="font-display font-semibold text-ink">{t.name}</p>
                    <p className="text-sm text-ink/55">{t.location}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
