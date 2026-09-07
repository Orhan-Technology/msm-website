import NewsletterBannerClient from "@/components/sections/NewsletterBannerClient";
import { section } from "@/lib/cms/content";
import { flattenTexts } from "@/lib/cms/site-data";

type NewsletterContent = {
  eyebrow: string;
  title: string;
  body: string;
  perks: unknown;
  placeholder: string;
  buttonLabel: string;
  successMessage: string;
};

export default async function CtaBanner() {
  const content = await section<NewsletterContent>("home.newsletter");
  return <NewsletterBannerClient {...content} perks={flattenTexts(content.perks)} />;
}
