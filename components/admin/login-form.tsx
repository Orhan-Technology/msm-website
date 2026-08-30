"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2, LogIn } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const t = useTranslations("admin.login");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json()) as { ok: boolean; message?: string };
      if (!data.ok) {
        setError(data.message ?? t("failed"));
        setPending(false);
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError(t("unreachable"));
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="admin-password" className="mb-1.5 block font-display text-sm font-medium text-sand">
          {t("password")}
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-btn border border-line-dark bg-charcoal px-3.5 py-3 text-sm text-sand transition-colors placeholder:text-mist/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
          placeholder={t("passwordPlaceholder")}
          required
        />
      </div>

      {error && (
        <p role="alert" className="rounded-btn border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || !password}
        className="sheen-btn inline-flex w-full items-center justify-center gap-2 rounded-btn bg-accent px-5 py-3.5 font-display text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
        {pending ? t("signingIn") : t("signIn")}
      </button>
    </form>
  );
}
