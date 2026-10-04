import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { Analytics } from '@vercel/analytics/next';
import '@fontsource-variable/public-sans';
import '@fontsource-variable/source-serif-4';
import { href, NAV_PAGES, SITE_NAME, SITE_URL } from '@/lib/content';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: 'Plain-language information about hantavirus: symptoms, how it spreads, prevention and the 2026 MV Hondius outbreak.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: { siteName: SITE_NAME, type: 'website', locale: 'en_US', images: ['/og.png'] },
  twitter: { card: 'summary_large_image', images: ['/og.png'] },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#121a17' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#content">
          Skip to content
        </a>
        <header className="site-header">
          <div className="frame header-row">
            <Link href="/" className="brand">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M12 7v10M7 12h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              {SITE_NAME}
            </Link>
            <nav aria-label="Main">
              <ul>
                {NAV_PAGES.map((p) => (
                  <li key={p.slug}>
                    <Link href={href(p.slug)}>{p.nav}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>
        <main id="content" className="frame">
          {children}
        </main>
        <footer className="site-footer">
          <div className="frame footer-row">
            <div>
              <p className="footer-brand">{SITE_NAME}</p>
              <p>
                General information only, not medical advice. If you have trouble breathing, call your local emergency number.
              </p>
            </div>
            <ul>
              {NAV_PAGES.map((p) => (
                <li key={p.slug}>
                  <Link href={href(p.slug)}>{p.nav}</Link>
                </li>
              ))}
              <li>
                <Link href="/about">About and sources</Link>
              </li>
            </ul>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
