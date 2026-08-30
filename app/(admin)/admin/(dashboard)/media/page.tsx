import { getAdminTranslations } from "@/lib/admin/admin-locale";
import MediaLibraryAdmin from "@/components/admin/media-library-admin";
import { AdminPageHeader } from "@/components/admin/ui";
import { fetchAssets } from "@/lib/cms/assets-repo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const t = await getAdminTranslations("admin.media");
  return { title: t("title") };
}

export default async function AdminMediaPage() {
  const t = await getAdminTranslations("admin.media");
  return (
    <div className="space-y-6">
      <AdminPageHeader eyebrow={t("title")} title={t("title")} description={t("description")} />
      <MediaLibraryAdmin initialAssets={fetchAssets()} />
    </div>
  );
}
