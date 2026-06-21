import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import { services } from "@/lib/services";

const cardImages = [
  "/images/service-1.jpg",
  "/images/service-2.jpg",
  "/images/service-3.jpg",
  "/images/service-4.jpg",
];

export default function ServicesGrid({
  eyebrowNumber = "02",
}: {
  eyebrowNumber?: string;
}) {
  const items = services.slice(0, 4);
  return (
    <section className="section bg-sand text-ink">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrowNumber={eyebrowNumber}
            eyebrowLabel="Services"
            title="A comprehensive set of services"
          />
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 font-display text-sm font-medium text-accent hover:text-accent-hover"
          >
            Browse all services
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.08} as="article">
              <Link
                href={`/service/${s.slug}`}
                className="group relative flex h-[440px] flex-col justify-between overflow-hidden rounded-card p-7 text-sand"
              >
                {/* background photo */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cardImages[i]}
                  alt={s.title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/75 to-charcoal/25 transition-colors duration-500 group-hover:from-charcoal group-hover:via-charcoal/70" />
                {/* accent top line on hover */}
                <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100" />

                {/* top row: icon + index */}
                <div className="relative flex items-start justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-btn bg-white/10 text-accent ring-1 ring-white/15 backdrop-blur transition-colors duration-300 group-hover:bg-accent group-hover:text-white group-hover:ring-accent">
                    <Icon name={s.icon} className="h-6 w-6" />
                  </span>
                  <span className="font-display text-5xl font-bold leading-none text-white/15 transition-colors duration-300 group-hover:text-accent/40">
                    0{i + 1}
                  </span>
                </div>

                {/* bottom: title + desc + arrow */}
                <div className="relative">
                  <h3 className="text-sand">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-sand/70">
                    {s.shortDescription}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 font-display text-sm font-medium text-sand">
                    Learn more
                    <span className="grid h-8 w-8 place-items-center rounded-full border border-white/25 transition-colors duration-300 group-hover:border-accent group-hover:bg-accent">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
