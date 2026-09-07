"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowLeft, Check, ExternalLink, Loader2, RotateCcw, Save } from "lucide-react";
import { FieldControl } from "@/components/admin/field-control";
import LocaleTabs from "@/components/admin/locale-tabs";
import { AdminButton, AdminCard, AdminNotice, AdminPageHeader } from "@/components/admin/ui";
import type { Field } from "@/lib/cms/types";
import { defaultLocale, localeMeta, type Locale } from "@/lib/i18n/locales";

type Payload = Record<string, unknown>;
type Source = "default" | "english" | "translated";

export default function SectionEditor({
  sectionKey,
  label,
  description,
  fields,
  initialPayload,
  initialSource,
  initialTranslatedLocales,
  previewPath,
  backHref,
  backLabel,
}: {
  sectionKey: string;
  label: string;
  description: string;
  fields: Field[];
  initialPayload: Payload;
  initialSource: Source;
  initialTranslatedLocales: string[];
  previewPath: string;
  backHref: string;
  backLabel: string;
}) {
  const t = useTranslations("admin.content");
  const tLocale = useTranslations("admin.locale");

  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [payload, setPayload] = useState<Payload>(initialPayload);
  const [savedPayload, setSavedPayload] = useState<Payload>(initialPayload);
  const [source, setSource] = useState<Source>(initialSource);
  const [translated, setTranslated] = useState<string[]>(initialTranslatedLocales);
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const dirty = useMemo(
    () => JSON.stringify(payload) !== JSON.stringify(savedPayload),
    [payload, savedPayload],
  );

  // Warn before losing unsaved edits.
  useEffect(() => {
    if (!dirty) return;
    function onBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  /** Switching language loads that language's stored text, layered on English. */
  const switchLocale = useCallback(
    async (next: Locale) => {
      if (next === locale) return;
      if (dirty && !window.confirm(t("unsaved"))) return;
      setStatus("loading");
      setMessage(null);
      try {
        const response = await fetch(
          `/api/admin/content?key=${encodeURIComponent(sectionKey)}&locale=${next}`,
        );
        const data = (await response.json()) as {
          ok: boolean;
          payload?: Payload;
          source?: Source;
          hasTranslation?: boolean;
        };
        if (!data.ok || !data.payload) {
          setStatus("error");
          setMessage(t("errorNetwork"));
          return;
        }
        setLocale(next);
        setPayload(data.payload);
        setSavedPayload(data.payload);
        setSource(data.source ?? "default");
        setStatus("idle");
      } catch {
        setStatus("error");
        setMessage(t("errorNetwork"));
      }
    },
    [dirty, locale, sectionKey, t],
  );

  const save = useCallback(async () => {
    setStatus("saving");
    setMessage(null);
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: sectionKey, locale, payload }),
      });
      const data = (await response.json()) as {
        ok: boolean;
        message?: string;
        payload?: Payload;
        source?: Source;
      };
      if (!data.ok) {
        setStatus("error");
        setMessage(data.message ?? t("errorSave"));
        return;
      }
      setSavedPayload(data.payload ?? payload);
      setPayload(data.payload ?? payload);
      setSource(data.source ?? "translated");
      setTranslated((current) => (current.includes(locale) ? current : [...current, locale]));
      setStatus("saved");
      setMessage(t("savedMessage"));
    } catch {
      setStatus("error");
      setMessage(t("errorNetwork"));
    }
  }, [locale, payload, sectionKey, t]);

  // Ctrl/Cmd+S saves.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        if (dirty) void save();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dirty, save]);

  async function resetSection() {
    setStatus("saving");
    setMessage(null);
    const response = await fetch(
      `/api/admin/content?key=${encodeURIComponent(sectionKey)}&locale=${locale}`,
      { method: "DELETE" },
    );
    const data = (await response.json()) as { ok: boolean; payload?: Payload; source?: Source };
    if (data.ok && data.payload) {
      setPayload(data.payload);
      setSavedPayload(data.payload);
      setSource(data.source ?? "default");
      setTranslated((current) => current.filter((item) => item !== locale));
      setStatus("saved");
      setMessage(t("resetMessage"));
    } else {
      setStatus("error");
      setMessage(t("errorReset"));
    }
  }

  const busy = status === "saving" || status === "loading";
  const isTranslation = locale !== defaultLocale;
  const hasOwnText = locale === defaultLocale || translated.includes(locale);
  const previewHref = locale === defaultLocale ? previewPath : `/${locale}${previewPath === "/" ? "" : previewPath}`;

  return (
    <div className="space-y-6">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 font-display text-sm font-medium text-ink/50 transition-colors hover:text-accent"
      >
        <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" />
        {backLabel}
      </Link>

      <AdminPageHeader
        eyebrow={source === "default" ? t("originalContent") : t("eyebrow")}
        title={label}
        description={description}
        actions={
          <>
            <a href={previewHref} target="_blank" rel="noopener noreferrer">
              <AdminButton>
                <ExternalLink className="h-4 w-4" />
                {t("view")}
              </AdminButton>
            </a>
            {hasOwnText && source !== "default" && (
              <AdminButton tone="danger" onClick={() => void resetSection()} disabled={busy}>
                <RotateCcw className="h-4 w-4" />
                {t("reset")}
              </AdminButton>
            )}
            <AdminButton tone="primary" onClick={() => void save()} disabled={!dirty || busy}>
              {status === "saving" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : status === "saved" && !dirty ? (
                <Check className="h-4 w-4" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {status === "saving" ? t("saving") : dirty ? t("save") : t("saved")}
            </AdminButton>
          </>
        }
      />

      <LocaleTabs active={locale} onChange={(next) => void switchLocale(next)} translated={translated} disabled={busy} />

      {isTranslation && !hasOwnText && <AdminNotice>{tLocale("notTranslated")}</AdminNotice>}
      {message && <AdminNotice tone={status === "error" ? "error" : "success"}>{message}</AdminNotice>}

      <AdminCard className="p-6 md:p-8">
        {status === "loading" ? (
          <div className="grid place-items-center py-16 text-ink/40">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div
            className="grid gap-6 md:grid-cols-2"
            dir={localeMeta[locale].dir}
            lang={localeMeta[locale].hrefLang}
          >
            {fields.map((field) => (
              <div key={field.key} className={field.wide || field.type === "list" ? "md:col-span-2" : ""}>
                <FieldControl
                  field={field}
                  value={payload[field.key]}
                  onChange={(next) => setPayload((current) => ({ ...current, [field.key]: next }))}
                />
              </div>
            ))}
          </div>
        )}
      </AdminCard>

      {/* Sticky save bar so long sections never need a scroll back to the top. */}
      {dirty && (
        <div className="sticky bottom-4 z-20 flex items-center justify-between gap-4 rounded-card border border-line-light bg-charcoal px-5 py-3.5 text-sand shadow-[0_20px_40px_-24px_rgba(0,0,0,0.6)]">
          <p className="font-display text-sm font-medium">
            {t("unsaved")} · <span dir={localeMeta[locale].dir}>{localeMeta[locale].nativeName}</span>
          </p>
          <AdminButton tone="primary" onClick={() => void save()} disabled={busy}>
            {status === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {status === "saving" ? t("saving") : t("save")}
          </AdminButton>
        </div>
      )}
    </div>
  );
}
