import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { company } from "@/lib/company";
import { cn } from "@/lib/utils";

const items = [
  { icon: Mail, label: "Email", value: company.email, href: `mailto:${company.email}` },
  { icon: Phone, label: "Phone", value: company.phone, href: `tel:${company.phone.replace(/\s/g, "")}` },
  { icon: MapPin, label: "Address", value: company.address, href: company.mapLink },
  { icon: Clock, label: "Hours", value: "Sat–Thu · 08:00–17:00", href: undefined },
];

type Props = {
  layout?: "stack" | "cards";
  tone?: "light" | "dark";
  className?: string;
};

export default function ContactDetails({
  layout = "stack",
  tone = "light",
  className,
}: Props) {
  const muted = tone === "dark" ? "text-mist" : "text-ink/55";
  const value = tone === "dark" ? "text-sand" : "text-ink";
  const border = tone === "dark" ? "border-line-dark" : "border-line-light";
  const surface = tone === "dark" ? "bg-elevated" : "bg-white";

  if (layout === "cards") {
    return (
      <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
        {items.map((it) => (
          <div
            key={it.label}
            className={cn("rounded-card border p-6 text-center", border, surface)}
          >
            <span className="mx-auto grid h-11 w-11 place-items-center rounded-btn bg-accent text-white">
              <it.icon className="h-5 w-5" />
            </span>
            <p className={cn("mt-4 text-xs uppercase tracking-wide", muted)}>
              {it.label}
            </p>
            {it.href ? (
              <a href={it.href} className={cn("mt-1 block font-display font-medium", value)}>
                {it.value}
              </a>
            ) : (
              <p className={cn("mt-1 font-display font-medium", value)}>{it.value}</p>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-5", className)}>
      {items.map((it) => (
        <div key={it.label} className="flex items-start gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-btn bg-accent text-white">
            <it.icon className="h-5 w-5" />
          </span>
          <div>
            <p className={cn("text-xs uppercase tracking-wide", muted)}>{it.label}</p>
            {it.href ? (
              <a href={it.href} className={cn("mt-0.5 block font-display font-medium", value)}>
                {it.value}
              </a>
            ) : (
              <p className={cn("mt-0.5 font-display font-medium", value)}>{it.value}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
