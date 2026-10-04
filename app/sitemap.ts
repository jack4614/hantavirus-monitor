import type { MetadataRoute } from 'next';
import { getPage, PAGES, pageUrl } from '@/lib/content';

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((p) => ({
    url: pageUrl(p.slug),
    lastModified: getPage(p.slug)!.lastReviewed,
    changeFrequency: p.slug === 'updates' ? 'weekly' : 'monthly',
    priority: p.slug === '' ? 1 : 0.8,
  }));
}
