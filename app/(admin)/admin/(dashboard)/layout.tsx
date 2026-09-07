import AdminShell, { type NavGroup } from "@/components/admin/admin-shell";
import { requireAdminPage } from "@/lib/admin/require-admin";
import { pageGroups } from "@/lib/cms/sections";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPage();

  const navGroups: NavGroup[] = [
    {
      titleKey: "overview",
      items: [{ labelKey: "dashboard", href: "/admin", icon: "LayoutDashboard" }],
    },
    {
      titleKey: "websiteContent",
      items: pageGroups.map((group) => ({
        labelKey: `pages.${group.key}`,
        href: `/admin/content/${group.key}`,
        icon: group.icon,
      })),
    },
    {
      titleKey: "manage",
      items: [
        { labelKey: "events", href: "/admin/events", icon: "CalendarDays" },
        { labelKey: "mediaLibrary", href: "/admin/media", icon: "ImageIcon" },
        { labelKey: "inbox", href: "/admin/inbox", icon: "Inbox" },
      ],
    },
  ];

  return <AdminShell groups={navGroups}>{children}</AdminShell>;
}
