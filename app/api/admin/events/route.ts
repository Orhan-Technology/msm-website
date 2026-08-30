import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/require-admin";
import { createEvent, fetchAdminEvents, reorderEvents, type EventInput } from "@/lib/cms/events-repo";
import { revalidateCms } from "@/lib/cms/revalidate";
import { defaultLocale } from "@/lib/i18n/locales";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  return NextResponse.json({ ok: true, events: fetchAdminEvents() });
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  let body: EventInput;
  try {
    body = (await request.json()) as EventInput;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }
  if (!body.translations?.[defaultLocale]?.title?.trim()) {
    return NextResponse.json({ ok: false, message: "An English title is required" }, { status: 400 });
  }

  const event = createEvent(body);
  revalidateCms();
  return NextResponse.json({ ok: true, event });
}

/** Reorder the whole list by passing the ids in their new order. */
export async function PATCH(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  let body: { order?: string[] };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }
  if (!Array.isArray(body.order) || !body.order.length) {
    return NextResponse.json({ ok: false, message: "An order array is required" }, { status: 400 });
  }

  reorderEvents(body.order);
  revalidateCms();
  return NextResponse.json({ ok: true, events: fetchAdminEvents() });
}
