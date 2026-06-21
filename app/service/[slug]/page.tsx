import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, ArrowUpRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import CtaBanner from "@/components/sections/CtaBanner";
import { services } from "@/lib/services";
import { company } from "@/lib/company";

const featureImages = [
  "/images/intro.jpg",
  "/images/quality.jpg",
  "/images/about.jpg",
  "/images/hero.jpg",
  "/images/products/steel-rebar.jpg",
  "/images/products/steel-coils.jpg",
];

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const s = services.find((x) => x.slug === params.slug);
  return {
    title: s ? `${s.title} — Maisam Steel Mill` : "Service",
    description: s?.shortDescription,
  };
}

export default function ServicePage({
  params,
}: {
  params: { slug: string };
}) {
  const idx = services.findIndex((s) => s.slug === params.slug);
  const service = services[idx];
  if (!service) notFound();
  const related = services.filter((s) => s.slug !== service.slug).slice(0, 3);
  const image = featureImages[idx % featureImages.length];

  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="Service"
          title={service.title}
          lead={service.shortDescription}
        />

        <section className="section bg-sand text-ink">
          <div className="container-x grid gap-12 lg:grid-cols-3 lg:gap-12">
            <div className="lg:col-span-2">
              <Reveal className="overflow-hidden rounded-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt={service.title} className="h-[420px] w-full object-cover" />
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-8 text-lg leading-relaxed text-ink/75">
                  {service.fullDescription}
                </p>
                <h3 className="mt-10">What we deliver</h3>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {service.capabilities.map((c) => (
                    <li key={c} className="flex items-start gap-3 text-ink/80">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent text-white">
                        <Check className="h-3 w-3" />
                      </span>
                      {c}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="rounded-card bg-charcoal p-7 text-sand">
                  <Icon name={service.icon} className="h-8 w-8 text-accent" />
                  <h3 className="mt-4 text-sand">Request a quote</h3>
                  <p className="mt-2 text-sm text-mist">
                    Tell us your sizes and quantities — we respond within 24 hours.
                  </p>
                  <Link
                    href="/contact"
                    className="sheen-btn mt-5 inline-flex w-full items-center justify-center gap-2 rounded-btn bg-accent px-5 py-3.5 font-display text-sm font-medium text-white transition-colors hover:bg-accent-hover"
                  >
                    Get in touch
                  </Link>
                  <div className="mt-4 border-t border-line-dark pt-4 text-sm text-mist">
                    <p>{company.phone}</p>
                    <p>{company.email}</p>
                  </div>
                </div>

                <div className="rounded-card border border-line-light bg-white p-6">
                  <p className="eyebrow mb-3">Other services</p>
                  <ul className="space-y-1">
                    {services
                      .filter((s) => s.slug !== service.slug)
                      .map((s) => (
                        <li key={s.slug}>
                          <Link
                            href={`/service/${s.slug}`}
                            className="flex items-center justify-between py-2 text-sm text-ink/70 transition-colors hover:text-accent"
                          >
                            {s.title}
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* Related */}
        <section className="section bg-white text-ink">
          <div className="container-x">
            <h2 className="mb-10">Related services</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((s, i) => (
                <Reveal key={s.slug} delay={i * 0.08}>
                  <Link
                    href={`/service/${s.slug}`}
                    className="group flex h-full flex-col rounded-card border border-line-light bg-sand p-7 transition-all duration-300 hover:-translate-y-1 hover:border-ink/20"
                  >
                    <span className="grid h-11 w-11 place-items-center rounded-btn bg-white text-accent">
                      <Icon name={s.icon} className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 text-lg">{s.title}</h3>
                    <p className="mt-2 flex-1 text-sm text-ink/60">{s.shortDescription}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
