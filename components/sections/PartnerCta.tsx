import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import { partner } from "@/lib/content";

export default function PartnerCta({
  eyebrowNumber,
}: {
  eyebrowNumber?: string;
}) {
  return (
    <section className="section bg-sand text-ink">
      <div className="container-x">
        <SectionHeading
          align="center"
          eyebrowNumber={eyebrowNumber}
          eyebrowLabel={partner.eyebrow}
          title={partner.title}
          description={partner.lead}
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {partner.options.map((o, i) => (
            <Reveal key={o.title} delay={i * 0.08}>
              <div className="group relative flex h-full flex-col overflow-hidden rounded-card border border-line-light bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_24px_50px_-28px_rgba(0,0,0,0.18)]">
                <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100" />
                <span className="grid h-12 w-12 place-items-center rounded-btn bg-sand text-accent ring-1 ring-line-light transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                  <Icon name={o.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg">{o.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/60">
                  {o.desc}
                </p>
                <span className="mt-5 block h-0.5 w-10 bg-accent/25 transition-all duration-500 group-hover:w-16 group-hover:bg-accent" />
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/contact"
            className="sheen-btn inline-flex items-center gap-2 rounded-btn bg-accent px-8 py-4 font-display text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Partner with us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
