import { Download, FileText } from "lucide-react";
import Reveal from "@/components/Reveal";

const files = [
  {
    label: "Company Profile",
    desc: "Full 2025 profile — overview, products, certifications.",
    href: "/downloads/msm-company-profile.pdf",
    size: "PDF · 2.5 MB",
  },
  {
    label: "Product Brochure",
    desc: "Bilingual trifold — rebar, angles and T-bar specs.",
    href: "/downloads/msm-brochure.pdf",
    size: "PDF · 1.2 MB",
  },
];

export default function CatalogDownload() {
  return (
    <section className="relative overflow-hidden bg-charcoal py-20 text-sand md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
      <div className="container-x relative">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
          <Reveal>
            <span className="eyebrow">Catalog & downloads</span>
            <h2 className="mt-3 text-sand">
              Take the full specs <span className="text-accent">with you</span>
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-mist">
              Download our company profile and product brochure — everything your
              procurement and engineering teams need to specify Maisam steel.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid gap-4 sm:grid-cols-2">
              {files.map((f) => (
                <a
                  key={f.href}
                  href={f.href}
                  download
                  className="group flex h-full flex-col rounded-card border border-line-dark bg-elevated p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-btn bg-accent/15 text-accent ring-1 ring-accent/20">
                      <FileText className="h-6 w-6" />
                    </span>
                    <Download className="h-5 w-5 text-mist transition-colors group-hover:text-accent" />
                  </div>
                  <h3 className="mt-5 text-base text-sand">{f.label}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-mist">
                    {f.desc}
                  </p>
                  <span className="mt-4 font-display text-xs font-semibold uppercase tracking-wide text-mist/70">
                    {f.size}
                  </span>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
