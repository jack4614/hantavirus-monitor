import Link from 'next/link';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  formatDate,
  getDef,
  getFaq,
  getPage,
  headingId,
  href,
  pageUrl,
  SITE_NAME,
  type Page,
} from '@/lib/content';

function textOf(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (node && typeof node === 'object' && 'props' in node) {
    return textOf((node as { props: { children?: React.ReactNode } }).props.children);
  }
  return '';
}

const mdComponents: Components = {
  h3: ({ children }) => <h2 id={headingId(textOf(children))}>{children}</h2>,
  table: ({ children }) => (
    <div className="table-wrap">
      <table>{children}</table>
    </div>
  ),
  p: ({ children }) => {
    const text = textOf(children);
    if (text.startsWith('Go to emergency care')) {
      return (
        <p className="urgent" role="note">
          {children}
        </p>
      );
    }
    if (/^Sources?:/.test(text)) return <p className="sources">{children}</p>;
    return <p>{children}</p>;
  },
  a: ({ href: to = '', children }) => {
    if (to.startsWith('http')) {
      return (
        <a href={to} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    return <Link href={to}>{children}</Link>;
  },
};

function Md({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
      {children}
    </ReactMarkdown>
  );
}

function KeyFacts({ summary }: { summary: string }) {
  return (
    <section className="facts" aria-labelledby="facts-title">
      <h2 id="facts-title">Key facts</h2>
      <Md>{summary}</Md>
    </section>
  );
}

export function Related({ slugs }: { slugs: string[] }) {
  return (
    <ul className="related">
      {slugs.map((s) => {
        const d = getDef(s);
        return (
          <li key={s}>
            <Link href={href(s)}>{d.nav}</Link>
            <span>{d.blurb}</span>
          </li>
        );
      })}
    </ul>
  );
}

function JsonLd({ page }: { page: Page }) {
  const data: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'MedicalWebPage',
      name: page.seoTitle,
      headline: page.title,
      description: page.description,
      url: pageUrl(page.slug),
      inLanguage: 'en',
      lastReviewed: page.lastReviewed,
      dateModified: page.lastReviewed,
      isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: pageUrl('') },
    },
  ];
  if (page.slug) {
    data.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: pageUrl('') },
        { '@type': 'ListItem', position: 2, name: page.title, item: pageUrl(page.slug) },
      ],
    });
  }
  const faq = getFaq(page.body);
  if (faq.length) {
    data.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    });
  }
  return (
    <>
      {data.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}
    </>
  );
}

function Aside({ page }: { page: Page }) {
  return (
    <aside className="aside">
      {page.headings.length > 1 && (
        <nav className="toc" aria-labelledby="toc-title">
          <h2 id="toc-title">On this page</h2>
          <ul>
            {page.headings.map((h) => (
              <li key={h.id}>
                <a href={`#${h.id}`}>{h.text}</a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </aside>
  );
}

export default function PageView({ slug }: { slug: string }) {
  const page = getPage(slug)!;
  const def = getDef(slug);
  const isHome = slug === '';
  const topics = ['symptoms', 'transmission', 'prevention', 'mv-hondius-outbreak', 'updates'];

  return (
    <>
      {isHome ? (
        <section className="hero">
          <div className="hero-text">
            <p className="notice">
              The 2026 MV Hondius outbreak was declared over by WHO on 2 July 2026.{' '}
              <Link href="/mv-hondius-outbreak">What happened</Link>
            </p>
            <h1>{page.title}</h1>
            <p className="lede">
              A plain-language guide to the virus carried by wild rodents: how people catch it, what the symptoms are and how to stay
              safe. Based on WHO, CDC and ECDC information.
            </p>
          </div>
          {page.summary && <KeyFacts summary={page.summary} />}
        </section>
      ) : (
        <header className="page-head">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link> <span aria-hidden="true">/</span> <span>{def.nav}</span>
          </nav>
          <h1>{page.title}</h1>
          <p className="lede">{page.description}</p>
        </header>
      )}

      {isHome && (
        <nav className="topics" aria-label="Topics">
          {topics.map((s) => {
            const d = getDef(s);
            return (
              <Link key={s} href={href(s)} className="topic">
                <span className="topic-name">{d.nav}</span>
                <span className="topic-blurb">{d.blurb}</span>
              </Link>
            );
          })}
        </nav>
      )}

      <div className="layout">
        <article className="main">
          {!isHome && page.summary && <KeyFacts summary={page.summary} />}
          <div className="prose">
            <Md>{page.body}</Md>
          </div>
          <p className="reviewed">
            Last reviewed <time dateTime={page.lastReviewed}>{formatDate(page.lastReviewed)}</time>. Sources are linked on each page
            and listed on the <Link href="/about">about page</Link>.
          </p>
          <section className="more" aria-labelledby="more-title">
            <h2 id="more-title">Read next</h2>
            <Related slugs={def.related} />
          </section>
        </article>
        <Aside page={page} />
      </div>
      <JsonLd page={page} />
    </>
  );
}
