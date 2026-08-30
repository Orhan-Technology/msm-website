import { getAdminTranslations } from "@/lib/admin/admin-locale";
import MessagesAdmin from "@/components/admin/messages-admin";
import { AdminPageHeader } from "@/components/admin/ui";
import { fetchMessages } from "@/lib/cms/messages-repo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const t = await getAdminTranslations("admin.inbox");
  return { title: t("title") };
}

export default async function AdminInboxPage() {
  const t = await getAdminTranslations("admin.inbox");
  return (
    <div className="space-y-6">
      <AdminPageHeader eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />
      <MessagesAdmin initialMessages={fetchMessages()} />
    </div>
  );
}
