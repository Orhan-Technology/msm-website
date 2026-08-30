import { notFound } from "next/navigation";
import { getAdminTranslations } from "@/lib/admin/admin-locale";
import SectionEditor from "@/components/admin/section-editor";
import { resolveSectionForEditing, translatedLocalesFor } from "@/lib/cms/content-repo";
import { getSectionDef, pageGroups } from "@/lib/cms/sections";
import { defaultLocale } from "@/lib/i18n/locales";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string; section: string }>;
}) {
  const def = getSectionDef(decodeURIComponent((await params).section));
  return { title: def?.label ?? "Section" };
}

export default async function AdminSectionPage({
  params,
}: {
  params: Promise<{ page: string; section: string }>;
}) {
  const { page, section: rawSection } = await params;
  const sectionKey = decodeURIComponent(rawSection);
  const def = getSectionDef(sectionKey);
  if (!def || def.page !== page) notFound();

  const [t, tPages, tSections] = await Promise.all([
    getAdminTranslations("admin.content"),
    getAdminTranslations("admin.nav.pages"),
    getAdminTranslations("admin.sections"),
  ]);
  const group = pageGroups.find((item) => item.key === page);
  const { payload, source } = resolveSectionForEditing(sectionKey, defaultLocale);

  return (
    <SectionEditor
      sectionKey={sectionKey}
      label={tSections(`${sectionKey}.label`)}
      description={tSections(`${sectionKey}.description`)}
      fields={def.fields}
      initialPayload={payload}
      initialSource={source}
      initialTranslatedLocales={translatedLocalesFor(sectionKey)}
      previewPath={def.previewPath}
      backHref={`/admin/content/${page}`}
      backLabel={t("back", { page: group ? tPages(group.key) : "" })}
    />
  );
}
