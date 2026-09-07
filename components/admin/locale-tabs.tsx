"use client";

import { useTranslations } from "next-intl";
import { Check, Languages } from "lucide-react";
import { localeList, type Locale } from "@/lib/i18n/locales";
import { cn } from "@/lib/utils";

/**
 * The language strip that sits above every translatable editor. A dot marks the
 * languages that already have their own text; the rest fall back to English.
 */
export default function LocaleTabs({
  active,
  onChange,
  translated,
  disabled,
}: {
  active: Locale;
  onChange: (locale: Locale) => void;
  /** Which languages already have stored content. */
  translated: string[];
  disabled?: boolean;
}) {
  const t = useTranslations("admin.locale");

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1.5 pe-1 text-xs font-medium text-ink/45">
        <Languages className="h-4 w-4" />
        {t("editingIn")}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {localeList.map((locale) => {
          const isActive = locale.code === active;
          const hasText = locale.code === "en" || translated.includes(locale.code);
          return (
            <button
              key={locale.code}
              type="button"
              disabled={disabled}
              onClick={() => onChange(locale.code)}
              className={cn(
                "inline-flex items-center gap-2 rounded-btn px-3.5 py-2 font-display text-sm font-medium transition-colors disabled:opacity-50",
                isActive
                  ? "bg-charcoal text-sand"
                  : "border border-line-light bg-white text-ink/65 hover:border-ink/25 hover:text-ink",
              )}
            >
              <span dir={locale.dir}>{locale.nativeName}</span>
              {hasText ? (
                <Check className={cn("h-3.5 w-3.5", isActive ? "text-accent" : "text-emerald-600")} />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-ink/20" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
