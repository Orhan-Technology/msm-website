"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, Globe, Loader2 } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { localeList, type Locale } from "@/lib/i18n/locales";
import { cn } from "@/lib/utils";

/**
 * Switches language while staying on the same page — next-intl rewrites the
 * path for the target locale (`/about` → `/fa/about`).
 */
export default function LanguageSwitcher({
  tone = "dark",
  dropUp = false,
  className,
}: {
  /** "dark" sits on the charcoal header, "light" on a pale surface. */
  tone?: "dark" | "light";
  dropUp?: boolean;
  className?: string;
}) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("language");
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  const current = localeList.find((item) => item.code === locale) ?? localeList[0];

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function choose(next: Locale) {
    setOpen(false);
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  const dark = tone === "dark";

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        aria-label={t("label")}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "inline-flex h-10 items-center gap-1.5 rounded-btn px-3 font-display text-sm font-medium transition-colors",
          dark
            ? "border border-sand/20 text-sand/85 hover:border-sand/40 hover:text-sand"
            : "border border-line-light bg-white text-ink/70 hover:border-ink/25 hover:text-ink",
        )}
      >
        {pending ? <Loader2 className="h-4 w-4 shrink-0 animate-spin" /> : <Globe className="h-4 w-4 shrink-0" />}
        <span>{current.nativeName}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 shrink-0 opacity-70 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <ul
          role="listbox"
          className={cn(
            "absolute end-0 z-[400] min-w-[10rem] overflow-hidden rounded-card border py-1 shadow-xl",
            dropUp ? "bottom-full mb-2" : "top-full mt-2",
            dark ? "border-line-dark bg-elevated" : "border-line-light bg-white",
          )}
        >
          {localeList.map((item) => (
            <li key={item.code} role="option" aria-selected={item.code === locale}>
              <button
                type="button"
                onClick={() => choose(item.code)}
                dir={item.dir}
                className={cn(
                  "flex w-full items-center justify-between gap-3 px-4 py-2.5 text-start text-sm transition-colors",
                  dark ? "hover:bg-white/[0.06]" : "hover:bg-sand",
                  item.code === locale
                    ? dark
                      ? "font-semibold text-sand"
                      : "font-semibold text-ink"
                    : dark
                      ? "text-mist"
                      : "text-ink/65",
                )}
              >
                <span>{item.nativeName}</span>
                {item.code === locale && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
