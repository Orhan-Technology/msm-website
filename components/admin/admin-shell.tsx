"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import AdminLanguageSwitcher from "@/components/admin/admin-language-switcher";
import {
  Building2,
  CalendarDays,
  ExternalLink,
  Globe,
  HardHat,
  Home,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Newspaper,
  Package,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Globe,
  Home,
  Building2,
  Package,
  Wrench,
  HardHat,
  CalendarDays,
  Newspaper,
  Mail,
  ImageIcon,
  Inbox,
};

/** Labels are translation keys, resolved in the client so the sidebar follows the admin language. */
export type NavItem = { labelKey: string; href: string; icon: string };
export type NavGroup = { titleKey: string; items: NavItem[] };

export default function AdminShell({
  groups,
  children,
}: {
  groups: NavGroup[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("admin.nav");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  async function signOut() {
    setSigningOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const nav = (
    <nav className="flex flex-1 flex-col gap-6 px-3 py-5">
      {groups.map((group) => (
        <div key={group.titleKey}>
          <p className="px-3 pb-2 font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-mist/60">
            {t(group.titleKey)}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const Icon = iconMap[item.icon] ?? LayoutDashboard;
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-btn px-3 py-2.5 text-sm transition-colors",
                      active
                        ? "bg-accent text-white"
                        : "text-sand/70 hover:bg-white/[0.06] hover:text-sand",
                    )}
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
                    <span className="truncate font-display font-medium">{t(item.labelKey)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  const sidebarInner = (
    <>
      <div className="flex h-[72px] items-center justify-between gap-2 border-b border-line-dark px-5">
        <Link href="/admin" className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="" className="h-8 w-8" />
          <span className="font-display text-base font-semibold tracking-tight text-sand">
            Maisam<span className="text-accent"> Admin</span>
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          aria-label={t("closeMenu")}
          className="grid h-9 w-9 place-items-center rounded-btn text-sand/70 hover:bg-white/[0.06] lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="border-b border-line-dark">
        <AdminLanguageSwitcher />
      </div>

      {nav}

      <div className="space-y-1 border-t border-line-dark p-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-btn px-3 py-2.5 font-display text-sm font-medium text-sand/70 transition-colors hover:bg-white/[0.06] hover:text-sand"
        >
          <ExternalLink className="h-[18px] w-[18px]" strokeWidth={1.75} />
          {t("viewLiveSite")}
        </a>
        <button
          onClick={signOut}
          disabled={signingOut}
          className="flex w-full items-center gap-3 rounded-btn px-3 py-2.5 font-display text-sm font-medium text-sand/70 transition-colors hover:bg-white/[0.06] hover:text-sand disabled:opacity-50"
        >
          <LogOut className="h-[18px] w-[18px]" strokeWidth={1.75} />
          {signingOut ? t("signingOut") : t("signOut")}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-sand">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 start-0 z-40 hidden w-[272px] flex-col overflow-y-auto no-scrollbar bg-charcoal lg:flex">
        {sidebarInner}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label={t("closeMenu")}
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
          />
          <aside className="absolute inset-y-0 start-0 flex w-[280px] flex-col overflow-y-auto no-scrollbar bg-charcoal">{sidebarInner}</aside>
        </div>
      )}

      <div className="lg:ps-[272px]">
        <header className="sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-line-light bg-sand/90 px-5 backdrop-blur lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label={t("openMenu")}
            className="grid h-10 w-10 place-items-center rounded-btn border border-line-light bg-white text-ink"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-display text-base font-semibold tracking-tight text-ink">
            Maisam<span className="text-accent"> Admin</span>
          </span>
        </header>

        <main className="mx-auto w-full max-w-[1180px] px-5 py-8 md:px-8 md:py-10">{children}</main>
      </div>
    </div>
  );
}
