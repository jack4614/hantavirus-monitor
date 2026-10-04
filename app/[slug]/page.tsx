import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageView from '@/components/PageView';
import { getPage, PAGES } from '@/lib/content';

export const dynamicParams = false;

export function generateStaticParams() {
  return PAGES.filter((p) => p.slug).map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const page = getPage(params.slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/${page.slug}` },
    openGraph: { title: page.title, description: page.description, url: `/${page.slug}`, type: 'article' },
  };
}

export default function ContentPage({ params }: { params: { slug: string } }) {
  const page = getPage(params.slug);
  if (!page) notFound();
  return <PageView page={page} />;
}
