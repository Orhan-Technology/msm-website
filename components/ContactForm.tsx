"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Tone = "light" | "dark";

const field =
  "h-12 w-full rounded-btn border px-4 text-sm focus:outline-none transition-colors";
const tones: Record<Tone, string> = {
  light:
    "border-line-light bg-white text-ink placeholder:text-mist focus:border-accent",
  dark: "border-line-dark bg-elevated text-sand placeholder:text-mist focus:border-accent",
};

export default function ContactForm({ tone = "light" }: { tone?: Tone }) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name || !okEmail) {
      setStatus("error");
      return;
    }
    // mock submit — wire to a real handler (Resend / API route) later
    setStatus("success");
    e.currentTarget.reset();
  }

  if (status === "success") {
    return (
      <div
        className={cn(
          "rounded-card border p-8 text-center",
          tone === "dark"
            ? "border-line-dark bg-elevated text-sand"
            : "border-line-light bg-white text-ink",
        )}
      >
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent text-white">
          ✓
        </div>
        <h3 className="mt-4">Thank you!</h3>
        <p className={cn("mt-2", tone === "dark" ? "text-mist" : "text-ink/60")}>
          We&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" placeholder="Full name" aria-label="Full name" className={cn(field, tones[tone])} />
        <input name="email" type="email" placeholder="Email address" aria-label="Email address" className={cn(field, tones[tone])} />
        <input name="phone" placeholder="Phone" aria-label="Phone" className={cn(field, tones[tone])} />
        <input name="subject" placeholder="Subject" aria-label="Subject" className={cn(field, tones[tone])} />
      </div>
      <textarea
        name="message"
        rows={5}
        placeholder="Tell us about your project — sizes, quantities, delivery province…"
        aria-label="Message"
        className={cn(
          "w-full rounded-btn border px-4 py-3 text-sm focus:outline-none transition-colors",
          tones[tone],
        )}
      />
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="sheen-btn rounded-btn bg-accent px-7 py-3.5 font-display text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          Send message
        </button>
        {status === "error" && (
          <span className="text-sm text-accent">
            Oops! Please add your name and a valid email.
          </span>
        )}
      </div>
    </form>
  );
}
