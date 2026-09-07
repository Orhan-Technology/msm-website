import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Button from "@/components/Button";

export default async function NotFound() {
  const [t, tNav, tCommon] = await Promise.all([
    getTranslations("notFound"),
    getTranslations("nav"),
    getTranslations("common"),
  ]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-charcoal px-5 text-center text-sand">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle at 50% 30%, #E2562B 0%, transparent 45%)",
        }}
      />
      <div className="relative">
        <p className="font-display text-[clamp(6rem,22vw,14rem)] font-semibold leading-none text-accent">404</p>
        <h1 className="mt-2 text-sand">{t("title")}</h1>
        <p className="mx-auto mt-4 max-w-md text-mist">{t("body")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href="/" size="lg">
            {tNav("backToHome")}
          </Button>
          <Link
            href="/contact"
            className="sheen-btn inline-flex items-center justify-center gap-2 rounded-btn border border-sand/25 px-7 py-4 font-display text-[0.95rem] font-medium text-sand transition-colors hover:bg-sand hover:text-ink"
          >
            {tCommon("contactUs")}
          </Link>
        </div>
      </div>
    </main>
  );
}
