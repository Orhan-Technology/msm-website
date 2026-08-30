"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageSquare, Mail, Phone, MapPin } from "lucide-react";
import StatCounter from "@/components/StatCounter";
import { company } from "@/lib/company";
import { cn } from "@/lib/utils";

export default function Hero() {
  const stats = company.stats.slice(0, 3);
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  // Run attention animations (button sheen, contact icon) only while in view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), {
      threshold: 0.25,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
        preload="metadata"
        poster="/images/hero.jpg"
        aria-hidden
      >
        <source src="/videos/steel-hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/85 to-charcoal/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/60" />

      <div className="container-x relative w-full pb-16 pt-32">
        <div className="max-w-3xl">
          <span className="eyebrow hero-rise">
            {company.shortName} — Since {company.founded}
          </span>
          <h1 className="hero-rise-2 mt-5 text-sand text-balance">
            Innovative metal solutions for{" "}
            <span className="text-accent">industries</span>
          </h1>
          <p className="hero-rise-3 mt-6 max-w-xl text-base leading-relaxed text-mist md:text-lg">
            {company.description} We forge the certified steel that builds a
            nation — one beam, one bar, and one project at a time.
          </p>
          <div className="hero-rise-3 mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="cta-sheen group inline-flex items-center justify-center gap-2 rounded-btn bg-accent px-7 py-4 font-display text-[0.95rem] font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Get a quote
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              <span className="sheen" />
            </Link>
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
