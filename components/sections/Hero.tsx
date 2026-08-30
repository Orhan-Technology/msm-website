import HeroClient from "@/components/sections/HeroClient";
import { section } from "@/lib/cms/content";
import { getCompany } from "@/lib/cms/site-data";

type HeroContent = {
  backgroundVideo: string;
  posterImage: string;
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  body: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  showStats: boolean;
  contactCardTitle: string;
  contactCardAddress: string;
};

export default async function Hero() {
  const [content, company] = await Promise.all([section<HeroContent>("home.hero"), getCompany()]);

  const eyebrow = (content.eyebrow ?? "")
    .replace("{short}", company.shortName)
    .replace("{founded}", String(company.founded));

  return (
    <HeroClient
      {...content}
      eyebrow={eyebrow}
      stats={company.stats}
      email={company.email}
      phone={company.phone}
    />
  );
}
