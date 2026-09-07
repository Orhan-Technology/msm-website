import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import EventCard from "@/components/events/EventCard";
import CtaBanner from "@/components/sections/CtaBanner";
import { getPublishedEvents } from "@/lib/cms/events-repo";
import { getPageHero } from "@/lib/cms/site-data";
import { currentLocale } from "@/lib/cms/content";

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPageHero("events.hero");
  return {
    title: "Events",
    description: hero.lead,
    alternates: { canonical: "/events" },
  };
}

export default async function EventsPage() {
  const locale = await currentLocale();
  const [hero, events] = await Promise.all([getPageHero("events.hero"), getPublishedEvents(locale)]);
  const [featured, ...rest] = events;

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
            {events.length === 0 ? (
              <div className="rounded-card border border-dashed border-line-light bg-white/60 px-6 py-20 text-center">
                <p className="font-display text-lg font-semibold text-ink">
                  {hero.emptyState || "No events published yet — check back soon."}
                </p>
              </div>
            ) : (
              <>
                <Reveal>
                  <EventCard event={featured} />
                </Reveal>
                {rest.length > 0 && (
                  <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {rest.map((event, index) => (
                      <Reveal key={event.id} delay={(index % 3) * 0.08} as="article">
                        <EventCard event={event} />
                      </Reveal>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
