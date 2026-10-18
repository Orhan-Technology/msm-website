import { randomUUID } from "crypto";
import { createWriteStream } from "fs";
import { mkdir, stat, unlink } from "fs/promises";
import path from "path";
import { Readable } from "stream";
import { pipeline } from "stream/promises";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/require-admin";
import { deleteAssetRow, fetchAsset, fetchAssets, insertAsset, updateAssetAlt } from "@/lib/cms/assets-repo";
import { revalidateMedia } from "@/lib/cms/revalidate";
import { extensionForMime, formatBytes, maxBytesForMime, resolveUploadMime } from "@/lib/media/media-kinds";
import { uploadDir } from "@/lib/media/upload-dir";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const kindParam = new URL(request.url).searchParams.get("kind");
  const kind =
    kindParam === "image" || kindParam === "video" || kindParam === "document" ? kindParam : undefined;
  return NextResponse.json({ ok: true, assets: await fetchAssets(kind) });
}

/** Receives one file from the media library (multipart field "file") and writes it to the upload volume. */
export async function POST(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, message: "No file was received" }, { status: 400 });
  }

  const mime = resolveUploadMime(file.type, file.name);
  if (!mime) {
    return NextResponse.json(
      { ok: false, message: "Unsupported file type. Use JPG, PNG, WebP, SVG, GIF, AVIF, MP4, WebM, OGG, MOV or PDF." },
      { status: 400 },
    );
  }

  const limit = maxBytesForMime(mime);
  if (file.size > limit) {
    return NextResponse.json(
      { ok: false, message: `File too large — this file must be under ${formatBytes(limit)}.` },
      { status: 400 },
    );
  }

  const id = randomUUID();
  const storedName = `${id}.${extensionForMime(mime)}`;
  await mkdir(uploadDir, { recursive: true });
  const target = path.join(uploadDir, storedName);

  let byteSize = file.size;
  try {
    await pipeline(
      Readable.fromWeb(file.stream() as Parameters<typeof Readable.fromWeb>[0]),
      createWriteStream(target),
    );
    byteSize = (await stat(target)).size;
    if (byteSize > limit) throw new Error("over limit");
  } catch {
    await unlink(target).catch(() => {});
    return NextResponse.json({ ok: false, message: "Upload failed while saving the file." }, { status: 400 });
  }

  const row = {
    id,
    publicPath: `/api/uploads/${storedName}`,
    fileName: file.name.slice(0, 200),
    mimeType: mime,
    byteSize,
    alt: (form.get("alt") as string | null)?.slice(0, 300) ?? "",
    createdAt: Date.now(),
  };
  await insertAsset(row);
  revalidateMedia();
  return NextResponse.json({ ok: true, asset: row });
}

export async function PATCH(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  let body: { id?: string; alt?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }
  if (!body.id) return NextResponse.json({ ok: false, message: "An asset id is required" }, { status: 400 });
  if (!(await fetchAsset(body.id))) {
    return NextResponse.json({ ok: false, message: "Asset not found" }, { status: 404 });
  }

  await updateAssetAlt(body.id, (body.alt ?? "").slice(0, 300));
  revalidateMedia();
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, message: "An asset id is required" }, { status: 400 });

  const row = await fetchAsset(id);
  if (!row) return NextResponse.json({ ok: false, message: "Asset not found" }, { status: 404 });

  await deleteAssetRow(id);
  // The row is the source of truth; a leftover file on disk is harmless if this fails.
  await unlink(path.join(uploadDir, path.basename(row.publicPath))).catch(() => {});
  revalidateMedia();
  return NextResponse.json({ ok: true });
}
