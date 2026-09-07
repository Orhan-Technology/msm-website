import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CalendarDays, Factory, Users, MapPin, type LucideIcon } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import StatCounter from "@/components/StatCounter";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import TeamGrid from "@/components/sections/TeamGrid";
import CeoMessage from "@/components/sections/CeoMessage";
import VisionMission from "@/components/sections/VisionMission";
import MiningResearch from "@/components/sections/MiningResearch";
import PartnerCta from "@/components/sections/PartnerCta";
import CtaBanner from "@/components/sections/CtaBanner";
import { section } from "@/lib/cms/content";
import { flattenTexts, getCompany, getPageHero } from "@/lib/cms/site-data";

type StoryContent = {
  eyebrowNumber: string;
  eyebrowLabel: string;
  title: string;
  image: string;
  video: string;
  paragraphs: unknown;
  primaryCtaLabel: string;
  primaryCtaHref: string;
};

type ValuesContent = {
  eyebrowNumber: string;
  eyebrowLabel: string;
  title: string;
  items: { icon: string; title: string; desc: string }[];
};

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPageHero("about.hero");
  return { title: "About", description: hero.lead, alternates: { canonical: "/about" } };
}

// Icons follow the order of the company figures: years · MT/day · people · provinces.
const statIcons: LucideIcon[] = [CalendarDays, Factory, Users, MapPin];

export default async function AboutPage() {
  const [hero, story, values, company, tHome] = await Promise.all([
    getPageHero("about.hero"),
    section<StoryContent>("about.story"),
    section<ValuesContent>("about.values"),
    getCompany(),
    getTranslations("home"),
  ]);
  const storyParagraphs = flattenTexts(story.paragraphs);

  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow={hero.eyebrow}
          title={
            <>
              {hero.titleLead} {hero.titleAccent && <span className="text-accent">{hero.titleAccent}</span>}
            </>
          }
          lead={hero.lead}
        />

        {/* Story */}
        <section className="section bg-sand text-ink">
          <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal className="overflow-hidden rounded-card">
              {story.video ? (
                <video
                  src={story.video}
                  controls
                  playsInline
                  preload="metadata"
                  poster={story.image || undefined}
                  className="h-[460px] w-full bg-black object-cover"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={story.image}
                  alt="The mill floor"
                  loading="lazy"
                  decoding="async"
                  className="h-[460px] w-full object-cover"
                />
              )}
            </Reveal>
            <Reveal delay={0.1}>
              <SectionHeading
                eyebrowNumber={story.eyebrowNumber}
                eyebrowLabel={story.eyebrowLabel}
                title={story.title}
              />
              {storyParagraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={`${index === 0 ? "mt-6" : "mt-4"} text-base leading-relaxed text-ink/70`}
                >
                  {paragraph}
                </p>
              ))}
              {story.primaryCtaLabel && (
                <div className="mt-8">
                  <Button href={story.primaryCtaHref || "/contact"}>{story.primaryCtaLabel}</Button>
                </div>
              )}
            </Reveal>
          </div>
        </section>

        {/* Figures band — photo left, stacked figures right */}
        <section className="overflow-hidden bg-charcoal text-sand">
          <div className="grid lg:grid-cols-2">
            <div className="relative h-72 lg:h-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/plant/worker-furnace.jpg"
                alt="Worker at the Maisam Steel Mill furnace"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-charcoal/10 via-transparent to-charcoal/60 lg:to-charcoal" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent lg:hidden" />
            </div>

            <div className="flex flex-col justify-center px-8 py-14 md:px-14 lg:px-16 lg:py-20">
              <Reveal>
                <span className="eyebrow">{tHome("byTheNumbers")}</span>
                <h2 className="mt-3 text-sand" style={{ fontStretch: "115%" }}>
                  {tHome("provenAtScale")}
                </h2>
              </Reveal>

              <div className="mt-10 divide-y divide-line-dark">
                {company.stats.map((stat, index) => {
                  const Ic = statIcons[index] ?? Factory;
                  return (
                    <Reveal key={stat.label} delay={index * 0.1}>
                      <div className="group flex items-center gap-5 py-6">
                        <div className="shrink-0">
                          <StatCounter
                            value={stat.value}
                            suffix={stat.suffix}
                            tone="dark"
                            numStyle={{
                              fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
                              fontWeight: 700,
                              lineHeight: 1,
                              letterSpacing: "-0.02em",
                            }}
                          />
                        </div>

                        <div className="flex min-w-0 flex-1 items-center gap-4">
                          <span className="h-px w-6 shrink-0 bg-accent/50 transition-all duration-300 group-hover:w-10 group-hover:bg-accent" />
                          <div className="flex min-w-0 flex-col">
                            <span className="truncate text-sm text-mist/55 transition-colors duration-300 group-hover:text-mist/80">
                              {stat.label}
                            </span>
                          </div>
                          <span className="ml-auto shrink-0 text-mist/20 transition-colors duration-300 group-hover:text-accent">
                            <Ic className="h-5 w-5" strokeWidth={1.5} />
                          </span>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <CeoMessage eyebrowNumber="02" />
        <VisionMission eyebrowNumber="03" />
        <MiningResearch eyebrowNumber="04" />

        {/* Values */}
        <section className="section bg-sand text-ink">
          <div className="container-x">
            <SectionHeading
              eyebrowNumber={values.eyebrowNumber}
              eyebrowLabel={values.eyebrowLabel}
              align="center"
              title={values.title}
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {(values.items ?? []).map((value, index) => (
                <Reveal key={value.title} delay={index * 0.08}>
                  <div className="flex h-full flex-col rounded-card border border-line-light bg-white p-7">
                    <span className="grid h-12 w-12 place-items-center rounded-btn bg-sand text-accent">
                      <Icon name={value.icon} className="h-6 w-6" />
                    </span>
                    <h3 className="mt-5 text-lg">{value.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink/60">{value.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <TeamGrid eyebrowNumber="06" />
        <PartnerCta eyebrowNumber="07" />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
