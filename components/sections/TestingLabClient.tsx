"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import SectionHeading from "@/components/SectionHeading";
import Icon from "@/components/Icon";

export type LabTest = { title: string; icon: string; image: string; desc: string };

const pad = (value: number) => String(value).padStart(2, "0");

export default function TestingLabClient({
  eyebrowNumber,
  eyebrow,
  title,
  lead,
  tests,
  standards,
}: {
  eyebrowNumber?: string;
  eyebrow: string;
  title: string;
  lead: string;
  tests: LabTest[];
  standards: string[];
}) {
  const t = useTranslations("lab");
  const tc = useTranslations("common");
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = panelRefs.current.map((element) => {
      if (!element) return null;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) element.classList.add("lab-active");
        },
        { rootMargin: "-12% 0px -12% 0px", threshold: 0 },
      );
      io.observe(element);
      return io;
    });
    return () => observers.forEach((observer) => observer?.disconnect());
  }, [tests.length]);

  return (
    <section className="relative overflow-hidden bg-charcoal text-sand">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "26px 26px" }}
      />

      <div className="section container-x relative">
        <SectionHeading
          eyebrowNumber={eyebrowNumber}
          eyebrowLabel={eyebrow}
          tone="dark"
          title={title}
          description={lead}
        />

        {standards.length > 0 && (
          <div className="mt-7 flex flex-wrap gap-2">
            {standards.map((standard) => (
              <span
                key={standard}
                className="rounded-full border border-line-dark bg-white/[0.04] px-3.5 py-1.5 font-display text-xs font-semibold text-sand/80"
              >
                {standard}
              </span>
            ))}
          </div>
        )}

        {/* Alternating editorial panels */}
        <div className="mt-20 divide-y divide-line-dark">
          {tests.map((test, index) => {
            const flipped = index % 2 !== 0;
            return (
              <div
                key={`${test.title}-${index}`}
                ref={(element) => {
                  panelRefs.current[index] = element;
                }}
                className="py-16 md:py-20"
              >
                <div
                  className={`flex flex-col gap-10 md:items-center md:gap-14 lg:flex-row lg:gap-16 ${
                    flipped ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Image — clip-path wipe reveal */}
                  <div className="lab-img-reveal relative flex-1 overflow-hidden rounded-card">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={test.image}
                      alt={test.title}
                      loading="lazy"
                      decoding="async"
                      className="lab-img-inner h-72 w-full object-cover md:h-[400px] lg:h-[460px]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
                  </div>

                  {/* Text */}
                  <div className="relative flex-1">
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -top-4 end-0 select-none font-display font-bold leading-none text-white/[0.04]"
                      style={{ fontSize: "clamp(6rem, 14vw, 11rem)" }}
                    >
                      {pad(index + 1)}
                    </span>

                    <div className="lab-fade-1 flex items-center gap-4">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-btn bg-accent text-white">
                        <Icon name={test.icon} className="h-5 w-5" />
                      </span>
                      <span className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                        {t("stage")} {pad(index + 1)}
                      </span>
                    </div>

                    <h3 className="lab-fade-2 mt-5 text-3xl text-sand md:text-4xl" style={{ fontStretch: "115%" }}>
                      {test.title}
                    </h3>

                    <p className="lab-fade-3 mt-5 max-w-sm text-base leading-relaxed text-mist md:text-lg">
                      {test.desc}
                    </p>

                    <div
                      className="lab-fade-4 mt-8 h-px origin-left bg-gradient-to-r from-accent to-transparent"
                      style={{ width: "60%" }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer strip */}
        <div className="mt-4 flex flex-col items-start gap-5 border-t border-line-dark pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-xl text-sand md:text-2xl">{t("everyLength")}</p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="sheen-btn inline-flex items-center justify-center gap-2 rounded-btn bg-accent px-5 py-3 font-display text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              {t("requestTestReport")}
            </Link>
            <Link
              href="/projects"
              className="sheen-btn inline-flex items-center justify-center gap-2 rounded-btn border border-sand/25 px-5 py-3 font-display text-sm font-medium text-sand transition-colors hover:bg-sand hover:text-ink"
            >
              {tc("seeOurWork")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
