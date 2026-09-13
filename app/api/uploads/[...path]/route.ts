import { list } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const safeUploadName = /^[a-f0-9-]+\.(jpg|jpeg|png|webp|svg|gif|avif|mp4|m4v|webm|ogv|ogg|mov|pdf)$/i;

/**
 * Compatibility shim for media uploaded before the move to Vercel Blob.
 *
 * Content saved in the panel back then stored "/api/uploads/<id>.<ext>", and those
 * strings are embedded in section payloads all over the database. Rather than
 * rewrite every one, this looks the file up in Blob and redirects to its CDN URL.
 * New uploads store the Blob URL directly and never reach this route.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const segments = (await params).path;
  const name = (segments ?? []).join("/").split("/").pop() ?? "";
  if (!segments?.length || !safeUploadName.test(name)) return new NextResponse(null, { status: 404 });

  try {
    const { blobs } = await list({ prefix: `uploads/${name}`, limit: 1 });
    const match = blobs.find((blob) => blob.pathname === `uploads/${name}`);
    if (!match) return new NextResponse(null, { status: 404 });

    return NextResponse.redirect(match.url, {
      status: 308,
      headers: { "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
