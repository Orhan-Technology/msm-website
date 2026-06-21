"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import Reveal from "@/components/Reveal";

const certs = [
  { src: "/images/cert-9001.jpg", code: "ISO 9001:2015", label: "Quality Management" },
  { src: "/images/cert-14001.jpg", code: "ISO 14001:2015", label: "Environmental" },
  { src: "/images/cert-45001.jpg", code: "ISO 45001:2018", label: "Health & Safety" },
  { src: "/images/cert-630.jpg", code: "ISO 630-1:2021", label: "Structural Steel" },
];

// left column: certs 0 & 2, right column (offset down): certs 1 & 3
const columns = [
  [0, 2],
  [1, 3],
];

export default function CertGallery() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:gap-5">
        {columns.map((col, ci) => (
          <div
            key={ci}
            className={ci === 1 ? "space-y-4 pt-8 sm:space-y-5 sm:pt-12" : "space-y-4 sm:space-y-5"}
          >
            {col.map((idx, k) => {
              const c = certs[idx];
              return (
                <Reveal key={c.code} delay={(ci + k) * 0.08}>
                  <button
                    onClick={() => setOpen(idx)}
                    className="group block w-full overflow-hidden rounded-card border border-line-light bg-white p-3 text-left transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_24px_50px_-28px_rgba(0,0,0,0.3)]"
                    aria-label={`View ${c.code} certificate`}
                  >
                    <div className="relative overflow-hidden rounded-md bg-sand">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={c.src}
                        alt={`${c.code} — ${c.label} certificate`}
                        className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                      <span className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-charcoal/70 text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
                        <ZoomIn className="h-4 w-4" />
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-1 pb-1 pt-3">
                      <span className="font-display text-sm font-semibold text-ink">
                        {c.code}
                      </span>
                      <span className="text-xs text-ink/55">{c.label}</span>
                    </div>
                  </button>
                </Reveal>
              );
            })}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-[80] grid place-items-center bg-charcoal/85 p-4 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <motion.div
              className="relative w-full max-w-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setOpen(null)}
                aria-label="Close"
                className="sheen-btn absolute -top-12 right-0 grid h-10 w-10 place-items-center rounded-btn border border-line-dark text-sand transition-colors hover:text-accent"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="overflow-hidden rounded-card bg-white p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={certs[open].src}
                  alt={`${certs[open].code} certificate`}
                  className="max-h-[78vh] w-full rounded-md object-contain"
                />
              </div>
              <p className="mt-3 text-center font-display text-sm text-sand">
                {certs[open].code} · {certs[open].label}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
