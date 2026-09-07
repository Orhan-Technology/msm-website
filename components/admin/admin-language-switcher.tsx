"use client";

import { useEffect, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Globe, Loader2 } from "lucide-react";
import { localeList, type Locale } from "@/lib/i18n/locales";
import { cn } from "@/lib/utils";

/**
 * The admin panel is not locale-prefixed, so the working language is stored in
 * a cookie and the page re-rendered.
 */
export default function AdminLanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const t = useTranslations("language");
  const [pending, startTransition] = useTransition();
  const [target, setTarget] = useState<Locale | null>(null);

  // The cookie write and the re-render both have to finish before the panel is
  // actually in the new language, so they run inside one transition — otherwise
  // the spinner clears while the old language is still on screen and the switch
  // looks like it did nothing.
  function choose(next: Locale) {
    if (next === locale || pending) return;
    setTarget(next);
    startTransition(async () => {
      await fetch("/api/admin/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: next }),
      });
      router.refresh();
    });
  }

  // The new locale has landed; drop the pending highlight.
  useEffect(() => {
    setTarget(null);
  }, [locale]);

  return (
    <div className="px-3 py-3">
      <p className="mb-2 inline-flex items-center gap-1.5 px-1 font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-mist/60">
        <Globe className="h-3.5 w-3.5" />
        {t("label")}
      </p>
      <div className="flex gap-1">
        {localeList.map((item) => {
          const active = item.code === locale;
          const loading = target === item.code;
          return (
            <button
              key={item.code}
              type="button"
              onClick={() => choose(item.code)}
              disabled={pending}
              dir={item.dir}
              aria-current={active ? "true" : undefined}
              className={cn(
                "inline-flex flex-1 items-center justify-center gap-1.5 rounded-btn px-2 py-2 font-display text-xs font-medium transition-colors",
                active || loading
                  ? "bg-accent text-white"
                  : "text-sand/60 hover:bg-white/[0.06] hover:text-sand",
                pending && !loading && "opacity-50",
              )}
            >
              {loading && <Loader2 className="h-3 w-3 animate-spin" />}
              {item.nativeName}
            </button>
          );
        })}
      </div>
    </div>
  );
}
