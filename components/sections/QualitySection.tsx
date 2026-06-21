import { Check } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import StatCounter from "@/components/StatCounter";
import CertGallery from "@/components/CertGallery";

const commitments = [
  "Tensile, dimensional & surface checks",
  "Per-batch test certificates",
  "MSM-stamped traceability on every length",
];

export default function QualitySection({
  eyebrowNumber = "04",
}: {
  eyebrowNumber?: string;
}) {
  return (
    <section className="section bg-sand text-ink">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left: statement + metrics + commitments */}
        <div>
          <SectionHeading
            eyebrowNumber={eyebrowNumber}
            eyebrowLabel="Quality"
            title="Exceptional quality that can't be beaten"
          />
          <p className="mt-6 text-base leading-relaxed text-ink/70">
            Under our ISO 9001 quality system, every batch is tested for tensile
            strength, dimensional tolerance and surface quality. These aren&apos;t
            certificates on a wall — they are a promise in the steel, accredited
            and verifiable.
          </p>

          <div className="mt-8 flex flex-wrap gap-10">
            <div>
              <StatCounter value={100} suffix="%" />
              <p className="mt-1 text-sm text-ink/60">Every batch lab-tested</p>
            </div>
            <div>
              <StatCounter value={4} />
              <p className="mt-1 text-sm text-ink/60">International ISO standards</p>
            </div>
          </div>

          <ul className="mt-8 space-y-3">
            {commitments.map((c) => (
              <li key={c} className="flex items-center gap-3 text-ink/80">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-white">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {c}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-ink/50">
            Click any certificate to view it in full.
          </p>
        </div>

        {/* Right: real certificate collage (click to enlarge) */}
        <CertGallery />
      </div>
    </section>
  );
}
