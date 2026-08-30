import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight, CalendarDays, MapPin, PlayCircle } from "lucide-react";
import type { EventRecord } from "@/lib/cms/events-repo";

export function formatEventDate(start: string, end?: string) {
  if (!start) return "";
  const startDate = new Date(start);
  if (Number.isNaN(startDate.getTime())) return start;
  const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
  const startLabel = startDate.toLocaleDateString("en-GB", options);
  if (!end) return startLabel;
  const endDate = new Date(end);
  if (Number.isNaN(endDate.getTime())) return startLabel;
  return `${startDate.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${endDate.toLocaleDateString("en-GB", options)}`;
}

export default async function EventCard({ event, tone = "light" }: { event: EventRecord; tone?: "light" | "dark" }) {
  const t = await getTranslations("common");
  const dark = tone === "dark";
  const dateLabel = formatEventDate(event.startDate, event.endDate);

  return (
    <Link
      href={`/events/${event.slug}`}
      className={`group flex h-full flex-col overflow-hidden rounded-card border transition-all duration-300 hover:-translate-y-1 ${
        dark
          ? "border-line-dark bg-elevated hover:border-accent/40"
          : "border-line-light bg-white hover:border-accent/40 hover:shadow-[0_24px_50px_-28px_rgba(0,0,0,0.28)]"
      }`}
    >
      <div className="relative overflow-hidden bg-sand">
        {event.videoPath ? (
          <>
            <video
              src={event.videoPath}
              muted
              loop
              playsInline
              preload="metadata"
              poster={event.imagePath || undefined}
              className="h-56 w-full object-cover"
            />
            <span className="absolute inset-0 grid place-items-center text-white/80">
              <PlayCircle className="h-12 w-12 drop-shadow" strokeWidth={1.25} />
            </span>
          </>
        ) : event.imagePath ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.imagePath}
            alt={event.title}
            loading="lazy"
            decoding="async"
            className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="grid h-56 w-full place-items-center bg-charcoal text-mist/40">
            <CalendarDays className="h-10 w-10" strokeWidth={1.25} />
          </span>
        )}

        {event.category && (
          <span className="absolute start-4 top-4 rounded-full bg-charcoal/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sand backdrop-blur">
            {event.category}
          </span>
        )}
        {event.featured && (
          <span className="absolute end-4 top-4 rounded-full bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
            {t("featured")}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-7">
        <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs ${dark ? "text-mist" : "text-ink/50"}`}>
          {dateLabel && (
            <span className="inline-flex items-center gap-1.5 font-display font-semibold text-accent">
              <CalendarDays className="h-3.5 w-3.5" />
              {dateLabel}
            </span>
          )}
          {event.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {event.location}
            </span>
          )}
        </div>

        <h3 className={`mt-2 text-xl leading-snug group-hover:text-accent ${dark ? "text-sand" : ""}`}>
          {event.title}
        </h3>
        {event.summary && (
          <p className={`mt-3 flex-1 text-sm leading-relaxed ${dark ? "text-mist" : "text-ink/60"}`}>
            {event.summary}
          </p>
        )}

        <span className="mt-6 inline-flex items-center gap-2 font-display text-sm font-medium text-accent">
          {t("readMore")}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
