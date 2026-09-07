"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Copy, FileText, Loader2, Trash2, Upload } from "lucide-react";
import type { AssetSummary } from "@/components/admin/media-picker";
import { AdminBadge, AdminButton, AdminEmpty, AdminNotice } from "@/components/admin/ui";
import { UPLOAD_ACCEPT_ALL, formatBytes, mediaKindOf } from "@/lib/media/media-kinds";
import { cn } from "@/lib/utils";

type Filter = "all" | "image" | "video" | "document";

const filterKeys: Filter[] = ["all", "image", "video", "document"];
const filterLabelKey: Record<Filter, string> = {
  all: "all",
  image: "images",
  video: "videos",
  document: "documents",
};

export default function MediaLibraryAdmin({ initialAssets }: { initialAssets: AssetSummary[] }) {
  const t = useTranslations("admin.media");
  const [assets, setAssets] = useState(initialAssets);
  const [filter, setFilter] = useState<Filter>("all");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    const response = await fetch("/api/admin/assets");
    const data = (await response.json()) as { ok: boolean; assets?: AssetSummary[] };
    if (data.assets) setAssets(data.assets);
  }, []);

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
    await refresh();
  }

  async function remove(asset: AssetSummary) {
    if (!window.confirm(t("confirmDelete", { name: asset.fileName || asset.publicPath }))) return;
    await fetch(`/api/admin/assets?id=${asset.id}`, { method: "DELETE" });
    await refresh();
  }

  async function copyPath(asset: AssetSummary) {
    await navigator.clipboard.writeText(asset.publicPath);
    setCopiedId(asset.id);
    window.setTimeout(() => setCopiedId(null), 1600);
  }

  const visible = filter === "all" ? assets : assets.filter((asset) => mediaKindOf(asset.mimeType) === filter);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {filterKeys.map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                "rounded-btn px-3.5 py-2 font-display text-sm font-medium transition-colors",
                filter === key ? "bg-charcoal text-sand" : "bg-white text-ink/60 hover:bg-sand hover:text-ink",
              )}
            >
              {t(filterLabelKey[key])}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={UPLOAD_ACCEPT_ALL}
            className="hidden"
            onChange={(event) => void upload(event.target.files)}
          />
          <AdminButton tone="primary" onClick={() => inputRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? t("uploading") : t("uploadFiles")}
          </AdminButton>
        </div>
      </div>

      {error && <AdminNotice tone="error">{error}</AdminNotice>}

      {visible.length === 0 ? (
        <AdminEmpty title={t("nothingHere")} description={t("uploadHint")} />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((asset) => {
            const kind = mediaKindOf(asset.mimeType);
            return (
              <li
                key={asset.id}
                className="group overflow-hidden rounded-card border border-line-light bg-white transition-all hover:-translate-y-0.5 hover:border-accent/40"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                  {kind === "video" ? (
                    <video src={asset.publicPath} muted playsInline preload="metadata" className="h-full w-full bg-charcoal object-cover" />
                  ) : kind === "document" ? (
                    <span className="grid h-full w-full place-items-center text-ink/30">
                      <FileText className="h-8 w-8" />
                    </span>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={asset.publicPath} alt={asset.alt} className="h-full w-full object-cover" />
                  )}
                  <span className="absolute start-2 top-2">
                    <AdminBadge tone="neutral">{kind ?? "file"}</AdminBadge>
                  </span>
                </div>

                <div className="p-3.5">
                  <p className="truncate font-display text-sm font-medium text-ink" title={asset.fileName}>
                    {asset.fileName || asset.publicPath}
                  </p>
                  <p className="mt-0.5 text-xs text-ink/45">{formatBytes(asset.byteSize)}</p>
                  <div className="mt-3 flex items-center gap-1.5">
                    <button
                      onClick={() => void copyPath(asset)}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-btn border border-line-light px-2.5 py-1.5 font-display text-xs font-medium text-ink/65 transition-colors hover:border-ink/25 hover:text-ink"
                    >
                      {copiedId === asset.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedId === asset.id ? t("copied") : t("copyPath")}
                    </button>
                    <button
                      onClick={() => void remove(asset)}
                      aria-label={t("deleteFile")}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-btn text-ink/40 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
