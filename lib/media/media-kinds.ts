export type MediaKind = "image" | "video" | "document";

export const DOCUMENT_MIME_EXT: Record<string, string> = {
  "application/pdf": "pdf",
};

export const IMAGE_MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "image/gif": "gif",
  "image/avif": "avif",
};

export const VIDEO_MIME_EXT: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/ogg": "ogv",
  "video/quicktime": "mov",
};

export const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  svg: "image/svg+xml",
  gif: "image/gif",
  avif: "image/avif",
  mp4: "video/mp4",
  m4v: "video/mp4",
  webm: "video/webm",
  ogv: "video/ogg",
  ogg: "video/ogg",
  mov: "video/quicktime",
  pdf: "application/pdf",
};

export const UPLOAD_ACCEPT_IMAGE = "image/jpeg,image/png,image/webp,image/svg+xml,image/gif,image/avif";
export const UPLOAD_ACCEPT_VIDEO = "video/mp4,video/webm,video/ogg,video/quicktime";
export const UPLOAD_ACCEPT_DOCUMENT = "application/pdf";
export const UPLOAD_ACCEPT_ALL = `${UPLOAD_ACCEPT_IMAGE},${UPLOAD_ACCEPT_VIDEO},${UPLOAD_ACCEPT_DOCUMENT}`;

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 300 * 1024 * 1024;
export const MAX_DOCUMENT_BYTES = 40 * 1024 * 1024;

export function mediaKindOf(mimeType: string | null | undefined): MediaKind | null {
  if (!mimeType) return null;
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("image/")) return "image";
  if (DOCUMENT_MIME_EXT[mimeType]) return "document";
  return null;
}

export function isVideoMime(mimeType: string | null | undefined): boolean {
  return mediaKindOf(mimeType) === "video";
}

/** Guess the kind of a stored path when we only have the URL (e.g. static assets). */
export function mediaKindOfPath(pathValue: string | null | undefined): MediaKind {
  const ext = (pathValue ?? "").toLowerCase().split("?")[0].split(".").pop() ?? "";
  return mediaKindOf(MIME_BY_EXT[ext]) ?? "image";
}

/** Trust the browser's mime when we recognise it, otherwise fall back to the extension. */
export function resolveUploadMime(reported: string | null | undefined, fileName: string | null | undefined): string | null {
  const mime = (reported ?? "").toLowerCase();
  if (IMAGE_MIME_EXT[mime] || VIDEO_MIME_EXT[mime] || DOCUMENT_MIME_EXT[mime]) return mime;
  const ext = (fileName ?? "").toLowerCase().split(".").pop() ?? "";
  const byExt = MIME_BY_EXT[ext];
  if (byExt && (IMAGE_MIME_EXT[byExt] || VIDEO_MIME_EXT[byExt] || DOCUMENT_MIME_EXT[byExt])) return byExt;
  return null;
}

export function extensionForMime(mime: string): string {
  return IMAGE_MIME_EXT[mime] ?? VIDEO_MIME_EXT[mime] ?? DOCUMENT_MIME_EXT[mime] ?? "bin";
}

export function maxBytesForMime(mime: string): number {
  const kind = mediaKindOf(mime);
  if (kind === "video") return MAX_VIDEO_BYTES;
  if (kind === "document") return MAX_DOCUMENT_BYTES;
  return MAX_IMAGE_BYTES;
}

export function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}
