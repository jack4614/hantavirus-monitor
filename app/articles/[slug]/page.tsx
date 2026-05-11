'use client';

import { articles } from '@/articles';
import Image from 'next/image';
import { notFound } from 'next/navigation';

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

  const imageUrl = articleImages[article.slug];

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

        {/* FULL CONTENT */}
        <div style={{
          fontSize: '15px',
          lineHeight: '1.8',
          color: '#ccc',
          marginBottom: '40px',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
        }}>
          {article.content}
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
