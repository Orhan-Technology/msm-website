"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import Icon from "@/components/Icon";
import { lab } from "@/lib/content";

const pad = (n: number) => String(n).padStart(2, "0");

export default function TestingLab({
  eyebrowNumber = "06",
}: {
  eyebrowNumber?: string;
}) {
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = panelRefs.current.map((el) => {
      if (!el) return null;
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) el.classList.add("lab-active");
        },
        { rootMargin: "-12% 0px -12% 0px", threshold: 0 },
      );
      io.observe(el);
      return io;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <section className="relative overflow-hidden bg-charcoal text-sand">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      <div className="section container-x relative">
        <SectionHeading
          eyebrowNumber={eyebrowNumber}
          eyebrowLabel={lab.eyebrow}
          tone="dark"
          title={lab.title}
          description={lab.lead}
        />

        <div className="mt-7 flex flex-wrap gap-2">
          {lab.standards.map((s) => (
            <span
              key={s}
              className="rounded-full border border-line-dark bg-white/[0.04] px-3.5 py-1.5 font-display text-xs font-semibold text-sand/80"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Alternating editorial panels */}
        <div className="mt-20 divide-y divide-line-dark">
          {lab.tests.map((t, i) => {
            const flipped = i % 2 !== 0;
            return (
              <div
                key={t.title}
                ref={(el) => {
                  panelRefs.current[i] = el;
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
                      src={t.image}
                      alt={t.title}
                      loading="lazy"
                      decoding="async"
                      className="lab-img-inner h-72 w-full object-cover md:h-[400px] lg:h-[460px]"
                    />
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
                  </div>

                  {/* Text */}
                  <div className="relative flex-1">
                    {/* Ghost stage number */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -top-4 right-0 select-none font-display font-bold leading-none text-white/[0.04]"
                      style={{ fontSize: "clamp(6rem, 14vw, 11rem)" }}
                    >
                      {pad(i + 1)}
                    </span>

                    <div className="lab-fade-1 flex items-center gap-4">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-btn bg-accent text-white">
                        <Icon name={t.icon} className="h-5 w-5" />
                      </span>
                      <span className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                        Stage {pad(i + 1)}
                      </span>
                    </div>

                    <h3
                      className="lab-fade-2 mt-5 text-3xl text-sand md:text-4xl"
                      style={{ fontStretch: "115%" }}
                    >
                      {t.title}
                    </h3>

                    <p className="lab-fade-3 mt-5 max-w-sm text-base leading-relaxed text-mist md:text-lg">
                      {t.desc}
                    </p>

                    {/* Grow-in accent line */}
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
          <p className="font-display text-xl text-sand md:text-2xl">
            Every length leaves the mill lab-verified.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="sheen-btn inline-flex items-center justify-center gap-2 rounded-btn bg-accent px-5 py-3 font-display text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Request a test report
            </Link>
            <Link
              href="/projects"
              className="sheen-btn inline-flex items-center justify-center gap-2 rounded-btn border border-sand/25 px-5 py-3 font-display text-sm font-medium text-sand transition-colors hover:bg-sand hover:text-ink"
            >
              See our work
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
