"use client";

import { cn } from "@/lib/utils";

/* Small building blocks shared by every admin screen, in the MSM brand palette. */

export function AdminCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-card border border-line-light bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]", className)}>
      {children}
    </div>
  );
}

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line-light pb-6">
      <div className="min-w-0">
        {eyebrow && (
          <span className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-accent">{eyebrow}</span>
        )}
        <h1 className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/60">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

type ButtonTone = "primary" | "secondary" | "ghost" | "danger";

const buttonTones: Record<ButtonTone, string> = {
  primary: "bg-accent text-white hover:bg-accent-hover disabled:hover:bg-accent",
  secondary: "border border-line-light bg-white text-ink hover:border-ink/25 hover:bg-sand",
  ghost: "text-ink/60 hover:bg-sand hover:text-ink",
  danger: "border border-red-200 bg-white text-red-600 hover:border-red-300 hover:bg-red-50",
};

export function AdminButton({
  tone = "secondary",
  type = "button",
  className,
  disabled,
  onClick,
  children,
}: {
  tone?: ButtonTone;
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-btn px-4 py-2.5 font-display text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        buttonTones[tone],
        className,
      )}
    >
      {children}
    </button>
  );
}

/**
 * Label only — hint text is rendered *below* the control by `AdminHelp`, so that
 * two fields sitting side by side always have their inputs on the same line
 * whether or not one of them has a hint.
 */
export function AdminLabel({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block font-display text-sm font-medium leading-5 text-ink">
      {children}
    </label>
  );
}

export function AdminHelp({ children }: { children?: string }) {
  if (!children) return null;
  return <p className="mt-1.5 text-xs leading-relaxed text-ink/45">{children}</p>;
}

const fieldBase =
  "w-full rounded-btn border border-line-light bg-white px-3.5 py-2.5 text-sm text-ink transition-colors placeholder:text-ink/35 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";

export function AdminInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(fieldBase, props.className)} />;
}

export function AdminTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(fieldBase, "min-h-[110px] resize-y leading-relaxed", props.className)} />;
}

export function AdminSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(fieldBase, "pr-8", props.className)} />;
}

export function AdminToggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-3 text-sm text-ink"
    >
      <span
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-accent" : "bg-ink/15",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
            checked ? "left-[22px]" : "left-0.5",
          )}
        />
      </span>
      <span className="font-display font-medium">{label}</span>
    </button>
  );
}

export function AdminBadge({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "accent" | "success" | "muted";
  children: React.ReactNode;
}) {
  const tones = {
    neutral: "bg-ink/[0.06] text-ink/70",
    accent: "bg-accent/10 text-accent",
    success: "bg-emerald-50 text-emerald-700",
    muted: "bg-ink/[0.04] text-ink/45",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 font-display text-[11px] font-semibold uppercase tracking-wide",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

export function AdminEmpty({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-card border border-dashed border-line-light bg-white/60 px-6 py-14 text-center">
      <p className="font-display text-base font-semibold text-ink">{title}</p>
      {description && <p className="mx-auto mt-1.5 max-w-md text-sm text-ink/55">{description}</p>}
    </div>
  );
}

export function AdminNotice({
  tone = "info",
  children,
}: {
  tone?: "info" | "error" | "success";
  children: React.ReactNode;
}) {
  const tones = {
    info: "border-line-light bg-sand text-ink/75",
    error: "border-red-200 bg-red-50 text-red-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  } as const;
  return <div className={cn("rounded-btn border px-4 py-3 text-sm", tones[tone])}>{children}</div>;
}
