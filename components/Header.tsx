import HeaderNav from "@/components/HeaderNav";
import { getBrand } from "@/lib/cms/site-data";

/** Server wrapper: reads the brand + menu from the CMS and hands them to the client nav. */
export default async function Header() {
  const brand = await getBrand();

  return (
    <HeaderNav
      logo={brand.logo}
      wordmarkPrimary={brand.wordmarkPrimary}
      wordmarkAccent={brand.wordmarkAccent}
      ctaLabel={brand.headerCtaLabel}
      ctaHref={brand.headerCtaHref}
      navLinks={brand.navLinks ?? []}
    />
  );
}
