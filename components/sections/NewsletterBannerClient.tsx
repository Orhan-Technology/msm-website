"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, Mail, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "idle" | "pending" | "success" | "error";

export default function NewsletterBannerClient({
  eyebrow,
  title,
  body,
  perks,
  placeholder,
  buttonLabel,
  successMessage,
}: {
  eyebrow: string;
  title: string;
  body: string;
  perks: string[];
  placeholder: string;
  buttonLabel: string;
  successMessage: string;
}) {
  const t = useTranslations("newsletter");
  const tc = useTranslations("contact");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setError(t("invalidEmail"));
      return;
    }
    setStatus("pending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "newsletter", email }),
      });
      const data = (await response.json()) as { ok: boolean; message?: string };
      if (!data.ok) {
        setStatus("error");
        setError(data.message ?? t("error"));
        return;
      }
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setError(t("error"));
    }
  }

  return (
    <section className="section bg-sand">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-card bg-gradient-to-br from-accent via-[#d24d24] to-accent-hover px-8 py-14 text-white shadow-[0_40px_80px_-40px_rgba(226,86,43,0.6)] md:px-16 md:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "22px 22px" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-white/15 blur-3xl"
          />
          <Mail
            aria-hidden
            className="pointer-events-none absolute -bottom-10 right-6 h-52 w-52 text-white/10"
            strokeWidth={1}
          />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <span className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
                {eyebrow}
              </span>
              <h2 className="mt-3 max-w-md text-balance text-white">{title}</h2>
              <p className="mt-4 max-w-md text-white/85">{body}</p>
              {perks.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/90">
                  {perks.map((perk) => (
                    <span key={perk} className="inline-flex items-center gap-2">
                      <Check className="h-4 w-4" /> {perk}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:w-full lg:justify-self-end">
              <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Mail className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (status !== "idle") setStatus("idle");
                    }}
                    placeholder={placeholder}
                    aria-label={tc("email")}
                    className="h-14 w-full rounded-btn bg-white ps-12 pe-4 text-sm text-ink shadow-sm placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-white/70"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "pending"}
                  className="sheen-btn inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-btn bg-charcoal px-7 font-display text-sm font-medium text-white transition-colors hover:bg-ink disabled:opacity-70"
                >
                  {status === "pending" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {buttonLabel}
                  {status !== "pending" && <ArrowRight className="h-4 w-4" />}
                </button>
              </form>
              <p className="mt-3 text-sm text-white" role="status" aria-live="polite">
                <span className={cn(status !== "success" && status !== "error" && "invisible")}>
                  {status === "success" ? `✓ ${successMessage}` : status === "error" ? error : "placeholder"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
