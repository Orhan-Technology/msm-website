import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/require-admin";
import { deleteMessage, fetchMessages, markMessageRead } from "@/lib/cms/messages-repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  return NextResponse.json({ ok: true, messages: fetchMessages() });
}

export async function PATCH(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  let body: { id?: string; read?: boolean };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }
  if (!body.id) return NextResponse.json({ ok: false, message: "A message id is required" }, { status: 400 });

  markMessageRead(body.id, body.read !== false);
  return NextResponse.json({ ok: true, messages: fetchMessages() });
}

export async function DELETE(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, message: "A message id is required" }, { status: 400 });

  deleteMessage(id);
  return NextResponse.json({ ok: true, messages: fetchMessages() });
}
