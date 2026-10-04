import Link from 'next/link';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { formatDate, getFaq, pageUrl, SITE_NAME, type Page } from '@/lib/content';

const mdComponents: Components = {
  table: ({ children }) => (
    <div className="table-wrap">
      <table>{children}</table>
    </div>
  ),
  a: ({ href = '', children }) => {
    if (href.startsWith('http')) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    return <Link href={href}>{children}</Link>;
  },
};

function Md({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
      {children}
    </ReactMarkdown>
  );
}

export default function PageView({ page, notice }: { page: Page; notice?: React.ReactNode }) {
  const jsonLd: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'MedicalWebPage',
      name: page.title,
      description: page.description,
      url: pageUrl(page.slug),
      inLanguage: 'en',
      lastReviewed: page.lastReviewed,
      isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: pageUrl('') },
    },
  ];
  const faq = getFaq(page.body);
  if (faq.length) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    });
  }

  return (
    <article className="page">
      {notice}
      <h1>{page.title}</h1>
      {page.summary && (
        <section className="summary" aria-label="In short">
          <p className="summary-label">In short</p>
          <Md>{page.summary}</Md>
        </section>
      )}
      <div className="prose">
        <Md>{page.body}</Md>
      </div>
      <p className="reviewed">
        Last reviewed: <time dateTime={page.lastReviewed}>{formatDate(page.lastReviewed)}</time>
      </p>
      {jsonLd.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}
    </article>
  );
}
