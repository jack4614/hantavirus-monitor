import { articles } from '@/articles';
import { notFound } from 'next/navigation';

function renderMarkdownText(text: string) {
  return text.replace(/\*\*(.*?)\*\*/g, '$1');
}

function renderContent(content: string) {
  const elements: any[] = [];
  const lines = content.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    if (trimmed.startsWith('## ')) {
      elements.push({
        type: 'h2',
        content: renderMarkdownText(trimmed.replace('## ', '')),
      });
      i++;
      continue;
    }

    if (trimmed.startsWith('### ')) {
      elements.push({
        type: 'h3',
        content: renderMarkdownText(trimmed.replace('### ', '')),
      });
      i++;
      continue;
    }

    if (trimmed.includes('| ')) {
      const tableLines = [trimmed];
      i++;
      while (i < lines.length && lines[i].trim().includes('| ')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      elements.push({
        type: 'table',
        content: tableLines.join('\n'),
      });
      continue;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < lines.length) {
        const currentLine = lines[i].trim();
        if (/^\d+\.\s/.test(currentLine)) {
          const content = currentLine.replace(/^\d+\.\s/, '');
          listItems.push(renderMarkdownText(content));
          i++;
        } else if (!currentLine) {
          i++;
        } else {
          break;
        }
      }
      if (listItems.length > 0) {
        elements.push({
          type: 'list',
          items: listItems,
        });
      }
      continue;
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const listItems: string[] = [];
      while (i < lines.length) {
        const currentLine = lines[i].trim();
        if (currentLine.startsWith('- ') || currentLine.startsWith('* ')) {
          listItems.push(renderMarkdownText(currentLine.substring(2).trim()));
          i++;
        } else if (!currentLine) {
          i++;
        } else {
          break;
        }
      }
      if (listItems.length > 0) {
        elements.push({
          type: 'list',
          items: listItems,
        });
      }
      continue;
    }

    if (trimmed.startsWith('❌ ') || trimmed.startsWith('✅ ')) {
      const listItems: string[] = [];
      while (i < lines.length) {
        const currentLine = lines[i].trim();
        if (currentLine.startsWith('❌ ') || currentLine.startsWith('✅ ')) {
          listItems.push(renderMarkdownText(currentLine.substring(2).trim()));
          i++;
        } else if (!currentLine) {
          i++;
        } else {
          break;
        }
      }
      if (listItems.length > 0) {
        elements.push({
          type: 'list',
          items: listItems,
        });
      }
      continue;
    }

    const paragraphLines: string[] = [renderMarkdownText(trimmed)];
    i++;

    while (i < lines.length) {
      const nextLine = lines[i].trim();
      
      if (
        !nextLine ||
        nextLine.startsWith('## ') ||
        nextLine.startsWith('### ') ||
        nextLine.startsWith('- ') ||
        nextLine.startsWith('* ') ||
        nextLine.startsWith('❌ ') ||
        nextLine.startsWith('✅ ') ||
        /^\d+\.\s/.test(nextLine) ||
        nextLine.includes('| ')
      ) {
        break;
      }
      
      paragraphLines.push(renderMarkdownText(nextLine));
      i++;
    }

    if (paragraphLines.length > 0 && paragraphLines.join('').trim()) {
      elements.push({
        type: 'paragraph',
        content: paragraphLines.join(' '),
      });
    }
  }

  return elements;
}

const articleImages: { [key: string]: string } = {
  'what-is-hantavirus': '/images/what-is-hantavirus.jpg',
  'hantavirus-symptoms-warning-signs': '/images/symptoms-warning-signs.jpg',
  'hantavirus-prevention-guide': '/images/prevention-guide.jpg',
  'andes-virus-transmission': '/images/andes-virus-transmission.jpg',
  'mv-hondius-outbreak': '/images/mv-hondius-outbreak.jpg',
  'hantavirus-vs-covid-19': '/images/vs-covid-19.jpg',
};

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = articles.find(a => a.slug === params.slug);

  if (!article) {
    notFound();
  }

  const contentElements = renderContent(article.content);
  const imageUrl = articleImages[article.slug];

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff' }}>
      {/* HEADER */}
      <header style={{
        background: '#2d2d2d',
        color: 'white',
        padding: '20px 32px',
        borderBottom: '1px solid #e0e0e0',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <a href='/' style={{ fontSize: '22px', fontWeight: '600', color: 'white', textDecoration: 'none' }}>
            🚨 Hantavirus Updates
          </a>

        </div>
      </header>

      {/* MAIN CONTENT */}
      <main style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '48px 32px',
      }}>
        {/* ARTICLE IMAGE */}
        <div style={{
          width: '100%',
          height: '360px',
          background: imageUrl ? `url(${imageUrl})` : '#f0f0f0',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          marginBottom: '48px',
        }}>
          {!imageUrl && 'Featured Image'}
        </div>

        {/* ARTICLE HEADER */}
        <article>
          {/* CATEGORY */}
          <div style={{
            display: 'inline-block',
            background: '#f5f5f5',
            color: '#555',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: '600',
            marginBottom: '20px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            {article.category}
          </div>

          {/* TITLE */}
          <h1 style={{
            fontSize: '36px',
            fontWeight: '700',
            marginBottom: '20px',
            lineHeight: '1.3',
            color: '#1a1a1a',
          }}>
            {article.title}
          </h1>

          {/* META INFO */}
          <div style={{
            display: 'flex',
            gap: '16px',
            fontSize: '13px',
            color: '#999',
            marginBottom: '40px',
            paddingBottom: '24px',
            borderBottom: '1px solid #e8e8e8',
          }}>
            <span>By {article.author}</span>
            <span>•</span>
            <span>May 2026</span>
            <span>•</span>
            <span>15 min read</span>
          </div>

          {/* ARTICLE CONTENT */}
          <div style={{
            fontSize: '16px',
            lineHeight: '1.8',
            color: '#555',
            marginBottom: '48px',
          }}>
            {contentElements.map((element, index) => {
              if (element.type === 'h2') {
                return (
                  <h2
                    key={index}
                    style={{
                      fontSize: '26px',
                      fontWeight: '700',
                      marginTop: '40px',
                      marginBottom: '16px',
                      color: '#1a1a1a',
                    }}
                  >
                    {element.content}
                  </h2>
                );
              }

              if (element.type === 'h3') {
                return (
                  <h3
                    key={index}
                    style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      marginTop: '28px',
                      marginBottom: '12px',
                      color: '#1a1a1a',
                    }}
                  >
                    {element.content}
                  </h3>
                );
              }

              if (element.type === 'list') {
                return (
                  <ul
                    key={index}
                    style={{
                      marginLeft: '20px',
                      marginBottom: '16px',
                      listStyleType: 'none',
                    }}
                  >
                    {element.items.map((item: string, idx: number) => (
                      <li key={idx} style={{ marginBottom: '8px' }}>
                        • {item}
                      </li>
                    ))}
                  </ul>
                );
              }

              if (element.type === 'table') {
                return (
                  <pre
                    key={index}
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      marginBottom: '24px',
                      color: '#666',
                      background: '#f9f9f9',
                      padding: '16px',
                      borderRadius: '6px',
                      overflow: 'auto',
                      border: '1px solid #e8e8e8',
                    }}
                  >
                    {element.content}
                  </pre>
                );
              }

              return (
                <p key={index} style={{ marginBottom: '16px' }}>
                  {element.content}
                </p>
              );
            })}
          </div>

          {/* BACK BUTTON */}
          <a
            href='/'
            style={{
              display: 'inline-block',
              background: '#2d2d2d',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '14px',
              textDecoration: 'none',
            }}
          >
            ← Back to Home
          </a>
        </article>

        {/* RELATED ARTICLES */}
        <div style={{ marginTop: '60px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '28px',
            color: '#1a1a1a',
          }}>
            Related Articles
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '16px',
          }}>
            {articles
              .filter(a => a.id !== article.id && a.category === article.category)
              .slice(0, 3)
              .map(relatedArticle => (
                <a
                  key={relatedArticle.id}
                  href={`/articles/${relatedArticle.slug}`}
                  style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: '#555',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                    border: '1px solid #e8e8e8',
                    display: 'block',
                  }}
                >
                  <div style={{
                    background: '#f5f5f5',
                    color: '#555',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '600',
                    marginBottom: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    width: 'fit-content',
                  }}>
                    {relatedArticle.category}
                  </div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    marginBottom: '8px',
                    lineHeight: '1.4',
                    color: '#1a1a1a',
                  }}>
                    {relatedArticle.title}
                  </h3>
                  <p style={{
                    fontSize: '13px',
                    color: '#999',
                    lineHeight: '1.6',
                    margin: 0,
                  }}>
                    {relatedArticle.excerpt}
                  </p>
                </a>
              ))}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer style={{
        background: '#f9f9f9',
        color: '#666',
        padding: '40px 32px',
        marginTop: '60px',
        borderTop: '1px solid #e0e0e0',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
        }}>
          <p style={{ marginBottom: '8px', fontSize: '14px' }}>
            © 2026 Hantavirus Updates. All rights reserved.
          </p>
          <p style={{ fontSize: '12px', color: '#999' }}>
            Breaking news about the 2026 Hantavirus outbreak
          </p>
        </div>
      </footer>
    </div>
  );
}

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}
