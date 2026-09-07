import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import EventCard from "@/components/events/EventCard";
import { currentLocale, section } from "@/lib/cms/content";
import { getPublishedEvents } from "@/lib/cms/events-repo";

type EventsTeaserContent = {
  enabled: boolean;
  eyebrowNumber: string;
  eyebrowLabel: string;
  title: string;
  description: string;
  limit: number;
  linkLabel: string;
  linkHref: string;
};

export default async function EventsTeaser({ eyebrowNumber }: { eyebrowNumber?: string }) {
  const locale = await currentLocale();
  const [content, events] = await Promise.all([
    section<EventsTeaserContent>("home.events"),
    getPublishedEvents(locale),
  ]);

  // Hidden by the admin, or nothing to show yet.
  if (content.enabled === false || events.length === 0) return null;

  const items = events.slice(0, Number(content.limit) || 3);

  return (
    <section className="section bg-white text-ink">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrowNumber={eyebrowNumber ?? content.eyebrowNumber}
            eyebrowLabel={content.eyebrowLabel}
            title={content.title}
            description={content.description}
          />
          {content.linkLabel && (
            <Link
              href={content.linkHref || "/events"}
              className="group inline-flex items-center gap-2 font-display text-sm font-medium text-accent hover:text-accent-hover"
            >
              {content.linkLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((event, index) => (
            <Reveal key={event.id} delay={(index % 3) * 0.08} as="article">
              <EventCard event={event} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
