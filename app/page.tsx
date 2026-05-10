'use client';

import { articles } from '@/articles';
import { outbreakStats } from '@/lib/stats';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const articleImages: { [key: string]: string } = {
  'what-is-hantavirus': '/images/what-is-hantavirus.jpg',
  'hantavirus-symptoms-warning-signs': '/images/symptoms-warning-signs.jpg',
  'hantavirus-prevention-guide': '/images/prevention-guide.jpg',
  'andes-virus-transmission': '/images/andes-virus-transmission.jpg',
  'mv-hondius-outbreak': '/images/mv-hondius-outbreak.jpg',
  'hantavirus-vs-covid-19': '/images/vs-covid-19.jpg',
};

// Types
type OriginalArticle = {
  feedId: string;
  type: 'article';
  id: string | number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  isBreaking: boolean;
  author: string;
  content: string;
  date: Date;
};

type NewsItem = {
  feedId: string;
  type: 'news';
  id: string;
  source: string;
  sourceUrl: string;
  date: Date;
  headline: string;
  summary: string;
  isBreaking: boolean;
  imageUrl?: string;
};

type FeedItem = OriginalArticle | NewsItem;

// News items array
const newsItems: NewsItem[] = [
  {
    feedId: 'news-001',
    id: 'news-001',
    type: 'news',
    source: 'NDTV Health',
    sourceUrl: 'https://www.ndtv.com/health/hantavirus-cruise-ship-passengers-to-evacuate-at-canary-islands-soon-who-shares-screening-contact-tracing-plans-11470796',
    date: new Date('2026-05-09T10:30:00'),
    headline: 'MV Hondius Cruise Ship: Passengers to Evacuate at Canary Islands',
    summary: 'WHO implements comprehensive screening and contact tracing protocols as cruise ship prepares for evacuation operations. Medical teams stationed at evacuation points to manage suspected cases.',
    isBreaking: true,
    imageUrl: 'https://images.ndtv.com/news/hantavirus-cruise-ship-2026.jpg',
  },
  {
    feedId: 'news-002',
    id: 'news-002',
    type: 'news',
    source: 'Deutsche Welle',
    sourceUrl: 'https://www.dw.com/en/hantavirus-american-cdc-says-risk-to-public-very-low/live-77063670',
    date: new Date('2026-05-07T14:20:00'),
    headline: 'Hantavirus: American CDC Says Risk to Public "Very Low"',
    summary: 'Live update on CDC monitoring, medical evacuations, and public health risk assessment. CDC officials stress low transmission risk to general population.',
    isBreaking: false,
    imageUrl: 'https://images.dw.com/cdc-hantavirus-2026.jpg',
  },
  {
    feedId: 'news-003',
    id: 'news-003',
    type: 'news',
    source: 'BBC News',
    sourceUrl: 'https://www.bbc.com/news/articles/c5y093d5n9ko',
    date: new Date('2026-05-07T12:15:00'),
    headline: 'Hantavirus-Hit Cruise Ship on Way to Canary Islands After Three Evacuated',
    summary: 'Update on the cruise ship route change and medical evacuation of three confirmed cases to Spanish ports. Authorities coordinate international response.',
    isBreaking: false,
    imageUrl: 'https://images.bbc.com/news/hondius-cruise-ship-2026.jpg',
  },
];

// Create unified feed
const createUnifiedFeed = (): FeedItem[] => {
  const originalArticles: OriginalArticle[] = articles.map(article => ({
    feedId: `article-${article.id}`,
    type: 'article',
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    category: article.category,
    isBreaking: article.isBreaking,
    author: article.author,
    content: article.content,
    date: new Date('2026-05-09'),
  }));

  const combined: FeedItem[] = [...originalArticles, ...newsItems];
  return combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeElapsed, setTimeElapsed] = useState('Updated 2 hours ago');
  const [unifiedFeed] = useState(createUnifiedFeed());

  useEffect(() => {
    const calculateTime = () => {
      const lastUpdate = new Date(outbreakStats.lastUpdatedTime);
      const now = new Date();
      const diffMs = now.getTime() - lastUpdate.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      let time = 'Just now';
      if (diffMins < 1) time = 'Just now';
      else if (diffMins < 60) time = `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
      else if (diffHours < 24) time = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      else time = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

      setTimeElapsed(`Updated ${time}`);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const breakingArticles = articles.filter(a => a.isBreaking);
  const breakingNews = newsItems.filter(n => n.isBreaking);
  const hasBreaking = breakingArticles.length > 0 || breakingNews.length > 0;

  const filteredFeed = searchTerm.trim() === ''
    ? unifiedFeed
    : unifiedFeed.filter(item => {
        const searchLower = searchTerm.toLowerCase();
        const itemTitle = item.type === 'article' ? item.title : item.headline;
        const itemBody = item.type === 'article' ? item.excerpt : item.summary;
        return itemTitle.toLowerCase().includes(searchLower) || itemBody.toLowerCase().includes(searchLower);
      });

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff' }}>
      {/* BREAKING NEWS BANNER */}
      {hasBreaking && (
        <a 
          href={breakingArticles.length > 0 ? `/articles/${breakingArticles[0].slug}` : breakingNews.length > 0 ? breakingNews[0].sourceUrl : '#'} 
          target={breakingNews.length > 0 ? '_blank' : undefined}
          rel={breakingNews.length > 0 ? 'noopener noreferrer' : undefined}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            background: '#c0392b',
            color: 'white',
            padding: '12px 32px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textDecoration: 'none',
            display: 'block',
          }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            fontSize: '14px',
          }}>
            <div style={{ fontSize: '16px' }}>🚨</div>
            <strong>
              {breakingArticles.length > 0 
                ? breakingArticles[0].title 
                : breakingNews.length > 0 
                ? breakingNews[0].headline 
                : ''}
            </strong>
            <span style={{ marginLeft: 'auto', opacity: 0.9, fontSize: '12px' }}>
              {timeElapsed}
            </span>
          </div>
        </a>
      )}

      {/* HEADER */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #e0e0e0',
        padding: '24px 32px',
        marginTop: hasBreaking ? '50px' : '0',
        position: 'sticky',
        top: hasBreaking ? '50px' : '0',
        zIndex: 40,
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
        }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0, color: '#1a1a1a' }}>
              🚨 Hantavirus Updates
            </h1>
            <p style={{ fontSize: '13px', color: '#999', margin: '4px 0 0 0' }}>
              Breaking news & professional analysis
            </p>
          </div>
          <input
            type="text"
            placeholder="Search news & guides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '10px 14px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              background: '#f9f9f9',
              color: '#333',
              fontFamily: 'inherit',
              fontSize: '14px',
              width: '250px',
            }}
          />
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '32px',
        display: 'grid',
        gridTemplateColumns: '1fr 320px',
        gap: '32px',
      }}>
        {/* UNIFIED FEED */}
        <main>
          <div style={{ marginBottom: '12px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: '#1a1a1a' }}>
              Latest Updates
            </h2>
            <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
              All news and analysis sorted by date (latest first)
            </p>
          </div>

          <div style={{ display: 'grid', gap: '24px', marginTop: '24px' }}>
            {filteredFeed.length === 0 ? (
              <div style={{
                background: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                padding: '40px',
                textAlign: 'center',
              }}>
                <p style={{ fontSize: '15px', color: '#999', margin: 0 }}>
                  No results matching "{searchTerm}"
                </p>
              </div>
            ) : (
              filteredFeed.map((item) => {
                const isArticle = item.type === 'article';
                const imageUrl = isArticle ? articleImages[item.slug] : undefined;
                const title = isArticle ? item.title : item.headline;
                const body = isArticle ? item.excerpt : item.summary;
                const label = isArticle ? item.category : item.source;

                return (
                  <div key={item.feedId} style={{
                    background: 'white',
                    border: `1px solid ${isArticle ? '#e0e0e0' : '#e8e8e8'}`,
                    borderRadius: '6px',
                    overflow: 'hidden',
                    display: (isArticle || (!isArticle && item.imageUrl)) ? 'grid' : 'block',
                    gridTemplateColumns: (isArticle || (!isArticle && item.imageUrl)) ? '200px 1fr' : undefined,
                    gap: 0,
                  }}>
                    {/* ARTICLE IMAGE */}
                    {isArticle && (
                      <div style={{
                        position: 'relative',
                        width: '200px',
                        height: '200px',
                        background: '#f0f0f0',
                        flexShrink: 0,
                      }}>
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={title}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ccc',
                            fontSize: '12px',
                          }}>
                            Image
                          </div>
                        )}
                      </div>
                    )}

                    {/* NEWS IMAGE */}
                    {!isArticle && item.imageUrl && (
                      <div style={{
                        position: 'relative',
                        width: '200px',
                        height: '200px',
                        background: '#f0f0f0',
                        flexShrink: 0,
                      }}>
                        <Image
                          src={item.imageUrl}
                          alt={title}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    )}

                    {/* CONTENT */}
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        {/* HEADER INFO */}
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
                          <div style={{
                            display: 'inline-block',
                            background: isArticle ? '#f5f5f5' : '#e8f4f8',
                            color: isArticle ? '#555' : '#0066cc',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                          }}>
                            {label}
                          </div>
                          <span style={{ fontSize: '12px', color: '#999' }}>
                            {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          {item.isBreaking && <span style={{ fontSize: '12px', color: '#c0392b', fontWeight: '700' }}>⚡ Breaking</span>}
                        </div>

                        {/* HEADLINE */}
                        <h3 style={{
                          fontSize: '16px',
                          fontWeight: '700',
                          margin: '8px 0',
                          lineHeight: '1.3',
                          color: '#1a1a1a',
                        }}>
                          {title}
                        </h3>

                        {/* SUMMARY */}
                        <p style={{
                          fontSize: '13px',
                          color: '#666',
                          margin: '8px 0',
                          lineHeight: '1.5',
                        }}>
                          {body}
                        </p>
                      </div>

                      {/* CTA */}
                      {isArticle ? (
                        <a href={`/articles/${item.slug}`} style={{
                          display: 'inline-block',
                          color: '#2d2d2d',
                          fontWeight: '600',
                          fontSize: '13px',
                          textDecoration: 'none',
                          marginTop: '12px',
                        }}>
                          Read full article →
                        </a>
                      ) : (
                        <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" style={{
                          display: 'inline-block',
                          color: '#2d2d2d',
                          fontWeight: '600',
                          fontSize: '13px',
                          textDecoration: 'none',
                          marginTop: '12px',
                        }}>
                          Read at {item.source} →
                        </a>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>

        {/* SIDEBAR - ALWAYS VISIBLE */}
        <aside style={{ position: 'sticky', top: hasBreaking ? '146px' : '96px', height: 'fit-content' }}>
          {/* DISCLAIMER */}
          <div style={{
            background: '#fff9e6',
            border: '1px solid #ffe8cc',
            borderRadius: '6px',
            padding: '16px',
            marginBottom: '20px',
          }}>
            <div style={{ fontSize: '18px', marginBottom: '8px' }}>⚠️</div>
            <h3 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#1a1a1a' }}>
              Medical Disclaimer
            </h3>
            <p style={{ fontSize: '12px', color: '#666', lineHeight: '1.5', margin: 0 }}>
              Not medical advice. For urgent health concerns, contact your healthcare provider or local health authority.
            </p>
          </div>

          {/* OUTBREAK STATUS */}
          <div style={{
            background: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            padding: '20px',
            marginBottom: '20px',
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px', color: '#1a1a1a' }}>
              Outbreak Status
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #e0e0e0' }}>
                <span style={{ fontSize: '12px', color: '#666' }}>Cases</span>
                <strong style={{ fontSize: '18px', color: '#c0392b' }}>{outbreakStats.cases}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #e0e0e0' }}>
                <span style={{ fontSize: '12px', color: '#666' }}>Deaths</span>
                <strong style={{ fontSize: '18px', color: '#c0392b' }}>{outbreakStats.deaths}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #e0e0e0' }}>
                <span style={{ fontSize: '12px', color: '#666' }}>Countries</span>
                <strong style={{ fontSize: '18px', color: '#2d2d2d' }}>{outbreakStats.countries}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#666' }}>Mortality</span>
                <strong style={{ fontSize: '18px', color: '#2d2d2d' }}>{outbreakStats.mortality}</strong>
              </div>
            </div>
            <p style={{ fontSize: '11px', color: '#999', marginTop: '12px', marginBottom: 0 }}>
              {outbreakStats.lastUpdated}
            </p>
          </div>

          {/* ESSENTIAL READING */}
          <div style={{
            background: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            padding: '20px',
            marginBottom: '20px',
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', color: '#1a1a1a' }}>
              Essential Reading
            </h3>
            <div style={{ display: 'grid', gap: '10px' }}>
              <a href="/articles/what-is-hantavirus" style={{
                display: 'block',
                fontSize: '13px',
                color: '#2d2d2d',
                textDecoration: 'none',
                fontWeight: '500',
                padding: '8px 0',
                borderBottom: '1px solid #f0f0f0',
              }}>
                → What is Hantavirus?
              </a>
              <a href="/articles/hantavirus-symptoms-warning-signs" style={{
                display: 'block',
                fontSize: '13px',
                color: '#2d2d2d',
                textDecoration: 'none',
                fontWeight: '500',
                padding: '8px 0',
                borderBottom: '1px solid #f0f0f0',
              }}>
                → Symptoms & Warning Signs
              </a>
              <a href="/articles/hantavirus-prevention-guide" style={{
                display: 'block',
                fontSize: '13px',
                color: '#2d2d2d',
                textDecoration: 'none',
                fontWeight: '500',
                padding: '8px 0',
              }}>
                → Prevention Guide
              </a>
            </div>
          </div>

          {/* OFFICIAL SOURCES */}
          <div style={{
            background: '#f9f9f9',
            borderRadius: '6px',
            padding: '16px',
          }}>
            <h4 style={{ fontSize: '12px', fontWeight: '700', marginBottom: '12px', color: '#1a1a1a', textTransform: 'uppercase' }}>
              Official Sources
            </h4>
            <div style={{ display: 'grid', gap: '10px' }}>
              <a href="https://www.who.int" target="_blank" rel="noopener noreferrer" style={{
                fontSize: '12px',
                color: '#2d2d2d',
                textDecoration: 'none',
              }}>
                World Health Organization
              </a>
              <a href="https://www.cdc.gov" target="_blank" rel="noopener noreferrer" style={{
                fontSize: '12px',
                color: '#2d2d2d',
                textDecoration: 'none',
              }}>
                CDC (United States)
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
