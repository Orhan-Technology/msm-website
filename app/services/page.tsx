import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import ProcessSteps from "@/components/sections/ProcessSteps";
import CtaBanner from "@/components/sections/CtaBanner";
import { services } from "@/lib/services";

export const metadata = {
  title: "Services",
  description:
    "Metal crafting, recycling, heat treatment, quality testing, fabrication and finishing — a comprehensive set of metallurgy services.",
};

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="Services"
          title={
            <>
              A comprehensive set of <span className="text-accent">services</span>
            </>
          }
          lead="From melt to market, every stage of steel production handled in-house and to international standard."
        />

        <section className="section bg-sand text-ink">
          <div className="container-x">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s, i) => (
                <Reveal key={s.slug} delay={(i % 3) * 0.08} as="article">
                  <Link
                    href={`/service/${s.slug}`}
                    className="group flex h-full flex-col rounded-card border border-line-light bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.25)]"
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-btn bg-sand text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                      <Icon name={s.icon} className="h-6 w-6" />
                    </span>
                    <h3 className="mt-5">{s.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/60">
                      {s.shortDescription}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 font-display text-sm font-medium text-accent">
                      Learn more
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
