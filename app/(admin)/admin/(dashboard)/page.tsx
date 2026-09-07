import Link from "next/link";
import { getAdminTranslations } from "@/lib/admin/admin-locale";
import {
  ArrowUpRight,
  CalendarDays,
  FileText,
  Image as ImageIcon,
  Inbox,
  Pencil,
} from "lucide-react";
import { AdminBadge, AdminCard, AdminPageHeader } from "@/components/admin/ui";
import { countAssets } from "@/lib/cms/assets-repo";
import { lastUpdatedAt, listEditedSectionKeys } from "@/lib/cms/content-repo";
import { fetchAdminEvents } from "@/lib/cms/events-repo";
import { countUnreadMessages } from "@/lib/cms/messages-repo";
import { pageGroups, sectionDefs, sectionsByKey } from "@/lib/cms/sections";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const t = await getAdminTranslations("admin.dashboard");
  return { title: t("eyebrow") };
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminDashboardPage() {
  const [t, tPages, tSections, tPageDescriptions] = await Promise.all([
    getAdminTranslations("admin.dashboard"),
    getAdminTranslations("admin.nav.pages"),
    getAdminTranslations("admin.sections"),
    getAdminTranslations("admin.pageDescriptions"),
  ]);
  const editedKeys = listEditedSectionKeys();
  const events = fetchAdminEvents();
  const updatedAt = lastUpdatedAt();

  const stats = [
    { label: t("editableSections"), value: sectionDefs.length, icon: FileText, href: "/admin/content/home" },
    { label: t("eventsPublished"), value: events.filter((event) => event.published).length, icon: CalendarDays, href: "/admin/events" },
    { label: t("mediaFiles"), value: countAssets(), icon: ImageIcon, href: "/admin/media" },
    { label: t("unreadMessages"), value: countUnreadMessages(), icon: Inbox, href: "/admin/inbox" },
  ];

  const recentlyEdited = editedKeys
    .map((key) => sectionsByKey.get(key))
    .filter((section): section is NonNullable<typeof section> => Boolean(section))
    .slice(0, 6);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <AdminCard className="h-full p-5 transition-all hover:-translate-y-0.5 hover:border-accent/40">
              <div className="flex items-start justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-btn bg-accent/10 text-accent">
                  <stat.icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <ArrowUpRight className="h-4 w-4 text-ink/20" />
              </div>
              <p className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink">{stat.value}</p>
              <p className="mt-0.5 text-sm text-ink/55">{stat.label}</p>
            </AdminCard>
          </Link>
        ))}
      </div>

      <section>
        <h2 className="font-display text-lg font-semibold text-ink">{t("editWebsite")}</h2>
        <p className="mt-1 text-sm text-ink/55">{t("editWebsiteHint")}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pageGroups.map((group) => {
            const count = sectionDefs.filter((section) => section.page === group.key).length;
            return (
              <Link key={group.key} href={`/admin/content/${group.key}`}>
                <AdminCard className="h-full p-5 transition-all hover:-translate-y-0.5 hover:border-accent/40">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-base font-semibold text-ink">{tPages(group.key)}</h3>
                    <AdminBadge tone="muted">{count}</AdminBadge>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ink/55">{tPageDescriptions(group.key)}</p>
                </AdminCard>
              </Link>
            );
          })}
        </div>
      </section>

      {recentlyEdited.length > 0 && (
        <section>
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-display text-lg font-semibold text-ink">{t("recentlyEdited")}</h2>
            {updatedAt && (
              <span className="text-xs text-ink/45">{t("lastChange", { date: formatDate(updatedAt) })}</span>
            )}
          </div>
          <AdminCard className="mt-4 divide-y divide-line-light">
            {recentlyEdited.map((section) => (
              <Link
                key={section.key}
                href={`/admin/content/${section.page}/${encodeURIComponent(section.key)}`}
                className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-sand"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-btn bg-sand text-ink/45">
                  <Pencil className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-sm font-medium text-ink">
                    {tSections(`${section.key}.label`)}
                  </span>
                  <span className="block text-xs text-ink/45">
                    {tPages(section.page)}
                  </span>
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-ink/25" />
              </Link>
            ))}
          </AdminCard>
        </section>
      )}
    </div>
  );
}
