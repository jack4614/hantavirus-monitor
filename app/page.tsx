import type { Metadata } from 'next';
import Link from 'next/link';
import PageView from '@/components/PageView';
import { getPage, SITE_NAME } from '@/lib/content';

const page = getPage('')!;

export const metadata: Metadata = {
  title: { absolute: `${page.title} | ${SITE_NAME}` },
  description: page.description,
  alternates: { canonical: '/' },
  openGraph: { title: page.title, description: page.description, url: '/' },
};

export default function Home() {
  return (
    <PageView
      page={page}
      notice={
        <p className="notice">
          The 2026 MV Hondius outbreak was declared over by WHO on 2 July 2026.{' '}
          <Link href="/mv-hondius-outbreak">What happened</Link>
        </p>
      }
    />
  );
}
