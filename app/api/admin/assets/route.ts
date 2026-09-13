import { del, head } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/require-admin";
import { deleteAssetRow, fetchAsset, fetchAssets, insertAsset, updateAssetAlt } from "@/lib/cms/assets-repo";
import { revalidateMedia } from "@/lib/cms/revalidate";
import { formatBytes, maxBytesForMime, resolveUploadMime } from "@/lib/media/media-kinds";

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

/**
 * Records a file the browser has already uploaded to Blob (see
 * lib/media/upload-asset.ts). The bytes never pass through here — this only
 * confirms the blob exists and files it in the database.
 */
export async function POST(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  let body: { id?: string; url?: string; fileName?: string; mimeType?: string; alt?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }

  if (!body.id || !body.url) {
    return NextResponse.json({ ok: false, message: "An id and url are required" }, { status: 400 });
  }

  const mime = resolveUploadMime(body.mimeType ?? "", body.fileName ?? "");
  if (!mime) {
    return NextResponse.json({ ok: false, message: "Unsupported file type." }, { status: 400 });
  }

  // Trust the store, not the caller: this is where the real size and type come from.
  let uploaded;
  try {
    uploaded = await head(body.url);
  } catch {
    return NextResponse.json(
      { ok: false, message: "That upload could not be found in the media store." },
      { status: 400 },
    );
  }

  const limit = maxBytesForMime(mime);
  if (uploaded.size > limit) {
    await del(body.url).catch(() => {});
    return NextResponse.json(
      { ok: false, message: `File too large — this file must be under ${formatBytes(limit)}.` },
      { status: 400 },
    );
  }

  const row = {
    id: body.id,
    // The Blob CDN URL is stored verbatim: it serves range requests natively, so
    // videos seek without this app proxying a single byte.
    publicPath: uploaded.url,
    fileName: (body.fileName ?? "").slice(0, 200),
    mimeType: mime,
    byteSize: uploaded.size,
    alt: (body.alt ?? "").slice(0, 300),
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
  // The row is the source of truth; an orphaned blob is harmless if this fails.
  await del(row.publicPath).catch(() => {});
  revalidateMedia();
  return NextResponse.json({ ok: true });
}
