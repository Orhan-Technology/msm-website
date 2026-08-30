"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "light" | "dark";
type Status = "idle" | "pending" | "success" | "error";

const field = "h-12 w-full rounded-btn border px-4 text-sm transition-colors focus:outline-none";
const tones: Record<Tone, string> = {
  light: "border-line-light bg-white text-ink placeholder:text-mist focus:border-accent",
  dark: "border-line-dark bg-elevated text-sand placeholder:text-mist focus:border-accent",
};

export default function ContactForm({
  tone = "light",
  submitLabel,
  successMessage,
  locale,
}: {
  tone?: Tone;
  submitLabel?: string;
  successMessage?: string;
  /** Recorded with the enquiry so staff know which language to reply in. */
  locale?: string;
}) {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();

    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setError(t("errorNameEmail"));
      return;
    }

    setStatus("pending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "contact",
          name,
          email,
          phone: String(data.get("phone") || ""),
          company: String(data.get("company") || ""),
          subject: String(data.get("subject") || ""),
          message: String(data.get("message") || ""),
          website: String(data.get("website") || ""),
          locale,
        }),
      });
      const result = (await response.json()) as { ok: boolean; message?: string };
      if (!result.ok) {
        setStatus("error");
        setError(result.message ?? t("errorServer"));
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setError(t("errorServer"));
    }
  }

  if (status === "success") {
    return (
      <div
        className={cn(
          "rounded-card border p-8 text-center",
          tone === "dark" ? "border-line-dark bg-elevated text-sand" : "border-line-light bg-white text-ink",
        )}
      >
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent text-white">✓</div>
        <h3 className="mt-4">{t("thankYou")}</h3>
        <p className={cn("mt-2", tone === "dark" ? "text-mist" : "text-ink/60")}>{successMessage || t("thankYou")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" placeholder={t("fullName")} aria-label={t("fullName")} className={cn(field, tones[tone])} />
        <input
          name="email"
          type="email"
          placeholder={t("email")}
          aria-label={t("email")}
          className={cn(field, tones[tone])}
        />
        <input name="phone" placeholder={t("phone")} aria-label={t("phone")} className={cn(field, tones[tone])} />
        <input name="subject" placeholder={t("subject")} aria-label={t("subject")} className={cn(field, tones[tone])} />
      </div>
      <textarea
        name="message"
        rows={5}
        placeholder={t("messagePlaceholder")}
        aria-label={t("message")}
        className={cn("w-full rounded-btn border px-4 py-3 text-sm transition-colors focus:outline-none", tones[tone])}
      />
      {/* Honeypot — hidden from people, catches simple bots. */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "pending"}
          className="sheen-btn inline-flex items-center gap-2 rounded-btn bg-accent px-7 py-3.5 font-display text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-70"
        >
          {status === "pending" && <Loader2 className="h-4 w-4 animate-spin" />}
          {status === "pending" ? t("sending") : (submitLabel || t("send"))}
        </button>
        {status === "error" && <span className="text-sm text-accent">{error}</span>}
      </div>
    </form>
  );
}
