import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { slug as slugify } from 'github-slugger';

export const SITE_URL = 'https://www.hantavirus-updates.com';
export const SITE_NAME = 'Hantavirus Updates';

export type PageDef = { slug: string; file: string; nav: string; blurb: string; related: string[] };

// Order here is the order of the main navigation.
export const PAGES: PageDef[] = [
  { slug: '', file: 'index', nav: 'Overview', blurb: 'What hantavirus is and who is at risk.', related: ['symptoms', 'transmission', 'prevention'] },
  { slug: 'symptoms', file: 'symptoms', nav: 'Symptoms', blurb: 'Early signs, the dangerous stage, and when to get help.', related: ['prevention', 'transmission', ''] },
  { slug: 'transmission', file: 'transmission', nav: 'How it spreads', blurb: 'From rodents to people, and the Andes virus exception.', related: ['prevention', 'mv-hondius-outbreak', 'symptoms'] },
  { slug: 'prevention', file: 'prevention', nav: 'Prevention', blurb: 'Keeping rodents out and cleaning up droppings safely.', related: ['symptoms', 'transmission', ''] },
  { slug: 'mv-hondius-outbreak', file: 'mv-hondius-outbreak', nav: '2026 outbreak', blurb: 'What happened on the cruise ship MV Hondius.', related: ['transmission', 'updates', 'symptoms'] },
  { slug: 'updates', file: 'updates', nav: 'Updates', blurb: 'Dated notes from health authorities.', related: ['mv-hondius-outbreak', '', 'about'] },
  { slug: 'about', file: 'about', nav: 'About', blurb: 'Who runs this site and where the information comes from.', related: ['', 'updates', 'prevention'] },
];

export const NAV_PAGES = PAGES.filter((p) => p.slug !== 'about');

export type Heading = { id: string; text: string };

export type Page = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  lastReviewed: string;
  summary: string | null;
  body: string;
  headings: Heading[];
};

const CONTENT_DIR = path.join(process.cwd(), 'content');

export function headingId(text: string): string {
  return slugify(text);
}

export function getDef(slug: string): PageDef {
  return PAGES.find((p) => p.slug === slug)!;
}

export function href(slug: string): string {
  return slug ? `/${slug}` : '/';
}

export function getPage(slug: string): Page | null {
  const def = PAGES.find((p) => p.slug === slug);
  if (!def) return null;
  const raw = fs.readFileSync(path.join(CONTENT_DIR, `${def.file}.md`), 'utf8');
  const { data, content } = matter(raw);
  let body = content.trim();
  let summary: string | null = null;

  // Pages open with "**In short**" and a bullet list; pull it out for the key facts panel.
  const marker = '**In short**';
  if (body.startsWith(marker)) {
    const rest = body.slice(marker.length);
    const cut = rest.indexOf('\n### ');
    summary = (cut === -1 ? rest : rest.slice(0, cut)).trim();
    body = cut === -1 ? '' : rest.slice(cut).trim();
  }

  const headings = [...body.matchAll(/^### (.+)$/gm)].map((m) => ({ id: headingId(m[1]), text: m[1] }));

  return {
    slug,
    title: String(data.title),
    seoTitle: String(data.seoTitle ?? data.title),
    description: String(data.description),
    lastReviewed: String(data.lastReviewed),
    summary,
    body,
    headings,
  };
}

export function pageUrl(slug: string): string {
  return slug ? `${SITE_URL}/${slug}` : SITE_URL;
}

const stripLinks = (s: string) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

// Reads "**Question?** Answer." lines from the FAQ section for FAQPage structured data.
export function getFaq(body: string): { q: string; a: string }[] {
  const start = body.indexOf('### Frequently asked questions');
  if (start === -1) return [];
  const section = body.slice(start).split('\n### ')[0];
  const out: { q: string; a: string }[] = [];
  for (const line of section.split('\n')) {
    const m = line.match(/^\*\*(.+?\?)\*\*\s+(.+)$/);
    if (m) out.push({ q: m[1], a: stripLinks(m[2]) });
  }
  return out;
}

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}
