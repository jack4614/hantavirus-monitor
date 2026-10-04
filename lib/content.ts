import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export const SITE_URL = 'https://www.hantavirus-updates.com';
export const SITE_NAME = 'Hantavirus Updates';

export type PageDef = { slug: string; file: string; nav: string };

// Order here is the order of the main navigation.
export const PAGES: PageDef[] = [
  { slug: '', file: 'index', nav: 'Overview' },
  { slug: 'symptoms', file: 'symptoms', nav: 'Symptoms' },
  { slug: 'transmission', file: 'transmission', nav: 'How it spreads' },
  { slug: 'prevention', file: 'prevention', nav: 'Prevention' },
  { slug: 'mv-hondius-outbreak', file: 'mv-hondius-outbreak', nav: '2026 outbreak' },
  { slug: 'updates', file: 'updates', nav: 'Updates' },
  { slug: 'about', file: 'about', nav: 'About' },
];

export const NAV_PAGES = PAGES.filter((p) => p.slug !== 'about');

export type Page = {
  slug: string;
  title: string;
  description: string;
  lastReviewed: string;
  summary: string | null;
  body: string;
};

const CONTENT_DIR = path.join(process.cwd(), 'content');

export function getPage(slug: string): Page | null {
  const def = PAGES.find((p) => p.slug === slug);
  if (!def) return null;
  const raw = fs.readFileSync(path.join(CONTENT_DIR, `${def.file}.md`), 'utf8');
  const { data, content } = matter(raw);
  let body = content.trim();
  let summary: string | null = null;

  // Pages open with "**In short**" and a bullet list; pull it out for the summary box.
  const marker = '**In short**';
  if (body.startsWith(marker)) {
    const rest = body.slice(marker.length);
    const cut = rest.indexOf('\n### ');
    summary = (cut === -1 ? rest : rest.slice(0, cut)).trim();
    body = cut === -1 ? '' : rest.slice(cut).trim();
  }

  return {
    slug,
    title: String(data.title),
    description: String(data.description),
    lastReviewed: String(data.lastReviewed),
    summary,
    body,
  };
}

export function pageUrl(slug: string): string {
  return slug ? `${SITE_URL}/${slug}` : SITE_URL;
}

// Reads "**Question?** Answer." lines from the FAQ section for FAQPage structured data.
export function getFaq(body: string): { q: string; a: string }[] {
  const start = body.indexOf('### Frequently asked questions');
  if (start === -1) return [];
  const section = body.slice(start).split('\n### ')[0];
  const out: { q: string; a: string }[] = [];
  for (const line of section.split('\n')) {
    const m = line.match(/^\*\*(.+?\?)\*\*\s+(.+)$/);
    if (m) out.push({ q: m[1], a: m[2].replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') });
  }
  return out;
}

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}
