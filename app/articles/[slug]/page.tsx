'use client';

import { articles } from '@/articles';
import Image from 'next/image';
import { notFound, useEffect } from 'next/navigation';
import { useParams } from 'next/navigation';

const articleImages: { [key: string]: string } = {
  'what-is-hantavirus': '/images/what-is-hantavirus.jpg',
  'hantavirus-symptoms-warning-signs': '/images/symptoms-warning-signs.jpg',
  'hantavirus-prevention-guide': '/images/prevention-guide.jpg',
  'andes-virus-transmission': '/images/andes-virus-transmission.jpg',
  'mv-hondius-outbreak': '/images/mv-hondius-outbreak.jpg',
  'hantavirus-vs-covid-19': '/images/vs-covid-19.jpg',
};

export default function ArticlePage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const article = articles.find(a => a.slug === slug);

  if (!article) {
    notFound();
  }

  const imageUrl = articleImages[article.slug];
  const ogImageUrl = `https://www.hantavirus-updates.com/opengraph-image?title=${encodeURIComponent(article.title)}&category=${encodeURIComponent(article.category)}`;

  // Set OG meta tags dynamically
  useEffect(() => {
    // Update page title
    document.title = `${article.title} | Hantavirus Updates`;

    // Remove old OG meta tags and add new ones
    const removeMeta = (property: string) => {
      const element = document.querySelector(`meta[property="${property}"]`);
      if (element) element.remove();
    };

    const addMeta = (property: string, content: string) => {
      removeMeta(property);
      const meta = document.createElement('meta');
      meta.setAttribute('property', property);
      meta.setAttribute('content', content);
      document.head.appendChild(meta);
    };

    // Set OG meta tags
    addMeta('og:title', article.title);
    addMeta('og:description', article.excerpt);
    addMeta('og:image', ogImageUrl);
    addMeta('og:url', `https://www.hantavirus-updates.com/articles/${article.slug}`);
    addMeta('og:type', 'article');

    // Twitter tags
    removeMeta('twitter:card');
    const twitterCard = document.createElement('meta');
    twitterCard.setAttribute('name', 'twitter:card');
    twitterCard.setAttribute('content', 'summary_large_image');
    document.head.appendChild(twitterCard);

    removeMeta('twitter:title');
    const twitterTitle = document.createElement('meta');
    twitterTitle.setAttribute('name', 'twitter:title');
    twitterTitle.setAttribute('content', article.title);
    document.head.appendChild(twitterTitle);

    removeMeta('twitter:description');
    const twitterDesc = document.createElement('meta');
    twitterDesc.setAttribute('name', 'twitter:description');
    twitterDesc.setAttribute('content', article.excerpt);
    document.head.appendChild(twitterDesc);

    removeMeta('twitter:image');
    const twitterImage = document.createElement('meta');
    twitterImage.setAttribute('name', 'twitter:image');
    twitterImage.setAttribute('content', ogImageUrl);
    document.head.appendChild(twitterImage);

  }, [article, ogImageUrl]);

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a1a', color: '#f0f0f0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <article style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        {/* BREADCRUMB */}
        <a href="/" style={{ color: '#c0392b', textDecoration: 'none', fontSize: '12px', fontWeight: '600' }}>
          ← Back to updates
        </a>

        {/* HEADER */}
        <div style={{ marginTop: '30px', marginBottom: '30px', paddingBottom: '30px', borderBottom: '1px solid #333' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{
              background: '#f0f0f0',
              color: '#2d2d2d',
              padding: '4px 10px',
              borderRadius: '3px',
              fontSize: '10px',
              fontWeight: '600',
              textTransform: 'uppercase',
            }}>
              {article.category}
            </span>
            {article.isBreaking && <span style={{ fontSize: '10px', color: '#c0392b', fontWeight: '700' }}>⚡ Breaking</span>}
          </div>

          <h1 style={{
            fontSize: '36px',
            fontWeight: '700',
            margin: '0',
            lineHeight: '1.2',
            fontFamily: 'Georgia, "Times New Roman", serif',
          }}>
            {article.title}
          </h1>
        </div>

        {/* IMAGE */}
        {imageUrl && (
          <div style={{
            position: 'relative',
            width: '100%',
            height: '400px',
            marginBottom: '40px',
            borderRadius: '4px',
            overflow: 'hidden',
          }}>
            <Image
              src={imageUrl}
              alt={article.title}
              fill
              unoptimized
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}

        {/* EXCERPT */}
        <div style={{
          fontSize: '16px',
          lineHeight: '1.8',
          color: '#bbb',
          marginBottom: '40px',
          fontFamily: 'Georgia, "Times New Roman", serif',
        }}>
          {article.excerpt}
        </div>

        {/* FULL CONTENT - RENDERED MARKDOWN */}
        <div style={{
          fontSize: '15px',
          lineHeight: '1.8',
          color: '#ccc',
          marginBottom: '40px',
        }}>
          {article.content.split('\n').map((line, idx) => {
            // Headings
            if (line.startsWith('## ')) {
              return (
                <h2 key={idx} style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  margin: '28px 0 16px 0',
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  color: '#f0f0f0',
                }}>
                  {line.replace('## ', '')}
                </h2>
              );
            }
            if (line.startsWith('### ')) {
              return (
                <h3 key={idx} style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  margin: '20px 0 12px 0',
                  color: '#ddd',
                }}>
                  {line.replace('### ', '')}
                </h3>
              );
            }

            // Bold text
            let processedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #fff; font-weight: 600;">$1</strong>');
            
            // Bullet points
            if (line.startsWith('- ')) {
              return (
                <div key={idx} style={{
                  marginLeft: '20px',
                  marginBottom: '8px',
                  display: 'flex',
                  gap: '10px',
                }}>
                  <span style={{ color: '#888' }}>•</span>
                  <span dangerouslySetInnerHTML={{ __html: processedLine.replace('- ', '') }} />
                </div>
              );
            }

            // Numbered lists - reset counter properly
            const numberMatch = line.match(/^(\d+)\. /);
            if (numberMatch) {
              const num = numberMatch[1];
              return (
                <div key={idx} style={{
                  marginLeft: '20px',
                  marginBottom: '8px',
                  display: 'flex',
                  gap: '10px',
                }}>
                  <span style={{ color: '#888', minWidth: '20px' }}>{num}.</span>
                  <span dangerouslySetInnerHTML={{ __html: processedLine.replace(/^\d+\. /, '') }} />
                </div>
              );
            }

            // Empty lines
            if (line.trim() === '') {
              return <div key={idx} style={{ height: '12px' }} />;
            }

            // Regular paragraphs
            return (
              <p key={idx} style={{ margin: '0 0 16px 0' }}>
                <span dangerouslySetInnerHTML={{ __html: processedLine }} />
              </p>
            );
          })}
        </div>

        {/* AUTHOR & DATE */}
        <div style={{
          padding: '20px',
          background: '#222',
          border: '1px solid #333',
          borderRadius: '4px',
          fontSize: '13px',
          color: '#999',
        }}>
          <p style={{ margin: '0 0 8px 0' }}>
            <strong style={{ color: '#f0f0f0' }}>By</strong> {article.author}
          </p>
          <p style={{ margin: 0 }}>
            <strong style={{ color: '#f0f0f0' }}>Published</strong> May 2026
          </p>
        </div>

        {/* BACK LINK */}
        <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid #333' }}>
          <a href="/" style={{ color: '#c0392b', textDecoration: 'none', fontWeight: '600', fontSize: '13px' }}>
            ← Back to all updates
          </a>
        </div>
      </article>
    </div>
  );
}
