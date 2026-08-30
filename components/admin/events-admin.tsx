"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Film,
  Loader2,
  MapPin,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import MediaPicker from "@/components/admin/media-picker";
import LocaleTabs from "@/components/admin/locale-tabs";
import {
  AdminBadge,
  AdminButton,
  AdminCard,
  AdminEmpty,
  AdminHelp,
  AdminInput,
  AdminLabel,
  AdminNotice,
  AdminTextarea,
  AdminToggle,
} from "@/components/admin/ui";
import { defaultLocale, localeMeta, locales, type Locale } from "@/lib/i18n/locales";

export type EventText = {
  title: string;
  category: string;
  location: string;
  summary: string;
  body: string;
  ctaLabel: string;
};

export type AdminEvent = {
  id: string;
  slug: string;
  startDate: string;
  endDate: string;
  imagePath: string;
  videoPath: string;
  gallery: string[];
  ctaHref: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  createdAt: number;
  updatedAt: number;
  translations: Record<Locale, EventText>;
};

type Draft = {
  slug: string;
  startDate: string;
  endDate: string;
  imagePath: string;
  videoPath: string;
  gallery: string[];
  ctaHref: string;
  featured: boolean;
  published: boolean;
  translations: Record<Locale, EventText>;
};

const emptyText: EventText = { title: "", category: "", location: "", summary: "", body: "", ctaLabel: "" };

function blankTranslations(): Record<Locale, EventText> {
  return locales.reduce(
    (acc, locale) => ({ ...acc, [locale]: { ...emptyText } }),
    {} as Record<Locale, EventText>,
  );
}

const emptyDraft: Draft = {
  slug: "",
  startDate: "",
  endDate: "",
  imagePath: "",
  videoPath: "",
  gallery: [],
  ctaHref: "",
  featured: false,
  published: true,
  translations: blankTranslations(),
};

/** Copy just the editable fields; id, order and timestamps stay server-managed. */
function toDraft(event: AdminEvent): Draft {
  return {
    slug: event.slug,
    startDate: event.startDate,
    endDate: event.endDate,
    imagePath: event.imagePath,
    videoPath: event.videoPath,
    gallery: event.gallery,
    ctaHref: event.ctaHref,
    featured: event.featured,
    published: event.published,
    translations: locales.reduce(
      (acc, locale) => ({ ...acc, [locale]: { ...emptyText, ...event.translations[locale] } }),
      {} as Record<Locale, EventText>,
    ),
  };
}

/** Which languages this event already has its own words in. */
function translatedLocales(event: AdminEvent | Draft): string[] {
  return locales.filter((locale) => (event.translations[locale]?.title ?? "").trim().length > 0);
}

function formatDate(value: string) {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function EventsAdmin({ initialEvents }: { initialEvents: AdminEvent[] }) {
  const t = useTranslations("admin.events");
  const tMove = useTranslations("admin.fields");
  const [events, setEvents] = useState(initialEvents);
  const [editing, setEditing] = useState<{ id: string | null; draft: Draft } | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null);

  const publishedCount = useMemo(() => events.filter((event) => event.published).length, [events]);

  async function refresh() {
    const response = await fetch("/api/admin/events");
    const data = (await response.json()) as { ok: boolean; events?: AdminEvent[] };
    if (data.events) setEvents(data.events);
  }

  async function save() {
    if (!editing) return;
    if (!editing.draft.translations[defaultLocale].title.trim()) {
      setMessage({ tone: "error", text: t("titleRequired") });
      return;
    }
    setBusy(true);
    setMessage(null);
    const isNew = editing.id === null;
    const response = await fetch(isNew ? "/api/admin/events" : `/api/admin/events/${editing.id}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing.draft),
    });
    const data = (await response.json()) as { ok: boolean; message?: string };
    setBusy(false);
    if (!data.ok) {
      setMessage({ tone: "error", text: data.message ?? t("saveError") });
      return;
    }
    setEditing(null);
    setMessage({ tone: "success", text: isNew ? t("created") : t("updated") });
    await refresh();
  }

  async function remove(id: string, title: string) {
    if (!window.confirm(t("confirmDelete", { title }))) return;
    setBusy(true);
    await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    setBusy(false);
    setMessage({ tone: "success", text: t("deleted") });
    await refresh();
  }

  async function togglePublished(event: AdminEvent) {
    setBusy(true);
    await fetch(`/api/admin/events/${event.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...toDraft(event), published: !event.published }),
    });
    setBusy(false);
    await refresh();
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= events.length) return;
    const next = [...events];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    setEvents(next);
    await fetch("/api/admin/events", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: next.map((event) => event.id) }),
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink/55">{t("summary", { total: events.length, published: publishedCount })}</p>
        <AdminButton tone="primary" onClick={() => setEditing({ id: null, draft: { ...emptyDraft, translations: blankTranslations() } })}>
          <Plus className="h-4 w-4" />
          {t("newEvent")}
        </AdminButton>
      </div>

      {message && <AdminNotice tone={message.tone}>{message.text}</AdminNotice>}

      {events.length === 0 ? (
        <AdminEmpty title={t("noEvents")} description={t("noEventsHint")} />
      ) : (
        <div className="space-y-3">
          {events.map((event, index) => {
            const english = event.translations[defaultLocale] ?? emptyText;
            const done = translatedLocales(event);
            return (
              <AdminCard key={event.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="h-24 w-full shrink-0 overflow-hidden rounded-btn bg-sand sm:w-36">
                  {event.videoPath ? (
                    <video src={event.videoPath} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                  ) : event.imagePath ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={event.imagePath} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="grid h-full w-full place-items-center text-ink/25">
                      <CalendarDays className="h-6 w-6" />
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-base font-semibold text-ink">{english.title}</h3>
                    {event.featured && <AdminBadge tone="accent">{t("featured")}</AdminBadge>}
                    {event.published ? (
                      <AdminBadge tone="success">{t("published")}</AdminBadge>
                    ) : (
                      <AdminBadge tone="muted">{t("draft")}</AdminBadge>
                    )}
                    {event.videoPath && (
                      <span className="inline-flex items-center gap-1 text-xs text-ink/40">
                        <Film className="h-3.5 w-3.5" /> {t("video")}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink/50">
                    {event.startDate && (
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDate(event.startDate)}
                        {event.endDate ? ` – ${formatDate(event.endDate)}` : ""}
                      </span>
                    )}
                    {english.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {english.location}
                      </span>
                    )}
                    <span className="text-ink/30">/events/{event.slug}</span>
                    <span className="inline-flex items-center gap-1">
                      {locales.map((locale) => (
                        <span
                          key={locale}
                          title={localeMeta[locale].englishName}
                          className={
                            done.includes(locale)
                              ? "rounded bg-emerald-50 px-1.5 py-0.5 font-display text-[10px] font-semibold uppercase text-emerald-700"
                              : "rounded bg-ink/[0.05] px-1.5 py-0.5 font-display text-[10px] font-semibold uppercase text-ink/30"
                          }
                        >
                          {locale}
                        </span>
                      ))}
                    </span>
                  </div>
                  {english.summary && <p className="mt-2 line-clamp-2 text-sm text-ink/60">{english.summary}</p>}
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => void move(index, -1)}
                    disabled={index === 0}
                    aria-label={tMove("moveUp")}
                    className="grid h-9 w-9 place-items-center rounded-btn text-ink/40 hover:bg-sand hover:text-ink disabled:opacity-25"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => void move(index, 1)}
                    disabled={index === events.length - 1}
                    aria-label={tMove("moveDown")}
                    className="grid h-9 w-9 place-items-center rounded-btn text-ink/40 hover:bg-sand hover:text-ink disabled:opacity-25"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <a
                    href={`/events/${event.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t("viewEvent")}
                    className="grid h-9 w-9 place-items-center rounded-btn text-ink/40 hover:bg-sand hover:text-ink"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <AdminButton onClick={() => void togglePublished(event)} disabled={busy}>
                    {event.published ? t("unpublish") : t("publish")}
                  </AdminButton>
                  <AdminButton onClick={() => setEditing({ id: event.id, draft: toDraft(event) })}>
                    {t("edit")}
                  </AdminButton>
                  <button
                    onClick={() => void remove(event.id, english.title)}
                    aria-label={t("deleteEvent")}
                    className="grid h-9 w-9 place-items-center rounded-btn text-ink/40 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </AdminCard>
            );
          })}
        </div>
      )}

      {editing && (
        <EventDialog
          draft={editing.draft}
          isNew={editing.id === null}
          busy={busy}
          onChange={(draft) => setEditing({ ...editing, draft })}
          onClose={() => setEditing(null)}
          onSave={() => void save()}
        />
      )}
    </div>
  );
}

function EventDialog({
  draft,
  isNew,
  busy,
  onChange,
  onClose,
  onSave,
}: {
  draft: Draft;
  isNew: boolean;
  busy: boolean;
  onChange: (next: Draft) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const t = useTranslations("admin.events");
  const tf = useTranslations("admin.events.fields");
  const tc = useTranslations("admin.content");
  const tLocale = useTranslations("admin.locale");
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  const text = draft.translations[locale] ?? emptyText;
  const meta = localeMeta[locale];

  /** Shared facts — the same in every language. */
  function setShared<K extends keyof Omit<Draft, "translations">>(key: K, value: Draft[K]) {
    onChange({ ...draft, [key]: value });
  }

  /** Words — stored per language. */
  function setText<K extends keyof EventText>(key: K, value: EventText[K]) {
    onChange({
      ...draft,
      translations: { ...draft.translations, [locale]: { ...text, [key]: value } },
    });
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
      <button aria-label={t("cancel")} onClick={onClose} className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" />
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-card bg-white sm:rounded-card">
        <div className="flex items-center justify-between gap-4 border-b border-line-light px-6 py-4">
          <h2 className="font-display text-lg font-semibold text-ink">{isNew ? t("newEvent") : t("editEvent")}</h2>
          <button
            onClick={onClose}
            aria-label={t("cancel")}
            className="grid h-10 w-10 place-items-center rounded-btn text-ink/45 hover:bg-sand hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Shared across every language */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <AdminLabel htmlFor="event-start">{tf("startDate")}</AdminLabel>
              <AdminInput
                id="event-start"
                type="date"
                value={draft.startDate}
                onChange={(e) => setShared("startDate", e.target.value)}
              />
            </div>
            <div>
              <AdminLabel htmlFor="event-end">{tf("endDate")}</AdminLabel>
              <AdminInput
                id="event-end"
                type="date"
                value={draft.endDate}
                onChange={(e) => setShared("endDate", e.target.value)}
              />
              <AdminHelp>{tf("endDateHelp")}</AdminHelp>
            </div>

            <div>
              <AdminLabel htmlFor="event-slug">{tf("slug")}</AdminLabel>
              <AdminInput
                id="event-slug"
                value={draft.slug}
                onChange={(e) => setShared("slug", e.target.value)}
                placeholder="kabul-construction-expo-2026"
              />
              <AdminHelp>{tf("slugHelp")}</AdminHelp>
            </div>
            <div>
              <AdminLabel htmlFor="event-cta-href">{tf("ctaHref")}</AdminLabel>
              <AdminInput
                id="event-cta-href"
                value={draft.ctaHref}
                onChange={(e) => setShared("ctaHref", e.target.value)}
                placeholder="https://…"
              />
            </div>

            <div>
              <AdminLabel>{tf("coverImage")}</AdminLabel>
              <MediaPicker value={draft.imagePath} onChange={(next) => setShared("imagePath", next)} kind="image" />
            </div>
            <div>
              <AdminLabel>{tf("video")}</AdminLabel>
              <MediaPicker value={draft.videoPath} onChange={(next) => setShared("videoPath", next)} kind="video" />
              <AdminHelp>{tf("videoHelp")}</AdminHelp>
            </div>

            <div className="md:col-span-2">
              <AdminLabel>{tf("gallery")}</AdminLabel>
              <p className="-mt-0.5 mb-2 text-xs leading-relaxed text-ink/45">{tf("galleryHelp")}</p>
              <div className="space-y-2">
                {draft.gallery.map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="flex-1">
                      <MediaPicker
                        value={item}
                        kind="image"
                        onChange={(next) => {
                          const gallery = [...draft.gallery];
                          gallery[index] = next;
                          setShared("gallery", gallery);
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShared("gallery", draft.gallery.filter((_, i) => i !== index))}
                      aria-label={tf("removePhoto")}
                      className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-btn text-ink/40 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <AdminButton onClick={() => setShared("gallery", [...draft.gallery, ""])}>
                  <Plus className="h-4 w-4" />
                  {tf("addPhoto")}
                </AdminButton>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-8 md:col-span-2">
              <AdminToggle
                checked={draft.published}
                onChange={(next) => setShared("published", next)}
                label={t("published")}
              />
              <AdminToggle
                checked={draft.featured}
                onChange={(next) => setShared("featured", next)}
                label={t("featured")}
              />
            </div>
          </div>

          {/* Per-language text */}
          <div className="mt-8 border-t border-line-light pt-6">
            <LocaleTabs active={locale} onChange={setLocale} translated={translatedLocales(draft)} />

            {locale !== defaultLocale && !draft.translations[locale]?.title.trim() && (
              <div className="mt-4">
                <AdminNotice>{tLocale("notTranslated")}</AdminNotice>
              </div>
            )}

            <div className="mt-5 grid gap-5 md:grid-cols-2" dir={meta.dir} lang={meta.hrefLang}>
              <div className="md:col-span-2">
                <AdminLabel htmlFor="event-title">{tf("title")}</AdminLabel>
                <AdminInput
                  id="event-title"
                  value={text.title}
                  onChange={(e) => setText("title", e.target.value)}
                  placeholder={tf("titlePlaceholder")}
                />
              </div>

              <div>
                <AdminLabel htmlFor="event-category">{tf("category")}</AdminLabel>
                <AdminInput
                  id="event-category"
                  value={text.category}
                  onChange={(e) => setText("category", e.target.value)}
                  placeholder={tf("categoryPlaceholder")}
                />
              </div>
              <div>
                <AdminLabel htmlFor="event-cta-label">{tf("ctaLabel")}</AdminLabel>
                <AdminInput
                  id="event-cta-label"
                  value={text.ctaLabel}
                  onChange={(e) => setText("ctaLabel", e.target.value)}
                  placeholder={tf("ctaLabelPlaceholder")}
                />
              </div>

              <div className="md:col-span-2">
                <AdminLabel htmlFor="event-location">{tf("location")}</AdminLabel>
                <AdminInput
                  id="event-location"
                  value={text.location}
                  onChange={(e) => setText("location", e.target.value)}
                  placeholder={tf("locationPlaceholder")}
                />
              </div>

              <div className="md:col-span-2">
                <AdminLabel htmlFor="event-summary">{tf("summary")}</AdminLabel>
                <AdminTextarea
                  id="event-summary"
                  value={text.summary}
                  onChange={(e) => setText("summary", e.target.value)}
                />
                <AdminHelp>{tf("summaryHelp")}</AdminHelp>
              </div>

              <div className="md:col-span-2">
                <AdminLabel htmlFor="event-body">{tf("body")}</AdminLabel>
                <AdminTextarea
                  id="event-body"
                  value={text.body}
                  onChange={(e) => setText("body", e.target.value)}
                  className="min-h-[180px]"
                />
                <AdminHelp>{tf("bodyHelp")}</AdminHelp>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-line-light px-6 py-4">
          <AdminButton onClick={onClose}>{t("cancel")}</AdminButton>
          <AdminButton tone="primary" onClick={onSave} disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {busy ? tc("saving") : isNew ? t("create") : t("saveChanges")}
          </AdminButton>
        </div>
      </div>
    </div>
  );
}
