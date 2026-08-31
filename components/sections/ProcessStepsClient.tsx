"use client";

import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, useScroll, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import Button from "@/components/Button";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";

export type ProcessStep = {
  no: string;
  title: string;
  icon: string;
  desc: string;
  /** What leaves this stage — "Molten steel", "Billets", … */
  output?: string;
};

export type ProcessTrack = {
  no: string;
  label: string;
  caption: string;
  /** What the line starts from. Shown once, above the first stage. */
  input?: string;
  steps: ProcessStep[];
};

const EASE = [0.22, 0.72, 0.2, 1] as const;

export default function ProcessStepsClient({
  eyebrowNumber,
  eyebrowLabel,
  title,
  lead,
  processes,
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
  processes: ProcessTrack[];
  closingText: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
}) {
  const t = useTranslations("process");
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // The stage counter is computed, not translated, so it has to be formatted
  // for the active locale — otherwise Dari and Pashto show Latin digits next to
  // Persian ones in the very same readout.
  const num = (value: number, pad = 2) =>
    new Intl.NumberFormat(locale, { minimumIntegerDigits: pad, useGrouping: false }).format(value);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 80%"] });

  const totalStages = processes.reduce((sum, track) => sum + (track.steps?.length ?? 0), 0);

  // A plant-style readout of how far through the line you are. This only ever
  // re-renders when the whole-number stage changes — a handful of times across
  // the section, not once per scroll frame.
  const [stage, setStage] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.max(0, Math.min(totalStages, Math.round(value * totalStages)));
    setStage((prev) => (prev === next ? prev : next));
  });

  return (
    <section className="section bg-charcoal text-sand">
      <div className="container-x grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        {/* ---- Sticky heading + progress readout ---- */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrowNumber={eyebrowNumber}
            eyebrowLabel={eyebrowLabel}
            tone="dark"
            title={title}
          />
          {lead && <p className="mt-6 max-w-md text-base leading-relaxed text-mist">{lead}</p>}

          <div className="mt-8 max-w-[16rem]">
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-mist">
                {t("stage")}
              </span>
              <span className="font-display text-sm font-semibold tabular-nums text-sand">
                <span className="text-accent">{num(reduce ? totalStages : stage)}</span>
                <span className="px-1 text-mist">/</span>
                {num(totalStages)}
              </span>
            </div>
            <div className="mt-3 h-0.5 w-full overflow-hidden rounded bg-line-dark">
              <motion.div
                className="h-full w-full origin-[left_center] rounded bg-accent rtl:origin-[right_center]"
                style={{ scaleX: reduce ? 1 : scrollYProgress }}
              />
            </div>
            <p className="mt-3 font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-mist">
              {num(processes.length, 1)} {t("lines")}
            </p>
          </div>
        </div>

        {/* ---- One continuous rail through both production lines ---- */}
        <div ref={ref} className="relative">
          {/* The rail itself, and the fill that follows the scroll. */}
          <div className="absolute bottom-3 start-[27px] top-3 w-0.5 rounded bg-line-dark" />
          <motion.div
            className="absolute start-[27px] top-3 w-0.5 origin-top rounded bg-gradient-to-b from-accent to-accent/60"
            style={{ height: "calc(100% - 24px)", scaleY: reduce ? 1 : scrollYProgress }}
          />

          {processes.map((track, trackIndex) => (
            <div key={`${track.no}-${trackIndex}`}>
              {/* ---- Line header. A squared node, so it reads as a different
                      order of thing from the round stage nodes on the same rail. ---- */}
              <motion.div
                className="relative ps-20 pb-10"
                initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.55, ease: EASE }}
              >
                <motion.div
                  className="absolute start-0 top-0 grid h-14 w-14 place-items-center rounded-[16px] bg-accent ring-1 ring-accent/40"
                  initial={reduce ? { scale: 1, opacity: 1 } : { scale: 0.85, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <span className="font-display text-lg font-bold leading-none text-white">
                    {track.no}
                  </span>
                </motion.div>

                <span className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                  {t("line")} {track.no}
                </span>
                <h3 className="mt-1.5 text-2xl text-sand md:text-3xl">{track.label}</h3>

                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-mist">
                  {track.caption && <span>{track.caption}</span>}
                  {track.caption && track.steps?.length ? (
                    <span aria-hidden="true" className="text-line-dark">
                      &bull;
                    </span>
                  ) : null}
                  {track.steps?.length ? (
                    <span>
                      {num(track.steps.length, 1)} {t("stages")}
                    </span>
                  ) : null}
                </div>

                {track.input && (
                  <p className="mt-4 inline-flex flex-wrap items-baseline gap-2 rounded-btn border border-line-dark bg-elevated px-3 py-2">
                    <span className="font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-mist">
                      {t("input")}
                    </span>
                    <span className="text-sm text-sand">{track.input}</span>
                  </p>
                )}
              </motion.div>

              {/* ---- Stages ---- */}
              <ol>
                {(track.steps ?? []).map((step, index) => (
                  <motion.li
                    key={`${step.no}-${index}`}
                    className="relative pb-14 ps-20 md:pb-20"
                    initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.55 }}
                    transition={{ duration: 0.55, ease: EASE }}
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
                    <h4 className="mt-2 font-display text-2xl text-sand md:text-3xl">{step.title}</h4>
                    <p className="mt-3 max-w-md text-base leading-relaxed text-mist">{step.desc}</p>

                    {step.output && (
                      <p className="mt-5 inline-flex flex-wrap items-baseline gap-2 border-s-2 border-accent/60 ps-3">
                        <span className="font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-mist">
                          {t("output")}
                        </span>
                        <span className="font-display text-sm font-medium text-sand">
                          {step.output}
                        </span>
                      </p>
                    )}
                  </motion.li>
                ))}
              </ol>

              {/* Breathing room between one line ending and the next beginning,
                  without breaking the rail that runs through both. */}
              {trackIndex < processes.length - 1 && <div className="h-4 md:h-10" />}
            </div>
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
