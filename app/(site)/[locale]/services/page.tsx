import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import ProcessSteps from "@/components/sections/ProcessSteps";
import CtaBanner from "@/components/sections/CtaBanner";
import { getPageHero, getServices } from "@/lib/cms/site-data";

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPageHero("services.hero");
  return { title: "Services", description: hero.lead, alternates: { canonical: "/services" } };
}

export default async function ServicesPage() {
  const [hero, services] = await Promise.all([getPageHero("services.hero"), getServices()]);

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

        <section className="section bg-sand text-ink">
          <div className="container-x">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <Reveal key={service.slug} delay={(index % 3) * 0.08} as="article">
                  <Link
                    href={`/service/${service.slug}`}
                    className="group flex h-full flex-col rounded-card border border-line-light bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.25)]"
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-btn bg-sand text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                      <Icon name={service.icon} className="h-6 w-6" />
                    </span>
                    <h3 className="mt-5">{service.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/60">{service.shortDescription}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 font-display text-sm font-medium text-accent">
                      Learn more
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <ProcessSteps />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
