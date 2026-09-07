import { NextResponse } from "next/server";
import { clientIpFrom } from "@/lib/admin/rate-limit";
import { createMessage } from "@/lib/cms/messages-repo";
import { defaultLocale, isLocale } from "@/lib/i18n/locales";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const submissions = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 8;

/** Light throttle so the public form can't be used to flood the inbox. */
function allowSubmission(ip: string) {
  const now = Date.now();
  const row = submissions.get(ip);
  if (!row || now > row.resetAt) {
    submissions.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (row.count >= MAX_PER_WINDOW) return false;
  row.count += 1;
  return true;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  if (!allowSubmission(clientIpFrom(request))) {
    return NextResponse.json({ ok: false, message: "Too many messages. Please try again later." }, { status: 429 });
  }

  let body: {
    kind?: string;
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    subject?: string;
    message?: string;
    locale?: string;
    /** Honeypot — real people leave it empty. */
    website?: string;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request" }, { status: 400 });
  }

  if (body.website) return NextResponse.json({ ok: true });

  const kind = body.kind === "newsletter" ? "newsletter" : "contact";
  const email = (body.email ?? "").trim();
  if (!emailPattern.test(email)) {
    return NextResponse.json({ ok: false, message: "Please enter a valid email address." }, { status: 400 });
  }
  if (kind === "contact" && !(body.message ?? "").trim()) {
    return NextResponse.json({ ok: false, message: "Please include a message." }, { status: 400 });
  }

  createMessage({
    kind,
    name: body.name,
    email,
    phone: body.phone,
    company: body.company,
    subject: body.subject,
    message: body.message,
    locale: isLocale(body.locale) ? body.locale : defaultLocale,
  });

  return NextResponse.json({ ok: true });
}
