"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "idle" | "pending" | "success" | "error";

export default function NewsletterForm() {
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
    <div>
      <form onSubmit={onSubmit} className="flex gap-2" noValidate>
        <input
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          placeholder={t("placeholder")}
          aria-label={tc("email")}
          className="h-12 w-full rounded-btn border border-line-dark bg-elevated px-4 text-sm text-sand placeholder:text-mist focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          aria-label={t("subscribe")}
          disabled={status === "pending"}
          className="sheen-btn grid h-12 w-12 shrink-0 place-items-center rounded-btn bg-accent text-white transition-colors hover:bg-accent-hover disabled:opacity-70"
        >
          {status === "pending" ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
        </button>
      </form>
      <p
        className={cn(
          "mt-2 text-sm text-accent",
          status !== "success" && status !== "error" && "invisible",
        )}
        role="status"
      >
        {status === "success" ? t("success") : status === "error" ? error : "placeholder"}
      </p>
    </div>
  );
}
