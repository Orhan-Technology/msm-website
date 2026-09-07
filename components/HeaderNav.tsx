"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { cn } from "@/lib/utils";

export type NavLink = { label: string; href: string };

export default function HeaderNav({
  logo,
  wordmarkPrimary,
  wordmarkAccent,
  ctaLabel,
  ctaHref,
  navLinks,
}: {
  logo: string;
  wordmarkPrimary: string;
  wordmarkAccent: string;
  ctaLabel: string;
  ctaHref: string;
  navLinks: NavLink[];
}) {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const linkCls = "text-sm font-medium text-sand/85 transition-colors hover:text-sand";

  const wordmark = (
    <>
      {wordmarkPrimary}
      <span className="text-accent"> {wordmarkAccent}</span>
    </>
  );

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
          scrolled
            ? "border-b border-line-dark bg-charcoal/95 backdrop-blur"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="container-x flex h-[72px] items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            {logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt="" loading="lazy" decoding="async" className="h-9 w-9" />
            )}
            <span className="font-display text-lg font-semibold tracking-tight text-sand">{wordmark}</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkCls}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2.5">
            <LanguageSwitcher className="hidden sm:block" />
            {ctaLabel && (
              <Link
                href={ctaHref || "/contact"}
                className="sheen-btn hidden rounded-btn bg-accent px-5 py-2.5 font-display text-sm font-medium text-white transition-colors hover:bg-accent-hover sm:inline-flex"
              >
                {ctaLabel}
              </Link>
            )}
            <button
              onClick={() => setMobileOpen(true)}
              aria-label={t("openMenu")}
              className="grid h-10 w-10 place-items-center text-sand lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-charcoal text-sand lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="container-x flex h-[72px] items-center justify-between">
              <span className="font-display text-lg font-semibold">{wordmark}</span>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label={t("closeMenu")}
                className="grid h-10 w-10 place-items-center"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="container-x flex flex-1 flex-col gap-1 overflow-y-auto py-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="border-b border-line-dark py-4 font-display text-2xl font-semibold"
                >
                  {link.label}
                </Link>
              ))}
              {ctaLabel && (
                <Link
                  href={ctaHref || "/contact"}
                  onClick={() => setMobileOpen(false)}
                  className="sheen-btn mt-6 rounded-btn bg-accent px-5 py-3.5 text-center font-display font-medium text-white"
                >
                  {ctaLabel}
                </Link>
              )}
              <div className="mt-6">
                <LanguageSwitcher />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
