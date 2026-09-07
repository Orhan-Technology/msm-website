import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { getPublishedEvents } from "@/lib/cms/events-repo";
import { defaultLocale } from "@/lib/i18n/locales";
import { getPosts, getProducts, getServices, getTeam } from "@/lib/cms/site-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [products, services, posts, team, events] = await Promise.all([
    getProducts(),
    getServices(),
    getPosts(),
    getTeam(),
    getPublishedEvents(defaultLocale),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/products`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/projects`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/events`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
  ];

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteUrl}/product/${product.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${siteUrl}/service/${service.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const eventPages: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${siteUrl}/events/${event.slug}`,
    lastModified: new Date(event.updatedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const teamPages: MetadataRoute.Sitemap = team.map((member) => ({
    url: `${siteUrl}/team/${member.slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.4,
  }));

  return [...staticPages, ...productPages, ...servicePages, ...postPages, ...eventPages, ...teamPages];
}
