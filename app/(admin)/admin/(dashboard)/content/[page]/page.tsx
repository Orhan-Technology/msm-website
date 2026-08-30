import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminTranslations } from "@/lib/admin/admin-locale";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { AdminBadge, AdminButton, AdminCard, AdminPageHeader } from "@/components/admin/ui";
import { listEditedSectionKeys } from "@/lib/cms/content-repo";
import { pageGroups, sectionsForPage } from "@/lib/cms/sections";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return pageGroups.map((group) => ({ page: group.key }));
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const t = await getAdminTranslations("admin.nav.pages");
  const group = pageGroups.find((item) => item.key === page);
  return { title: group ? t(group.key) : "Content" };
}

export default async function AdminContentPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const group = pageGroups.find((item) => item.key === page);
  if (!group) notFound();

  const [t, tPages, tSections] = await Promise.all([
    getAdminTranslations("admin.content"),
    getAdminTranslations("admin.nav.pages"),
    getAdminTranslations("admin.sections"),
  ]);
  const tPageDescriptions = await getAdminTranslations("admin.pageDescriptions");

  const sections = sectionsForPage(page);
  const edited = new Set(listEditedSectionKeys());

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow={t("eyebrow")}
        title={tPages(group.key)}
        description={tPageDescriptions(group.key)}
        actions={
          <a href={group.path} target="_blank" rel="noopener noreferrer">
            <AdminButton>
              <ExternalLink className="h-4 w-4" />
              {t("viewPage")}
            </AdminButton>
          </a>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <Link key={section.key} href={`/admin/content/${page}/${encodeURIComponent(section.key)}`}>
            <AdminCard className="flex h-full flex-col p-5 transition-all hover:-translate-y-0.5 hover:border-accent/40">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-display text-base font-semibold text-ink">
                  {tSections(`${section.key}.label`)}
                </h2>
                {edited.has(section.key) ? (
                  <AdminBadge tone="accent">{t("edited")}</AdminBadge>
                ) : (
                  <AdminBadge tone="muted">{t("original")}</AdminBadge>
                )}
              </div>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/55">
                {tSections(`${section.key}.description`)}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 font-display text-sm font-medium text-accent">
                {t("editSection")}
                <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" />
              </span>
            </AdminCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
