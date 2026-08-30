import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import EventCard, { formatEventDate } from "@/components/events/EventCard";
import { getPublishedEventBySlug, getPublishedEvents } from "@/lib/cms/events-repo";
import { siteUrl } from "@/lib/site";
import { currentLocale } from "@/lib/cms/content";
import { defaultLocale } from "@/lib/i18n/locales";

export async function generateStaticParams() {
  const events = await getPublishedEvents(defaultLocale);
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const event = await getPublishedEventBySlug((await params).slug, await currentLocale());
  if (!event) return { title: "Event not found" };
  return {
    title: event.title,
    description: event.summary,
    alternates: { canonical: `/events/${event.slug}` },
    openGraph: {
      title: event.title,
      description: event.summary,
      images: event.imagePath ? [{ url: event.imagePath }] : undefined,
    },
  };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await currentLocale();
  const event = await getPublishedEventBySlug(slug, locale);
  if (!event) notFound();

  const [all, t] = await Promise.all([getPublishedEvents(locale), getTranslations("events")]);
  const related = all.filter((item) => item.id !== event.id).slice(0, 3);
  const dateLabel = formatEventDate(event.startDate, event.endDate);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.summary,
    startDate: event.startDate || undefined,
    endDate: event.endDate || undefined,
    location: event.location ? { "@type": "Place", name: event.location } : undefined,
    image: event.imagePath ? `${siteUrl}${event.imagePath}` : undefined,
    url: `${siteUrl}/events/${event.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-charcoal text-sand">
          <div className="container-x pb-14 pt-36 md:pb-16 md:pt-40">
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 font-display text-sm font-medium text-mist transition-colors hover:text-accent"
            >
              <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" />
              {t("allEvents")}
            </Link>

            {event.category && <span className="eyebrow mt-6 block">{event.category}</span>}
            <h1 className="mt-3 max-w-4xl text-balance text-sand">{event.title}</h1>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-mist">
              {dateLabel && (
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-accent" />
                  {dateLabel}
                </span>
              )}
              {event.location && (
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent" />
                  {event.location}
                </span>
              )}
            </div>

            {event.ctaLabel && event.ctaHref && (
              <a
                href={event.ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="sheen-btn mt-8 inline-flex items-center gap-2 rounded-btn bg-accent px-7 py-4 font-display text-sm font-medium text-white transition-colors hover:bg-accent-hover"
              >
                {event.ctaLabel}
              </a>
            )}
          </div>
        </section>

        {/* Media */}
        {(event.videoPath || event.imagePath) && (
          <section className="bg-charcoal">
            <div className="container-x">
              <div className="overflow-hidden rounded-card">
                {event.videoPath ? (
                  <video
                    src={event.videoPath}
                    controls
                    playsInline
                    preload="metadata"
                    poster={event.imagePath || undefined}
                    className="block max-h-[70vh] w-full bg-black object-contain"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={event.imagePath}
                    alt={event.title}
                    className="block max-h-[70vh] w-full object-cover"
                  />
                )}
              </div>
            </div>
          </section>
        )}

        {/* Body */}
        <section className="section bg-sand text-ink">
          <div className="container-x">
            <div className="mx-auto max-w-3xl">
              {event.summary && (
                <p className="text-lg leading-relaxed text-ink/75 md:text-xl">{event.summary}</p>
              )}
              {event.body && (
                <div className="mt-8 space-y-5">
                  {event.body
                    .split(/\n{2,}/)
                    .filter(Boolean)
                    .map((paragraph, index) => (
                      <p key={index} className="whitespace-pre-line text-base leading-relaxed text-ink/70">
                        {paragraph}
                      </p>
                    ))}
                </div>
              )}
            </div>

            {event.gallery.length > 0 && (
              <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {event.gallery
                  .filter(Boolean)
                  .map((photo, index) => (
                    <Reveal key={`${photo}-${index}`} delay={(index % 3) * 0.08} className="overflow-hidden rounded-card">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo}
                        alt={`${event.title} — photo ${index + 1}`}
                        loading="lazy"
                        decoding="async"
                        className="h-64 w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </Reveal>
                  ))}
              </div>
            )}
          </div>
        </section>

        {related.length > 0 && (
          <section className="section bg-white text-ink">
            <div className="container-x">
              <h2 className="text-ink">{t("moreEvents")}</h2>
              <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {related.map((item, index) => (
                  <Reveal key={item.id} delay={(index % 3) * 0.08} as="article">
                    <EventCard event={item} />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
