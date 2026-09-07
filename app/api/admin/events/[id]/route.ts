import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/require-admin";
import { deleteEvent, fetchAdminEvent, updateEvent, type EventInput } from "@/lib/cms/events-repo";
import { revalidateCms } from "@/lib/cms/revalidate";
import { defaultLocale } from "@/lib/i18n/locales";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const event = fetchAdminEvent((await params).id);
  if (!event) return NextResponse.json({ ok: false, message: "Event not found" }, { status: 404 });
  return NextResponse.json({ ok: true, event });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

  const event = updateEvent((await params).id, body);
  if (!event) return NextResponse.json({ ok: false, message: "Event not found" }, { status: 404 });

  revalidateCms();
  return NextResponse.json({ ok: true, event });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  if (!deleteEvent((await params).id)) {
    return NextResponse.json({ ok: false, message: "Event not found" }, { status: 404 });
  }
  revalidateCms();
  return NextResponse.json({ ok: true });
}
