import { NextResponse } from "next/server";
import { getPublishedEventBySlug } from "@/lib/cms/events-repo";
import { defaultLocale, isLocale } from "@/lib/i18n/locales";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const requested = new URL(request.url).searchParams.get("locale");
  const locale = isLocale(requested) ? requested : defaultLocale;

  const event = await getPublishedEventBySlug((await params).slug, locale);
  if (!event) return NextResponse.json({ ok: false, message: "Event not found" }, { status: 404 });

  return NextResponse.json(
    { ok: true, locale, event },
    { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=600" } },
  );
}
