import { Check } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import StatCounter from "@/components/StatCounter";
import CertGallery from "@/components/CertGallery";
import { section } from "@/lib/cms/content";
import { flattenTexts } from "@/lib/cms/site-data";

type QualityContent = {
  eyebrowNumber: string;
  eyebrowLabel: string;
  title: string;
  body: string;
  statOneValue: number;
  statOneSuffix: string;
  statOneLabel: string;
  statTwoValue: number;
  statTwoSuffix: string;
  statTwoLabel: string;
  commitments: unknown;
  note: string;
  certificates: { title: string; src: string }[];
};

export default async function QualitySection({ eyebrowNumber }: { eyebrowNumber?: string }) {
  const content = await section<QualityContent>("home.quality");
  const commitments = flattenTexts(content.commitments);
  const certificates = (content.certificates ?? []).filter((certificate) => certificate?.src);

  return (
    <section className="section bg-sand text-ink">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left: statement + metrics + commitments */}
        <div>
          <SectionHeading
            eyebrowNumber={eyebrowNumber ?? content.eyebrowNumber}
            eyebrowLabel={content.eyebrowLabel}
            title={content.title}
          />
          {content.body && <p className="mt-6 text-base leading-relaxed text-ink/70">{content.body}</p>}

          <div className="mt-8 flex flex-wrap gap-10">
            <div>
              <StatCounter value={Number(content.statOneValue) || 0} suffix={content.statOneSuffix} />
              <p className="mt-1 text-sm text-ink/60">{content.statOneLabel}</p>
            </div>
            <div>
              <StatCounter value={Number(content.statTwoValue) || 0} suffix={content.statTwoSuffix} />
              <p className="mt-1 text-sm text-ink/60">{content.statTwoLabel}</p>
            </div>
          </div>

          <ul className="mt-8 space-y-3">
            {commitments.map((commitment) => (
              <li key={commitment} className="flex items-center gap-3 text-ink/80">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-white">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {commitment}
              </li>
            ))}
          </ul>
          {certificates.length > 0 && content.note && (
            <p className="mt-6 text-sm text-ink/50">{content.note}</p>
          )}
        </div>

        {/* Right: certificate collage (click to enlarge) */}
        <CertGallery certificates={certificates} />
      </div>
    </section>
  );
}
