"use client";
import { upload } from "@vercel/blob/client";
import type { AssetSummary } from "@/components/admin/media-picker";
import { extensionForMime, formatBytes, maxBytesForMime, resolveUploadMime } from "@/lib/media/media-kinds";

export type UploadResult = { ok: boolean; message?: string; asset?: AssetSummary };

/**
 * Send one file from the browser straight to Vercel Blob, then register it.
 *
 * The file deliberately never passes through a Vercel Function: those accept a
 * request body of at most 100 MB, and this library takes videos up to 300 MB.
 * The browser uploads directly with a short-lived token minted by
 * /api/admin/assets/upload-url, and only the resulting metadata is POSTed back.
 */
export async function uploadAsset(file: File): Promise<UploadResult> {
  const mime = resolveUploadMime(file.type, file.name);
  if (!mime) {
    return {
      ok: false,
      message: "Unsupported file type. Use JPG, PNG, WebP, SVG, GIF, AVIF, MP4, WebM, OGG, MOV or PDF.",
    };
  }

  const limit = maxBytesForMime(mime);
  if (file.size > limit) {
    return { ok: false, message: `File too large — this file must be under ${formatBytes(limit)}.` };
  }

  // The id doubles as the stored filename, exactly as the old on-disk scheme did,
  // so a path stays stable and guessable-free for the life of the asset.
  const id = crypto.randomUUID();
  const pathname = `uploads/${id}.${extensionForMime(mime)}`;

  try {
    const blob = await upload(pathname, file, {
      access: "public",
      contentType: mime,
      handleUploadUrl: "/api/admin/assets/upload-url",
    });

    const response = await fetch("/api/admin/assets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, url: blob.url, fileName: file.name, mimeType: mime }),
    });
    return (await response.json()) as UploadResult;
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Upload failed." };
  }
}
