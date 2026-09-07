import { getAdminTranslations } from "@/lib/admin/admin-locale";
import { ExternalLink } from "lucide-react";
import EventsAdmin from "@/components/admin/events-admin";
import { AdminButton, AdminPageHeader } from "@/components/admin/ui";
import { fetchAdminEvents } from "@/lib/cms/events-repo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const t = await getAdminTranslations("admin.events");
  return { title: t("title") };
}

export default async function AdminEventsPage() {
  const t = await getAdminTranslations("admin.events");
  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        actions={
          <a href="/events" target="_blank" rel="noopener noreferrer">
            <AdminButton>
              <ExternalLink className="h-4 w-4" />
              {t("viewPage")}
            </AdminButton>
          </a>
        }
      />
      <EventsAdmin initialEvents={fetchAdminEvents()} />
    </div>
  );
}
