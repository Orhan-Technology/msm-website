import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import StatCounter from "@/components/StatCounter";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import TeamGrid from "@/components/sections/TeamGrid";
import CtaBanner from "@/components/sections/CtaBanner";
import QuoteForm from "@/components/sections/QuoteForm";
import { company } from "@/lib/company";

export const metadata = {
  title: "About — Maisam Steel Mill",
  description:
    "Afghanistan's first ISO-certified steel manufacturer since 2009. Our story, values and the people behind the steel.",
};

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
              <img src="/images/about.jpg" alt="The mill floor" className="h-[460px] w-full object-cover" />
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
                <Button href="#quote">Work with us</Button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Stats band */}
        <section className="bg-charcoal py-16 text-sand">
          <div className="container-x grid grid-cols-2 gap-8 md:grid-cols-4">
            {company.stats.map((s) => (
              <StatCounter key={s.label} value={s.value} suffix={s.suffix} label={s.label} tone="dark" />
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="section bg-sand text-ink">
          <div className="container-x">
            <SectionHeading eyebrowNumber="04" eyebrowLabel="Why choose us" align="center" title="Values that hold under load" />
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

        <TeamGrid />
        <CtaBanner />
        <QuoteForm />
      </main>
      <Footer />
    </>
  );
}
