"use client";
import type { AssetSummary } from "@/components/admin/media-picker";
import { formatBytes, maxBytesForMime, resolveUploadMime } from "@/lib/media/media-kinds";

export type UploadResult = { ok: boolean; message?: string; asset?: AssetSummary };

/**
 * Send one file from the browser to the media library, which stores it on the
 * server's upload volume. Type and size are checked here only to fail fast; the
 * server enforces both again.
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

  const form = new FormData();
  form.append("file", file);

  try {
    const response = await fetch("/api/admin/assets", { method: "POST", body: form });
    return (await response.json()) as UploadResult;
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Upload failed." };
  }
}
