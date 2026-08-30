import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import StatCounter from "@/components/StatCounter";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { CalendarDays, Factory, Users, MapPin, type LucideIcon } from "lucide-react";
import TeamGrid from "@/components/sections/TeamGrid";
import CeoMessage from "@/components/sections/CeoMessage";
import VisionMission from "@/components/sections/VisionMission";
import MiningResearch from "@/components/sections/MiningResearch";
import PartnerCta from "@/components/sections/PartnerCta";
import CtaBanner from "@/components/sections/CtaBanner";
import { company } from "@/lib/company";

export const metadata = {
  title: "About",
  description:
    "Afghanistan's first ISO-certified steel manufacturer since 2009. Our story, values and the people behind the steel.",
};

// icons aligned to company.stats order: Years · MT/day · People · Provinces
const statIcons: LucideIcon[] = [CalendarDays, Factory, Users, MapPin];

const values = [
  { icon: "ShieldCheck", title: "First & only ISO-certified", desc: "The pioneer mill operating to international quality, safety and environmental standards." },
  { icon: "Cog", title: "Reliable high capacity", desc: "336+ metric tons of certified steel every day — supply you can plan around." },
  { icon: "MapPin", title: "Nationwide reach", desc: "Trusted and available across nearly every province of Afghanistan." },
  { icon: "Recycle", title: "Built for Afghanistan", desc: "Creating jobs, transferring skills and building a domestic value chain." },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="About us"
          title={
            <>
              Building a nation on <span className="text-accent">certified steel</span>
            </>
          }
          lead="Established in 2009, Maisam Steel Mill is Afghanistan's first ISO-certified steel manufacturer — forging the materials that rebuild the country."
        />

        {/* Story */}
        <section className="section bg-sand text-ink">
          <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal className="overflow-hidden rounded-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/about.jpg" alt="The mill floor" loading="lazy" decoding="async" className="h-[460px] w-full object-cover" />
            </Reveal>
            <Reveal delay={0.1}>
              <SectionHeading eyebrowNumber="01" eyebrowLabel="Our story" title="From a bold dream to the nation's mill" />
              <p className="mt-6 text-base leading-relaxed text-ink/70">
                What began in 2009 with a simple belief — that Afghanistan
                deserves nothing less than the highest-quality materials for its
                infrastructure — has grown into the country&apos;s most trusted
                steel manufacturer.
              </p>
              <p className="mt-4 text-base leading-relaxed text-ink/70">
                Through international partnerships and ISO certification, we have
                introduced standardized, high-quality steel to the domestic
                market and employed hundreds of talented Afghans along the way.
              </p>
              <div className="mt-8">
                <Button href="/contact">Work with us</Button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Stats band — photo left, stacked stats right */}
        <section className="overflow-hidden bg-charcoal text-sand">
          <div className="grid lg:grid-cols-2">

            {/* Left: tall mill photo */}
            <div className="relative h-72 lg:h-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/plant/worker-furnace.jpg"
                alt="Worker at the Maisam Steel Mill furnace"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              {/* Right-side fade into the dark panel */}
              <div className="absolute inset-0 bg-gradient-to-r from-charcoal/10 via-transparent to-charcoal/60 lg:to-charcoal" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent lg:hidden" />
            </div>

            {/* Right: dark stats panel */}
            <div className="flex flex-col justify-center px-8 py-14 md:px-14 lg:px-16 lg:py-20">
              <Reveal>
                <span className="eyebrow">By the numbers</span>
                <h2 className="mt-3 text-sand" style={{ fontStretch: "115%" }}>
                  Proven at scale
                </h2>
              </Reveal>

              <div className="mt-10 divide-y divide-line-dark">
                {company.stats.map((s, i) => {
                  const Ic = statIcons[i] ?? Factory;
                  return (
                    <Reveal key={s.label} delay={i * 0.1}>
                      <div className="group flex items-center gap-5 py-6">
                        {/* Number */}
                        <div className="shrink-0">
                          <StatCounter
                            value={s.value}
                            suffix={s.suffix}
                            tone="dark"
                            numStyle={{
                              fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
                              fontWeight: 700,
                              lineHeight: 1,
                              letterSpacing: "-0.02em",
                            }}
                          />
                        </div>

                        {/* Accent rule + label */}
                        <div className="flex min-w-0 flex-1 items-center gap-4">
                          <span className="h-px w-6 shrink-0 bg-accent/50 transition-all duration-300 group-hover:w-10 group-hover:bg-accent" />
                          <div className="flex min-w-0 flex-col">
                            <span className="truncate text-sm text-mist/55 transition-colors duration-300 group-hover:text-mist/80">
                              {s.label}
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
            <SectionHeading eyebrowNumber="05" eyebrowLabel="Why choose us" align="center" title="Values that hold under load" />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((v, i) => (
                <Reveal key={v.title} delay={i * 0.08}>
                  <div className="flex h-full flex-col rounded-card border border-line-light bg-white p-7">
                    <span className="grid h-12 w-12 place-items-center rounded-btn bg-sand text-accent">
                      <Icon name={v.icon} className="h-6 w-6" />
                    </span>
                    <h3 className="mt-5 text-lg">{v.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink/60">{v.desc}</p>
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
