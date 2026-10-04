import type { Metadata } from 'next';
import PageView from '@/components/PageView';
import { getPage } from '@/lib/content';

const page = getPage('')!;

export const metadata: Metadata = {
  title: { absolute: page.seoTitle },
  description: page.description,
  alternates: { canonical: '/' },
  openGraph: { title: page.seoTitle, description: page.description, url: '/' },
};

export default function Home() {
  return <PageView slug="" />;
}
