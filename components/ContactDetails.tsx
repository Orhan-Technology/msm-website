import { getTranslations } from "next-intl/server";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import Ltr from "@/components/Ltr";
import { getCompany } from "@/lib/cms/site-data";
import { cn } from "@/lib/utils";

type Props = {
  layout?: "stack" | "cards";
  tone?: "light" | "dark";
  className?: string;
};

export default async function ContactDetails({ layout = "stack", tone = "light", className }: Props) {
  const [company, t] = await Promise.all([getCompany(), getTranslations("contact")]);

  const items = [
    {
      icon: Mail,
      label: t("labelEmail"),
      value: company.email,
      href: `mailto:${company.email}`,
      sub: company.emailAlt,
      subHref: `mailto:${company.emailAlt}`,
    },
    {
      icon: Phone,
      label: t("labelPhone"),
      value: company.phone,
      href: `tel:${company.phone.replace(/\s/g, "")}`,
      sub: company.phoneAlt,
      subHref: `tel:${company.phoneAlt.replace(/\s/g, "")}`,
    },
    { icon: MapPin, label: t("labelAddress"), value: company.address, href: company.mapLink, sub: "", subHref: "" },
    { icon: Clock, label: t("labelHours"), value: t("hoursValue"), href: undefined, sub: "", subHref: "" },
  ];

  const muted = tone === "dark" ? "text-mist" : "text-ink/55";
  const value = tone === "dark" ? "text-sand" : "text-ink";
  const border = tone === "dark" ? "border-line-dark" : "border-line-light";
  const surface = tone === "dark" ? "bg-elevated" : "bg-white";

  if (layout === "cards") {
    return (
      <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
        {items.map((item) => (
          <div key={item.label} className={cn("rounded-card border p-6 text-center", border, surface)}>
            <span className="mx-auto grid h-11 w-11 place-items-center rounded-btn bg-accent text-white">
              <item.icon className="h-5 w-5" />
            </span>
            <p className={cn("mt-4 text-xs uppercase tracking-wide", muted)}>{item.label}</p>
            {item.href ? (
              <a href={item.href} className={cn("mt-1 block font-display font-medium", value)}>
                <Ltr>{item.value}</Ltr>
              </a>
            ) : (
              <p className={cn("mt-1 font-display font-medium", value)}>{item.value}</p>
            )}
            {item.sub && (
              <a href={item.subHref} className={cn("mt-0.5 block text-sm", muted)}>
                <Ltr>{item.sub}</Ltr>
              </a>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-5", className)}>
      {items.map((item) => (
        <div key={item.label} className="flex items-start gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-btn bg-accent text-white">
            <item.icon className="h-5 w-5" />
          </span>
          <div>
            <p className={cn("text-xs uppercase tracking-wide", muted)}>{item.label}</p>
            {item.href ? (
              <a href={item.href} className={cn("mt-0.5 block font-display font-medium", value)}>
                <Ltr>{item.value}</Ltr>
              </a>
            ) : (
              <p className={cn("mt-0.5 font-display font-medium", value)}>{item.value}</p>
            )}
            {item.sub && (
              <a href={item.subHref} className={cn("mt-0.5 block text-sm", muted)}>
                <Ltr>{item.sub}</Ltr>
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
