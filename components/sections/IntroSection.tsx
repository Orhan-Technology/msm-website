import Button from "@/components/Button";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";

export default function IntroSection() {
  return (
    <section className="section bg-sand text-ink">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <Reveal className="group overflow-hidden rounded-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/intro-1.jpg"
                alt="Steelworkers amid sparks on the mill floor"
                className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Reveal>
            <Reveal delay={0.15} className="group overflow-hidden rounded-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/intro-2.jpg"
                alt="Molten steel pouring in the furnace"
                className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Reveal>
          </div>
          <div className="space-y-4 pt-10">
            <Reveal delay={0.08} className="group overflow-hidden rounded-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/intro-3.jpg"
                alt="Hot-rolled steel bars on the line"
                className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Reveal>
            <Reveal delay={0.22} className="group overflow-hidden rounded-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/intro-4.jpg"
                alt="Finished steel sections"
                className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Reveal>
          </div>
        </div>
        <Reveal delay={0.1}>
          <SectionHeading
            eyebrowNumber="01"
            title={
              <>
                We&apos;re the future of the{" "}
                <span className="text-accent">metallurgy industry</span>
              </>
            }
          />
          <p className="mt-6 text-base leading-relaxed text-ink/70">
            Established in 2009, Maisam Steel Mill became the first steel
            manufacturer in Afghanistan to operate to international IEC/ISO
            standards. From our plant at Pol-e-Charkhi, we produce certified
            rebar, angles and T-bars for the projects rebuilding the country.
          </p>
          <p className="mt-4 text-base leading-relaxed text-ink/70">
            Our purpose reaches beyond the mill floor — to build a domestic value
            chain, create skilled work, and set the regional benchmark for steel
            that lasts.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/about">Our story</Button>
            <Button href="/services" variant="secondary" arrow={false}>
              Browse services
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
