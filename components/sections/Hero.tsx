"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageSquare, Mail, Phone, MapPin } from "lucide-react";
import StatCounter from "@/components/StatCounter";
import { company } from "@/lib/company";
import { cn } from "@/lib/utils";

const FULL = "Innovative metal solutions for industries";
const ACCENT_AT = FULL.lastIndexOf("industries");

// A shower of welding sparks thrown from the write-head (deterministic = no hydration mismatch).
// x/y = travel in em, s = size px, d = duration s, t = delay s
const SPARKS = [
  { x: 1.3, y: 0.4, s: 2.5, d: 0.5, t: 0.0 },
  { x: 1.7, y: 0.75, s: 2, d: 0.58, t: 0.07 },
  { x: 1.0, y: 0.95, s: 1.8, d: 0.46, t: 0.14 },
  { x: 1.9, y: 0.15, s: 2.2, d: 0.55, t: 0.05 },
  { x: 1.15, y: -0.35, s: 1.6, d: 0.5, t: 0.2 },
  { x: 1.5, y: 1.2, s: 2, d: 0.64, t: 0.12 },
  { x: 0.7, y: 0.55, s: 1.5, d: 0.4, t: 0.24 },
  { x: 2.15, y: 0.55, s: 2.4, d: 0.6, t: 0.3 },
  { x: 0.85, y: -0.2, s: 1.6, d: 0.42, t: 0.27 },
  { x: 1.35, y: 1.45, s: 1.9, d: 0.68, t: 0.18 },
  { x: 2.3, y: 0.95, s: 1.7, d: 0.62, t: 0.36 },
  { x: 0.55, y: 1.05, s: 1.5, d: 0.46, t: 0.4 },
  { x: 1.65, y: -0.3, s: 1.7, d: 0.5, t: 0.33 },
  { x: 1.05, y: 0.3, s: 2, d: 0.36, t: 0.44 },
  { x: 2.0, y: 1.3, s: 1.8, d: 0.66, t: 0.22 },
  { x: 0.95, y: 1.25, s: 1.6, d: 0.52, t: 0.48 },
];

export default function Hero() {
  const stats = company.stats.slice(0, 3);
  const ref = useRef<HTMLElement>(null);
  const [typed, setTyped] = useState(0);
  const [active, setActive] = useState(false);

  // Typewriter on first load
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(FULL.length);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(i);
      if (i >= FULL.length) clearInterval(id);
    }, 55);
    return () => clearInterval(id);
  }, []);

  // Run attention animations only while the hero is in view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), {
      threshold: 0.25,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const shown = FULL.slice(0, typed);
  const typing = typed < FULL.length;

  return (
    <section
      ref={ref}
      className={cn(
        "relative flex min-h-screen items-center overflow-hidden bg-charcoal text-sand",
        active && "hero-active",
      )}
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/images/hero.jpg"
        aria-hidden
      >
        <source src="/videos/steel-hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/85 to-charcoal/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/60" />

      {/* heat-haze distortion filter for the molten word */}
      <svg className="absolute h-0 w-0" aria-hidden focusable="false">
        <filter id="heat-melt" x="-20%" y="-20%" width="140%" height="170%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015 0.03"
            numOctaves={2}
            seed={7}
            result="noise"
          >
            <animate
              attributeName="baseFrequency"
              dur="6s"
              values="0.015 0.03; 0.02 0.06; 0.015 0.03"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={5}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <div className="container-x relative w-full pb-16 pt-32">
        <div className="max-w-3xl">
          <span className="eyebrow hero-rise">
            {company.shortName} — Since {company.founded}
          </span>
          <h1
            aria-label={FULL}
            className="hero-rise-2 mt-5 min-h-[1.1em] text-sand text-balance"
          >
            {typing ? (
              <>
                {shown.split("").map((ch, idx) => (
                  <span
                    key={idx}
                    className="forge-char"
                    style={
                      {
                        "--cool": idx >= ACCENT_AT ? "#E2562B" : "#F5F5F3",
                      } as React.CSSProperties
                    }
                  >
                    {ch}
                  </span>
                ))}
                <span aria-hidden className="forge-caret">
                  <span className="weld-arc" />
                  {SPARKS.map((sp, i) => (
                    <span
                      key={i}
                      className="weld-spark"
                      style={
                        {
                          width: `${sp.s}px`,
                          height: `${sp.s}px`,
                          "--sx": `${sp.x}em`,
                          "--sy": `${sp.y}em`,
                          animationDuration: `${sp.d}s`,
                          animationDelay: `${sp.t}s`,
                        } as React.CSSProperties
                      }
                    />
                  ))}
                </span>
              </>
            ) : (
              <>
                {FULL.slice(0, ACCENT_AT)}
                <span className="melt-wrap">
                  <span className="melt-text">{FULL.slice(ACCENT_AT)}</span>
                </span>
              </>
            )}
          </h1>
          <p className="hero-rise-3 mt-6 max-w-xl text-base leading-relaxed text-mist md:text-lg">
            {company.description} We forge the certified steel that builds a
            nation — one beam, one bar, and one project at a time.
          </p>
          <div className="hero-rise-3 mt-8 flex flex-wrap gap-4">
            <a
              href="#quote"
              className="cta-sheen group inline-flex items-center justify-center gap-2 rounded-btn bg-accent px-7 py-4 font-display text-[0.95rem] font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Get a quote
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              <span className="sheen" />
            </a>
            <Link
              href="/about"
              className="cta-sheen cta-delay group inline-flex items-center justify-center gap-2 rounded-btn border border-sand/25 px-7 py-4 font-display text-[0.95rem] font-medium text-sand transition-colors hover:bg-sand hover:text-ink"
            >
              Learn more
              <span className="sheen" />
            </Link>
          </div>

          <div className="mt-14 grid max-w-2xl grid-cols-3 gap-6 border-t border-line-dark pt-8">
            {stats.map((s) => (
              <StatCounter
                key={s.label}
                value={s.value}
                suffix={s.suffix}
                label={s.label}
                tone="dark"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating contact card */}
      <div className="container-x pointer-events-none absolute inset-x-0 bottom-8 hidden lg:block">
        <div className="flex justify-end">
          <div className="pointer-events-auto w-[330px] rounded-card border border-line-dark bg-elevated/90 p-6 backdrop-blur">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-btn bg-accent text-white">
                <MessageSquare className="icon-wave h-5 w-5" />
              </span>
              <p className="font-display font-semibold text-sand">Get in touch</p>
            </div>
            <ul className="mt-4 space-y-2.5 text-sm text-mist">
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-accent" /> {company.email}
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-accent" /> {company.phone}
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                Pol-e-Charkhi Industrial Park, Kabul
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
