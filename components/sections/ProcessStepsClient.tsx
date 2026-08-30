"use client";

import { useRef } from "react";
import { motion, useScroll, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Layers, Flame, Cog, ShieldCheck, type LucideIcon } from "lucide-react";
import Button from "@/components/Button";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";

type Step = { no: string; title: string; Icon: LucideIcon; desc: string };

const steps: Step[] = [
  {
    no: "01",
    title: "Material selection",
    Icon: Layers,
    desc: "Raw material and recovered scrap are graded and charged into a controlled electric furnace, with chemistry verified per heat.",
  },
  {
    no: "02",
    title: "Melting & casting",
    Icon: Flame,
    desc: "The charge is melted in the furnace and continuously cast into consistent, defect-free billets — the foundation of every bar.",
  },
  {
    no: "03",
    title: "Rolling & shaping",
    Icon: Cog,
    desc: "Billets are hot-rolled into rebar, angles and T-bars at precise tolerances, then stamped MSM for full traceability.",
  },
  {
    no: "04",
    title: "Quality control & dispatch",
    Icon: ShieldCheck,
    desc: "Samples from every batch are lab-tested for strength and tolerance under ISO 9001 before a single length is dispatched.",
  },
];

export default function ProcessSteps({
  eyebrowNumber = "03",
}: {
  eyebrowNumber?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 80%"],
  });

  return (
    <section className="section bg-charcoal text-sand">
      <div className="container-x grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        {/* Sticky heading */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrowNumber={eyebrowNumber}
            eyebrowLabel="Process"
            tone="dark"
            title="Check how our process is done"
          />
          <p className="mt-6 max-w-md text-base leading-relaxed text-mist">
            One integrated mill controls every stage in-house. Follow the journey
            from raw material to certified steel — one step at a time.
          </p>
        </div>

        {/* Scroll-driven timeline */}
        <div ref={ref} className="relative">
          {/* track */}
          <div className="absolute left-[27px] top-3 bottom-3 w-0.5 rounded bg-line-dark" />
          {/* progress fill */}
          <motion.div
            className="absolute left-[27px] top-3 w-0.5 origin-top rounded bg-accent"
            style={{
              height: "calc(100% - 24px)",
              scaleY: reduce ? 1 : scrollYProgress,
            }}
          />

          {steps.map((s) => (
            <motion.div
              key={s.no}
              className="relative pb-14 pl-20 last:pb-0 md:pb-24"
              initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.55 }}
              transition={{ duration: 0.55, ease: [0.22, 0.72, 0.2, 1] }}
            >
              {/* node lights up as it enters view */}
              <motion.div
                className="absolute left-0 top-0 grid h-14 w-14 place-items-center rounded-full ring-1 ring-accent/40"
                initial={
                  reduce
                    ? { backgroundColor: "#E2562B", color: "#ffffff", scale: 1 }
                    : { backgroundColor: "#0E0E10", color: "#E2562B", scale: 0.85 }
                }
                whileInView={{
                  backgroundColor: "#E2562B",
                  color: "#ffffff",
                  scale: 1,
                }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <s.Icon className="h-6 w-6" strokeWidth={1.75} />
              </motion.div>

              <span className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                Step {s.no}
              </span>
              <h3 className="mt-2 text-2xl text-sand md:text-3xl">{s.title}</h3>
              <p className="mt-3 max-w-md text-base leading-relaxed text-mist">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTAs reveal at the end of the journey */}
      <div className="container-x mt-16">
        <Reveal className="flex flex-col items-start gap-5 border-t border-line-dark pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-xl text-sand md:text-2xl">
            Ready to put our process to work?
          </p>
          <div className="flex flex-wrap gap-4">
            <Button href="/contact">Get a quote</Button>
            <Link
              href="/services"
              className="sheen-btn inline-flex items-center justify-center gap-2 rounded-btn border border-sand/25 px-5 py-3 font-display text-sm font-medium text-sand transition-colors hover:bg-sand hover:text-ink"
            >
              All services
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
