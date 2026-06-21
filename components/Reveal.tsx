"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  /** Stagger delay in seconds (e.g. index * 0.08 for grids). */
  delay?: number;
  className?: string;
  as?: "div" | "li" | "article" | "section";
};

/** Fades children up (16px, 0.5s) when scrolled into view. Once only. */
export default function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: Props) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={cn("reveal", className)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.5, ease: [0.22, 0.72, 0.2, 1], delay }}
    >
      {children}
    </MotionTag>
  );
}
