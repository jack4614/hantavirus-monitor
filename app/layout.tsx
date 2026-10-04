import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { Analytics } from '@vercel/analytics/next';
import { NAV_PAGES, SITE_NAME, SITE_URL } from '@/lib/content';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: 'Plain-language information about hantavirus: symptoms, how it spreads, prevention and the 2026 MV Hondius outbreak.',
  icons: { icon: '/favicon.svg' },
  openGraph: { siteName: SITE_NAME, type: 'website', locale: 'en_US', images: ['/og.png'] },
  twitter: { card: 'summary_large_image', images: ['/og.png'] },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbfaf7' },
    { media: '(prefers-color-scheme: dark)', color: '#14191a' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="wrap">
            <Link href="/" className="brand">
              {SITE_NAME}
            </Link>
            <nav aria-label="Main">
              <ul>
                {NAV_PAGES.map((p) => (
                  <li key={p.slug}>
                    <Link href={p.slug ? `/${p.slug}` : '/'}>{p.nav}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>
        <main className="wrap">{children}</main>
        <footer className="site-footer">
          <div className="wrap">
            <p>
              General information only, not medical advice. If you have trouble breathing, call your local emergency number.
            </p>
            <p>
              <Link href="/about">About, sources and disclaimer</Link>
            </p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
