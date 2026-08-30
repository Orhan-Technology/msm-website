import { Link } from "@/i18n/navigation";
import Icon from "@/components/Icon";
import NewsletterForm from "@/components/NewsletterForm";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Ltr from "@/components/Ltr";
import { getBrand, getCompany, getFooterContent } from "@/lib/cms/site-data";

const linePattern =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M0 40L40 0M-10 10L10 -10M30 50L50 30' stroke='%23ffffff' stroke-width='1'/%3E%3C/svg%3E\")";

export default async function Footer() {
  const [company, brand, footer] = await Promise.all([getCompany(), getBrand(), getFooterContent()]);

  const copyright = (footer.copyright || "© {year} {company}. All rights reserved.")
    .replace("{year}", String(new Date().getFullYear()))
    .replace("{company}", company.name);

  return (
    <footer className="relative overflow-hidden bg-charcoal text-sand">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 opacity-[0.04]"
        style={{ backgroundImage: linePattern }}
      />

      <div className="container-x relative">
        {/* Top band */}
        <div className="grid gap-8 border-b border-line-dark py-14 lg:grid-cols-2 lg:items-center">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              {brand.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={brand.logo} alt="" loading="lazy" decoding="async" className="h-10 w-10" />
              )}
              <span className="font-display text-xl font-semibold tracking-tight">
                {brand.wordmarkPrimary}
                <span className="text-accent"> {brand.wordmarkAccent}</span>
              </span>
            </Link>
            <p className="mt-5 max-w-2xl font-display text-3xl font-semibold leading-tight text-sand md:text-4xl lg:text-5xl">
              {company.tagline}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            {footer.primaryCtaLabel && (
              <Link
                href={footer.primaryCtaHref || "/contact"}
                className="sheen-btn inline-flex items-center gap-2 rounded-btn bg-accent px-7 py-4 font-display text-sm font-medium text-white transition-colors hover:bg-accent-hover"
              >
                {footer.primaryCtaLabel}
              </Link>
            )}
            {footer.secondaryCtaLabel && (
              <Link
                href={footer.secondaryCtaHref || "/about"}
                className="sheen-btn inline-flex items-center gap-2 rounded-btn border border-sand/25 px-7 py-4 font-display text-sm font-medium text-sand transition-colors hover:bg-sand hover:text-ink"
              >
                {footer.secondaryCtaLabel}
              </Link>
            )}
          </div>
        </div>

        {/* Columns */}
        <div className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="max-w-sm text-sm leading-relaxed text-mist">{company.description}</p>
            <div className="mt-6 space-y-2 text-sm text-mist">
              <a href={`mailto:${company.email}`} className="flex items-center gap-2 hover:text-sand">
                <Icon name="Mail" className="h-4 w-4 text-accent" />
                <Ltr>{company.email}</Ltr>
              </a>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-sand">
                  <Icon name="Phone" className="h-4 w-4 text-accent" />
                  <Ltr>{company.phone}</Ltr>
                </a>
                {company.phoneAlt && (
                  <a href={`tel:${company.phoneAlt.replace(/\s/g, "")}`} className="hover:text-sand">
                    <Ltr>{company.phoneAlt}</Ltr>
                  </a>
                )}
              </div>
              <p className="flex items-start gap-2">
                <Icon name="MapPin" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {company.address}
              </p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <p className="eyebrow mb-4">{footer.exploreTitle}</p>
            <ul className="space-y-2.5">
              {(brand.navLinks ?? []).map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-mist transition-colors hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <p className="eyebrow mb-4">{footer.newsletterTitle}</p>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-line-dark py-6 sm:flex-row">
          <p className="text-sm text-mist">{copyright}</p>
          <div className="flex flex-wrap items-center gap-2">
            <LanguageSwitcher dropUp />
            {(company.socials ?? []).map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
                className="sheen-btn grid h-10 w-10 place-items-center rounded-btn border border-line-dark text-mist transition-colors hover:border-accent hover:text-accent"
              >
                <Icon name={social.icon} className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
