import { redirect } from "next/navigation";
import { getAdminTranslations } from "@/lib/admin/admin-locale";
import LoginForm from "@/components/admin/login-form";
import { isAdminAuthenticated } from "@/lib/admin/require-admin";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const t = await getAdminTranslations("admin.login");
  return { title: t("signIn"), robots: { index: false, follow: false } };
}

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) redirect("/admin");
  const t = await getAdminTranslations("admin.login");

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-charcoal px-5 py-16 text-sand">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-accent/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "26px 26px" }}
      />

      <div className="relative w-full max-w-[420px]">
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="" className="h-10 w-10" />
          <span className="font-display text-xl font-semibold tracking-tight">
            Maisam<span className="text-accent"> Steel</span>
          </span>
        </div>

        <h1 className="mt-8 font-display text-3xl font-semibold tracking-tight text-sand">{t("title")}</h1>
        <p className="mt-2 text-sm leading-relaxed text-mist">{t("subtitle")}</p>

        <div className="mt-8 rounded-card border border-line-dark bg-elevated p-6">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-mist/60">{t("footer")}</p>
      </div>
    </main>
  );
}
