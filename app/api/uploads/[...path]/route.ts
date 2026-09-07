import { createReadStream } from "fs";
import { readFile, stat } from "fs/promises";
import path from "path";
import { Readable } from "stream";
import { NextResponse } from "next/server";
import { MIME_BY_EXT, isVideoMime } from "@/lib/media/media-kinds";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const uploadDir = path.join(process.cwd(), "public", "uploads");
const safeUploadName = /^[a-f0-9-]+\.(jpg|jpeg|png|webp|svg|gif|avif|mp4|m4v|webm|ogv|ogg|mov|pdf)$/i;

function toWebStream(stream: Readable): ReadableStream<Uint8Array> {
  return Readable.toWeb(stream) as unknown as ReadableStream<Uint8Array>;
}

/** Parse a single `bytes=start-end` header; null when absent or unusable. */
function parseRange(header: string | null, size: number): { start: number; end: number } | null {
  if (!header) return null;
  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!match) return null;
  const [, rawStart, rawEnd] = match;
  if (!rawStart && !rawEnd) return null;
  let start: number;
  let end: number;
  if (!rawStart) {
    const suffix = Number(rawEnd);
    if (!Number.isFinite(suffix) || suffix <= 0) return null;
    start = Math.max(0, size - suffix);
    end = size - 1;
  } else {
    start = Number(rawStart);
    end = rawEnd ? Number(rawEnd) : size - 1;
  }
  if (!Number.isFinite(start) || !Number.isFinite(end) || start > end || start >= size) return null;
  return { start, end: Math.min(end, size - 1) };
}

export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const segments = (await params).path;
  const name = path.basename((segments ?? []).join("/"));
  if (!segments?.length || !safeUploadName.test(name)) return new NextResponse(null, { status: 404 });

  const filePath = path.join(uploadDir, name);
  if (!filePath.startsWith(uploadDir)) return new NextResponse(null, { status: 400 });

  try {
    const info = await stat(filePath);
    if (!info.isFile()) return new NextResponse(null, { status: 404 });

    const ext = path.extname(name).slice(1).toLowerCase();
    const contentType = MIME_BY_EXT[ext] ?? "application/octet-stream";
    const cacheControl = "public, max-age=31536000, immutable";

    if (!isVideoMime(contentType)) {
      const buffer = await readFile(filePath);
      return new NextResponse(buffer as unknown as BodyInit, {
        headers: {
          "Content-Type": contentType,
          "Content-Length": String(info.size),
          "Cache-Control": cacheControl,
        },
      });
    }

    // Videos honour Range requests so the browser can seek instead of buffering the whole file.
    const range = parseRange(request.headers.get("range"), info.size);
    if (range) {
      const length = range.end - range.start + 1;
      return new NextResponse(toWebStream(createReadStream(filePath, { start: range.start, end: range.end })), {
        status: 206,
        headers: {
          "Content-Type": contentType,
          "Content-Length": String(length),
          "Content-Range": `bytes ${range.start}-${range.end}/${info.size}`,
          "Accept-Ranges": "bytes",
          "Cache-Control": cacheControl,
        },
      });
    }

    return new NextResponse(toWebStream(createReadStream(filePath)), {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(info.size),
        "Accept-Ranges": "bytes",
        "Cache-Control": cacheControl,
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
