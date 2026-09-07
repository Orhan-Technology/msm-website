import { Quote, Star } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { section } from "@/lib/cms/content";
import type { Testimonial } from "@/lib/testimonials";

type TestimonialsContent = {
  eyebrowNumber: string;
  eyebrowLabel: string;
  title: string;
  items: Testimonial[];
};

export default async function Testimonials({ eyebrowNumber }: { eyebrowNumber?: string }) {
  const content = await section<TestimonialsContent>("home.testimonials");
  const items = content.items ?? [];
  if (!items.length) return null;

  return (
    <section className="section bg-charcoal text-sand">
      <div className="container-x">
        <SectionHeading
          eyebrowNumber={eyebrowNumber ?? content.eyebrowNumber}
          eyebrowLabel={content.eyebrowLabel}
          tone="dark"
          align="center"
          title={content.title}
        />
        <div className="mt-16 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible">
          {items.map((testimonial, index) => (
            <Reveal
              key={`${testimonial.name}-${index}`}
              delay={index * 0.08}
              className="min-w-[85%] snap-center md:min-w-0"
            >
              <figure className="group relative flex h-full min-h-[440px] flex-col rounded-card bg-white p-8 pt-14 text-ink shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_34px_70px_-30px_rgba(0,0,0,0.7)]">
                <span className="absolute -top-6 start-8 grid h-14 w-14 place-items-center rounded-full bg-accent text-white shadow-lg">
                  <Quote className="h-6 w-6" fill="currentColor" strokeWidth={0} />
                </span>

                <div className="flex gap-1 text-accent">
                  {Array.from({ length: 5 }).map((_, star) => (
                    <Star key={star} className="h-4 w-4" fill="currentColor" strokeWidth={0} />
                  ))}
                </div>

                <blockquote className="mt-5 flex-1 text-[1.05rem] leading-relaxed text-ink/80">
                  “{testimonial.quote}”
                </blockquote>

                <figcaption className="mt-7 flex items-center gap-3 border-t border-line-light pt-6">
                  {testimonial.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      loading="lazy"
                      decoding="async"
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-accent/30 ring-offset-2 ring-offset-white"
                    />
                  )}
                  <div>
                    <p className="font-display font-semibold text-ink">{testimonial.name}</p>
                    <p className="text-sm text-ink/55">{testimonial.location}</p>
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
