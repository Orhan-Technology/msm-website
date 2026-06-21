import Link from "next/link";
import { company } from "@/lib/company";
import Icon from "@/components/Icon";
import NewsletterForm from "@/components/NewsletterForm";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const linePattern =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M0 40L40 0M-10 10L10 -10M30 50L50 30' stroke='%23ffffff' stroke-width='1'/%3E%3C/svg%3E\")";

export default function Footer() {
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo.png" alt="" loading="lazy" decoding="async" className="h-10 w-10" />
              <span className="font-display text-xl font-semibold tracking-tight">
                Maisam<span className="text-accent"> Steel</span>
              </span>
            </Link>
            <p className="mt-5 max-w-2xl font-display text-3xl font-semibold leading-tight text-sand md:text-4xl lg:text-5xl">
              {company.tagline}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link
              href="/contact"
              className="sheen-btn inline-flex items-center gap-2 rounded-btn bg-accent px-7 py-4 font-display text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Get a quote
            </Link>
            <Link
              href="/about"
              className="sheen-btn inline-flex items-center gap-2 rounded-btn border border-sand/25 px-7 py-4 font-display text-sm font-medium text-sand transition-colors hover:bg-sand hover:text-ink"
            >
              Learn more
            </Link>
          </div>
        </div>

        {/* Columns */}
        <div className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="max-w-sm text-sm leading-relaxed text-mist">
              {company.description}
            </p>
            <div className="mt-6 space-y-2 text-sm text-mist">
              <a
                href={`mailto:${company.email}`}
                className="flex items-center gap-2 hover:text-sand"
              >
                <Icon name="Mail" className="h-4 w-4 text-accent" />
                {company.email}
              </a>
              <a
                href={`tel:${company.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 hover:text-sand"
              >
                <Icon name="Phone" className="h-4 w-4 text-accent" />
                {company.phone}
              </a>
              <p className="flex items-start gap-2">
                <Icon name="MapPin" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {company.address}
              </p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <p className="eyebrow mb-4">Explore</p>
            <ul className="space-y-2.5">
              {navLinks.map((p) => (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    className="text-sm text-mist transition-colors hover:text-accent"
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <p className="eyebrow mb-4">Stay tuned for more news</p>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-line-dark py-6 sm:flex-row">
          <p className="text-sm text-mist">
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <div className="flex gap-2">
            {company.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
                className="sheen-btn grid h-10 w-10 place-items-center rounded-btn border border-line-dark text-mist transition-colors hover:border-accent hover:text-accent"
              >
                <Icon name={s.icon} className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
