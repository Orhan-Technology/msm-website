import { NextResponse } from "next/server";
import { getPublishedEvents } from "@/lib/cms/events-repo";
import { defaultLocale, isLocale } from "@/lib/i18n/locales";

export const runtime = "nodejs";

/** Public, read-only feed of published events. Pass ?locale=fa|ps to translate. */
export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const requested = searchParams.get("locale");
  const locale = isLocale(requested) ? requested : defaultLocale;
  const limitParam = Number(searchParams.get("limit"));
  const featuredOnly = searchParams.get("featured") === "true";

  let events = await getPublishedEvents(locale);
  if (featuredOnly) events = events.filter((event) => event.featured);
  if (Number.isFinite(limitParam) && limitParam > 0) events = events.slice(0, limitParam);

  return NextResponse.json(
    { ok: true, locale, count: events.length, events },
    { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=600" } },
  );
}
