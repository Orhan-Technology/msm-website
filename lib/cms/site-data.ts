import "server-only";
import { section } from "@/lib/cms/content";
import type { Company, Office, SocialLink, Stat } from "@/lib/company";
import type { Post, PostCategory } from "@/lib/posts";
import type { Product, Spec } from "@/lib/products";
import type { Project } from "@/lib/projects";
import type { Service } from "@/lib/services";
import type { TeamMember } from "@/lib/team";

/**
 * Typed accessors the public site reads instead of the static `lib/*.ts` files.
 * Each one merges the admin's edits over the content shipped with the site, so
 * pages keep rendering even before anything has been edited.
 */

type ValueList = { value?: string }[];

/** `[{value: "x"}]` in the editor becomes `["x"]` for the components. */
export function flattenValues(list: unknown): string[] {
  if (!Array.isArray(list)) return [];
  return list
    .map((item) => (typeof item === "string" ? item : ((item as { value?: string })?.value ?? "")))
    .filter((value): value is string => Boolean(value));
}

/** `[{text: "x"}]` in the editor becomes `["x"]`. */
export function flattenTexts(list: unknown): string[] {
  if (!Array.isArray(list)) return [];
  return list
    .map((item) => (typeof item === "string" ? item : ((item as { text?: string })?.text ?? "")))
    .filter((value): value is string => Boolean(value));
}

export type OfficeContent = Office & { image?: string };

export type CompanyContent = Omit<Company, "offices"> & {
  mapEmbed: string;
  offices: OfficeContent[];
};

export async function getCompany(): Promise<CompanyContent> {
  const data = await section<Record<string, unknown>>("global.company");
  return {
    ...(data as unknown as CompanyContent),
    founded: Number(data.founded) || 0,
    stats: ((data.stats as Stat[]) ?? []).map((stat) => ({ ...stat, value: Number(stat.value) || 0 })),
    offices: (data.offices as OfficeContent[]) ?? [],
    socials: (data.socials as SocialLink[]) ?? [],
  };
}

export type BrandContent = {
  logo: string;
  wordmarkPrimary: string;
  wordmarkAccent: string;
  headerCtaLabel: string;
  headerCtaHref: string;
  navLinks: { label: string; href: string }[];
};

export async function getBrand() {
  return section<BrandContent>("global.brand");
}

export type FooterContent = {
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  exploreTitle: string;
  newsletterTitle: string;
  copyright: string;
};

export async function getFooterContent() {
  return section<FooterContent>("global.footer");
}

export type SeoContent = {
  metaTitle: string;
  titleTemplate: string;
  metaDescription: string;
  ogImage: string;
  keywords: ValueList;
};

export async function getSeo() {
  return section<SeoContent>("global.seo");
}

export type ProductContent = Product & { video?: string };

export async function getProducts(): Promise<ProductContent[]> {
  const data = await section<{ items?: ProductContent[] }>("products.catalog");
  return (data.items ?? []).map((item) => ({
    ...item,
    price: Number(item.price) || 0,
    specs: (item.specs as Spec[]) ?? [],
  }));
}

export async function getProductCategories(): Promise<string[]> {
  const data = await section<{ categories?: unknown }>("products.catalog");
  const categories = flattenValues(data.categories);
  return categories.length ? categories : ["All"];
}

export type ServiceContent = Omit<Service, "capabilities"> & {
  capabilities: string[];
  image?: string;
  video?: string;
};

export async function getServices(): Promise<ServiceContent[]> {
  const data = await section<{ items?: (Omit<ServiceContent, "capabilities"> & { capabilities?: unknown })[] }>(
    "services.catalog",
  );
  return (data.items ?? []).map((item) => ({ ...item, capabilities: flattenValues(item.capabilities) }));
}

export type ProjectContent = Project & { video?: string };

export async function getProjects(): Promise<ProjectContent[]> {
  const data = await section<{ items?: ProjectContent[] }>("projects.list");
  return data.items ?? [];
}

export type PostContent = Omit<Post, "category"> & { category: string; video?: string };

export async function getPosts(): Promise<PostContent[]> {
  const data = await section<{ items?: PostContent[] }>("blog.posts");
  return [...(data.items ?? [])].sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export async function getPostCategories(): Promise<PostCategory[]> {
  const data = await section<{ categories?: unknown }>("blog.posts");
  return flattenValues(data.categories) as PostCategory[];
}

export async function getTeam(): Promise<TeamMember[]> {
  const data = await section<{ members?: TeamMember[] }>("about.team");
  return (data.members ?? []).map((member) => ({ ...member, socials: member.socials ?? [] }));
}

/** Page-header content shared by every inner page. */
export type PageHeroContent = {
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  lead: string;
  emptyState?: string;
};

export async function getPageHero(key: string) {
  return section<PageHeroContent>(key);
}
