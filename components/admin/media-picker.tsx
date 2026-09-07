"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { FileText, Film, ImageIcon, Loader2, Trash2, Upload, X } from "lucide-react";
import { AdminButton, AdminInput, AdminNotice } from "@/components/admin/ui";
import {
  UPLOAD_ACCEPT_ALL,
  UPLOAD_ACCEPT_DOCUMENT,
  UPLOAD_ACCEPT_IMAGE,
  UPLOAD_ACCEPT_VIDEO,
  formatBytes,
  mediaKindOfPath,
  type MediaKind,
} from "@/lib/media/media-kinds";
import { cn } from "@/lib/utils";

export type AssetSummary = {
  id: string;
  publicPath: string;
  fileName: string;
  mimeType: string;
  byteSize: number;
  alt: string;
  createdAt: number;
};

type PickerKind = MediaKind | "any";

const acceptFor: Record<PickerKind, string> = {
  image: UPLOAD_ACCEPT_IMAGE,
  video: UPLOAD_ACCEPT_VIDEO,
  document: UPLOAD_ACCEPT_DOCUMENT,
  any: UPLOAD_ACCEPT_ALL,
};

const kindPlaceholder: Record<PickerKind, string> = {
  image: "/images/example.jpg — or paste a URL",
  video: "/videos/example.mp4 — or paste a URL",
  document: "/downloads/example.pdf — or paste a URL",
  any: "/images/example.jpg — or paste a URL",
};

/** Small preview of whatever is currently selected. */
function MediaPreview({ value, className }: { value: string; className?: string }) {
  const kind = mediaKindOfPath(value);
  if (kind === "video") {
    return (
      <video
        src={value}
        muted
        playsInline
        preload="metadata"
        className={cn("h-full w-full bg-charcoal object-cover", className)}
      />
    );
  }
  if (kind === "document") {
    return (
      <div className={cn("grid h-full w-full place-items-center bg-sand text-ink/40", className)}>
        <FileText className="h-6 w-6" />
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={value} alt="" className={cn("h-full w-full bg-sand object-cover", className)} />;
}

export default function MediaPicker({
  value,
  onChange,
  kind = "image",
  label,
}: {
  value: string;
  onChange: (next: string) => void;
  kind?: PickerKind;
  label?: string;
}) {
  const t = useTranslations("admin.fields");
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-stretch gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="grid h-[74px] w-[104px] shrink-0 place-items-center overflow-hidden rounded-btn border border-line-light bg-sand text-ink/35 transition-colors hover:border-accent/50"
          aria-label={t("chooseOrUpload")}
        >
          {value ? (
            <MediaPreview value={value} />
          ) : kind === "video" ? (
            <Film className="h-5 w-5" />
          ) : kind === "document" ? (
            <FileText className="h-5 w-5" />
          ) : (
            <ImageIcon className="h-5 w-5" />
          )}
        </button>

        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
          <AdminInput
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={kindPlaceholder[kind]}
            aria-label={label ?? "Media path"}
          />
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="font-display text-xs font-semibold text-accent hover:text-accent-hover"
            >
              {t("chooseOrUpload")}
            </button>
            {value && (
              <>
                <span className="text-ink/20">·</span>
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="font-display text-xs font-semibold text-ink/45 hover:text-ink"
                >
                  {t("clear")}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {open && (
        <MediaLibraryDialog
          kind={kind}
          onClose={() => setOpen(false)}
          onSelect={(asset) => {
            onChange(asset.publicPath);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

export function MediaLibraryDialog({
  kind = "any",
  onClose,
  onSelect,
}: {
  kind?: PickerKind;
  onClose: () => void;
  onSelect: (asset: AssetSummary) => void;
}) {
  const t = useTranslations("admin.media");
  const tClose = useTranslations("common");
  const [assets, setAssets] = useState<AssetSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const query = kind === "any" ? "" : `?kind=${kind}`;
      const response = await fetch(`/api/admin/assets${query}`);
      const data = (await response.json()) as { ok: boolean; assets?: AssetSummary[] };
      setAssets(data.assets ?? []);
    } catch {
      setError(t("loadError"));
    } finally {
      setLoading(false);
    }
  }, [kind, t]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    for (const file of Array.from(files)) {
      const form = new FormData();
      form.append("file", file);
      try {
        const response = await fetch("/api/admin/assets", { method: "POST", body: form });
        const data = (await response.json()) as { ok: boolean; message?: string };
        if (!data.ok) setError(data.message ?? t("uploadError"));
      } catch {
        setError(t("uploadError"));
      }
    }
    setUploading(false);
    await load();
  }

  async function remove(id: string) {
    await fetch(`/api/admin/assets?id=${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button aria-label={tClose("close")} onClick={onClose} className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" />
      <div className="relative flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-card bg-white sm:rounded-card">
        <div className="flex items-center justify-between gap-4 border-b border-line-light px-6 py-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink">{t("title")}</h2>
            <p className="text-xs text-ink/50">{t("itemCount", { count: assets.length })}</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              multiple
              accept={acceptFor[kind]}
              className="hidden"
              onChange={(event) => void upload(event.target.files)}
            />
            <AdminButton tone="primary" onClick={() => inputRef.current?.click()} disabled={uploading}>
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {uploading ? t("uploading") : t("upload")}
            </AdminButton>
            <button
              onClick={onClose}
              aria-label={tClose("close")}
              className="grid h-10 w-10 place-items-center rounded-btn text-ink/45 hover:bg-sand hover:text-ink"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4">
              <AdminNotice tone="error">{error}</AdminNotice>
            </div>
          )}

          {loading ? (
            <div className="grid place-items-center py-16 text-ink/40">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : assets.length === 0 ? (
            <div className="rounded-card border border-dashed border-line-light px-6 py-16 text-center">
              <p className="font-display font-semibold text-ink">{t("nothingUploaded")}</p>
              <p className="mt-1 text-sm text-ink/55">{t("uploadHint")}</p>
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {assets.map((asset) => (
                <li key={asset.id} className="group relative">
                  <button
                    type="button"
                    onClick={() => onSelect(asset)}
                    className="block w-full overflow-hidden rounded-card border border-line-light text-left transition-all hover:-translate-y-0.5 hover:border-accent/50"
                  >
                    <span className="block aspect-[4/3] overflow-hidden">
                      <MediaPreview value={asset.publicPath} />
                    </span>
                    <span className="block px-3 py-2.5">
                      <span className="block truncate font-display text-xs font-medium text-ink">
                        {asset.fileName || asset.publicPath}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-ink/45">{formatBytes(asset.byteSize)}</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => void remove(asset.id)}
                    aria-label={t("deleteFile")}
                    className="absolute end-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-charcoal/70 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 hover:bg-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
