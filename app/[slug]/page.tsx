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
    title: { absolute: page.seoTitle },
    description: page.description,
    alternates: { canonical: `/${page.slug}` },
    openGraph: { title: page.seoTitle, description: page.description, url: `/${page.slug}`, type: 'article' },
  };
}

export default function ContentPage({ params }: { params: { slug: string } }) {
  if (!getPage(params.slug)) notFound();
  return <PageView slug={params.slug} />;
}
