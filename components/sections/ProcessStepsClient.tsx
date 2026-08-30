"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useReducedMotion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import Button from "@/components/Button";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";

export type ProcessStep = { no: string; title: string; icon: string; desc: string };

export default function ProcessStepsClient({
  eyebrowNumber,
  eyebrowLabel,
  title,
  lead,
  steps,
  closingText,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
}: {
  eyebrowNumber?: string;
  eyebrowLabel: string;
  title: string;
  lead: string;
  steps: ProcessStep[];
  closingText: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
}) {
  const t = useTranslations("lab");
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 80%"] });

  return (
    <section className="section bg-charcoal text-sand">
      <div className="container-x grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        {/* Sticky heading */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrowNumber={eyebrowNumber}
            eyebrowLabel={eyebrowLabel}
            tone="dark"
            title={title}
          />
          {lead && <p className="mt-6 max-w-md text-base leading-relaxed text-mist">{lead}</p>}
        </div>

        {/* Scroll-driven timeline */}
        <div ref={ref} className="relative">
          <div className="absolute bottom-3 start-[27px] top-3 w-0.5 rounded bg-line-dark" />
          <motion.div
            className="absolute start-[27px] top-3 w-0.5 origin-top rounded bg-accent"
            style={{ height: "calc(100% - 24px)", scaleY: reduce ? 1 : scrollYProgress }}
          />

          {steps.map((step, index) => (
            <motion.div
              key={`${step.no}-${index}`}
              className="relative pb-14 ps-20 last:pb-0 md:pb-24"
              initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.55 }}
              transition={{ duration: 0.55, ease: [0.22, 0.72, 0.2, 1] }}
            >
              <motion.div
                className="absolute start-0 top-0 grid h-14 w-14 place-items-center rounded-full ring-1 ring-accent/40"
                initial={
                  reduce
                    ? { backgroundColor: "#E2562B", color: "#ffffff", scale: 1 }
                    : { backgroundColor: "#0E0E10", color: "#E2562B", scale: 0.85 }
                }
                whileInView={{ backgroundColor: "#E2562B", color: "#ffffff", scale: 1 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <Icon name={step.icon} className="h-6 w-6" />
              </motion.div>

              <span className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                {t("stage")} {step.no}
              </span>
              <h3 className="mt-2 text-2xl text-sand md:text-3xl">{step.title}</h3>
              <p className="mt-3 max-w-md text-base leading-relaxed text-mist">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTAs reveal at the end of the journey */}
      <div className="container-x mt-16">
        <Reveal className="flex flex-col items-start gap-5 border-t border-line-dark pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-xl text-sand md:text-2xl">{closingText}</p>
          <div className="flex flex-wrap gap-4">
            {primaryCtaLabel && <Button href={primaryCtaHref || "/contact"}>{primaryCtaLabel}</Button>}
            {secondaryCtaLabel && (
              <Link
                href={secondaryCtaHref || "/services"}
                className="sheen-btn inline-flex items-center justify-center gap-2 rounded-btn border border-sand/25 px-5 py-3 font-display text-sm font-medium text-sand transition-colors hover:bg-sand hover:text-ink"
              >
                {secondaryCtaLabel}
              </Link>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
