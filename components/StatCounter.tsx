"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  suffix?: string;
  label?: string;
  duration?: number; // ms
  className?: string;
  tone?: "light" | "dark";
  numStyle?: React.CSSProperties;
};

/** Animates a number from 0 to `value` once it scrolls into view. */
export default function StatCounter({
  value,
  suffix = "",
  label,
  duration = 1500,
  className,
  tone = "light",
  numStyle,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    let start: number | null = null;
    const step = (t: number) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / duration, 1);
      const eased = 0.5 - Math.cos(Math.PI * p) / 2;
      setDisplay(Math.floor(eased * value));
      if (p < 1) raf = requestAnimationFrame(step);
      else setDisplay(value);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduce]);

  return (
    <div ref={ref} className={className}>
      <div
        className={cn(
          "font-display font-semibold tabular-nums",
          tone === "dark" ? "text-sand" : "text-ink",
        )}
        style={{ fontSize: "clamp(2.25rem, 4vw, 3.25rem)", lineHeight: 1, ...numStyle }}
      >
        {display.toLocaleString()}
        <span className="text-accent">{suffix}</span>
      </div>
      {label && (
        <div
          className={cn(
            "mt-2 text-sm",
            tone === "dark" ? "text-mist" : "text-ink/60",
          )}
        >
          {label}
        </div>
      )}
    </div>
  );
}
