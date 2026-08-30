"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import Reveal from "@/components/Reveal";

export type Certificate = { title: string; src: string };

/** Split into two columns; the second is offset down for the staggered collage. */
function toColumns(count: number) {
  const left: number[] = [];
  const right: number[] = [];
  for (let index = 0; index < count; index += 1) {
    (index % 2 === 0 ? left : right).push(index);
  }
  return [left, right];
}

export default function CertGallery({ certificates }: { certificates: Certificate[] }) {
  const [open, setOpen] = useState<number | null>(null);

  if (!certificates.length) return null;
  const columns = toColumns(certificates.length);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:gap-5">
        {columns.map((column, columnIndex) => (
          <div
            key={columnIndex}
            className={columnIndex === 1 ? "space-y-4 pt-8 sm:space-y-5 sm:pt-12" : "space-y-4 sm:space-y-5"}
          >
            {column.map((index, position) => {
              const certificate = certificates[index];
              return (
                <Reveal key={`${certificate.src}-${index}`} delay={(columnIndex + position) * 0.08}>
                  <button
                    onClick={() => setOpen(index)}
                    className="group block w-full overflow-hidden rounded-card border border-line-light bg-white p-3 text-left transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_24px_50px_-28px_rgba(0,0,0,0.3)]"
                    aria-label={`View ${certificate.title}`}
                  >
                    <div className="relative overflow-hidden rounded-md bg-sand">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={certificate.src}
                        alt={`${certificate.title} certificate`}
                        loading="lazy"
                        decoding="async"
                        className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                      <span className="absolute end-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-charcoal/70 text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
                        <ZoomIn className="h-4 w-4" />
                      </span>
                    </div>
                    <div className="px-1 pb-1 pt-3">
                      <span className="font-display text-sm font-semibold text-ink">{certificate.title}</span>
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
              onClick={(event) => event.stopPropagation()}
            >
              <button
                onClick={() => setOpen(null)}
                aria-label="Close"
                className="sheen-btn absolute -top-12 end-0 grid h-10 w-10 place-items-center rounded-btn border border-line-dark text-sand transition-colors hover:text-accent"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="overflow-hidden rounded-card bg-white p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={certificates[open].src}
                  alt={`${certificates[open].title} certificate`}
                  loading="lazy"
                  decoding="async"
                  className="max-h-[78vh] w-full rounded-md object-contain"
                />
              </div>
              <p className="mt-3 text-center font-display text-sm text-sand">{certificates[open].title}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
