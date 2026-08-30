import Button from "@/components/Button";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { section } from "@/lib/cms/content";
import { flattenTexts } from "@/lib/cms/site-data";

type IntroContent = {
  eyebrowNumber: string;
  eyebrowLabel: string;
  titleLead: string;
  titleAccent: string;
  paragraphs: unknown;
  images: { src: string; alt: string }[];
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
};

/** Heights alternate so the two columns interlock; the second column is offset down. */
const heights = ["h-56", "h-72", "h-72", "h-56"];

export default async function IntroSection() {
  const content = await section<IntroContent>("home.intro");
  const paragraphs = flattenTexts(content.paragraphs);
  const images = (content.images ?? []).filter((image) => image?.src);

  const left = images.filter((_, index) => index % 2 === 0);
  const right = images.filter((_, index) => index % 2 !== 0);

  return (
    <section className="section bg-sand text-ink">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            {left.map((image, index) => (
              <Reveal key={image.src} delay={index * 0.15} className="group overflow-hidden rounded-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.src}
                  alt={image.alt ?? ""}
                  loading="lazy"
                  decoding="async"
                  className={`${heights[index * 2] ?? "h-64"} w-full object-cover transition-transform duration-500 group-hover:scale-105`}
                />
              </Reveal>
            ))}
          </div>
          <div className="space-y-4 pt-10">
            {right.map((image, index) => (
              <Reveal
                key={image.src}
                delay={0.08 + index * 0.15}
                className="group overflow-hidden rounded-card"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.src}
                  alt={image.alt ?? ""}
                  loading="lazy"
                  decoding="async"
                  className={`${heights[index * 2 + 1] ?? "h-64"} w-full object-cover transition-transform duration-500 group-hover:scale-105`}
                />
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.1}>
          <SectionHeading
            eyebrowNumber={content.eyebrowNumber}
            eyebrowLabel={content.eyebrowLabel}
            title={
              <>
                {content.titleLead}{" "}
                {content.titleAccent && <span className="text-accent">{content.titleAccent}</span>}
              </>
            }
          />
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className={`${index === 0 ? "mt-6" : "mt-4"} text-base leading-relaxed text-ink/70`}
            >
              {paragraph}
            </p>
          ))}
          <div className="mt-8 flex flex-wrap gap-4">
            {content.primaryCtaLabel && (
              <Button href={content.primaryCtaHref || "/about"}>{content.primaryCtaLabel}</Button>
            )}
            {content.secondaryCtaLabel && (
              <Button href={content.secondaryCtaHref || "/services"} variant="secondary" arrow={false}>
                {content.secondaryCtaLabel}
              </Button>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
