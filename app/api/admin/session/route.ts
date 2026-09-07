import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/require-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ ok: await isAdminAuthenticated() });
}
