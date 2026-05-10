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
  imageUrl: string;
};

type FeedItem = OriginalArticle | NewsItem;

const newsItems: NewsItem[] = [
  {
    feedId: 'news-001',
    id: 'news-001',
    type: 'news',
    source: 'NDTV Health',
    sourceUrl: 'https://www.ndtv.com/health/hantavirus-cruise-ship-passengers-to-evacuate-at-canary-islands-soon-who-shares-screening-contact-tracing-plans-11470796',
    date: new Date('2026-05-09T10:30:00'),
    headline: 'MV Hondius Cruise Ship: Passengers to Evacuate at Canary Islands',
    summary: 'WHO implements comprehensive screening and contact tracing protocols as cruise ship prepares for evacuation operations.',
    isBreaking: true,
    imageUrl: 'https://images.unsplash.com/photo-1559606063-bdf1b2c72f97?w=800&h=600&fit=crop',
  },
  {
    feedId: 'news-002',
    id: 'news-002',
    type: 'news',
    source: 'Deutsche Welle',
    sourceUrl: 'https://www.dw.com/en/hantavirus-american-cdc-says-risk-to-public-very-low/live-77063670',
    date: new Date('2026-05-07T14:20:00'),
    headline: 'Hantavirus: American CDC Says Risk to Public "Very Low"',
    summary: 'Live update on CDC monitoring and public health risk assessment.',
    isBreaking: false,
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop',
  },
  {
    feedId: 'news-003',
    id: 'news-003',
    type: 'news',
    source: 'BBC News',
    sourceUrl: 'https://www.bbc.com/news/articles/c5y093d5n9ko',
    date: new Date('2026-05-07T12:15:00'),
    headline: 'Hantavirus-Hit Cruise Ship on Way to Canary Islands After Three Evacuated',
    summary: 'Update on the cruise ship route change and medical evacuation of confirmed cases to Spanish ports.',
    isBreaking: false,
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669714d2e9d8?w=800&h=600&fit=crop',
  },
];

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

  const breakingItems = unifiedFeed.filter(item => item.isBreaking);
  const hasBreaking = breakingItems.length > 0;
  const breakingItem = breakingItems.length > 0 ? breakingItems[0] : null;
  const breakingTitle = breakingItem?.type === 'article' ? breakingItem.title : breakingItem?.type === 'news' ? breakingItem.headline : '';
  const breakingLink = breakingItem?.type === 'article' ? `/articles/${breakingItem.slug}` : breakingItem?.type === 'news' ? breakingItem.sourceUrl : '#';
  const isBreakingExternal = breakingItem?.type === 'news';
  const breakingImage = breakingItem?.type === 'article' 
    ? articleImages[breakingItem.slug] 
    : breakingItem?.type === 'news' 
    ? breakingItem.imageUrl 
    : undefined;

  const filteredFeed = searchTerm.trim() === ''
    ? unifiedFeed
    : unifiedFeed.filter(item => {
        const searchLower = searchTerm.toLowerCase();
        const itemTitle = item.type === 'article' ? item.title : item.headline;
        const itemBody = item.type === 'article' ? item.excerpt : item.summary;
        return itemTitle.toLowerCase().includes(searchLower) || itemBody.toLowerCase().includes(searchLower);
      });

  const nonBreakingFeed = filteredFeed.filter(item => !item.isBreaking);

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* HEADER - MOBILE FIRST */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #e0e0e0',
        padding: '12px 16px',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          {/* Logo row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}>
            <h1 style={{ fontSize: '20px', fontWeight: '700', margin: 0, color: '#1a1a1a' }}>
              🚨 Hantavirus Updates
            </h1>
            <span style={{ fontSize: '11px', color: '#999', whiteSpace: 'nowrap' }}>
              {timeElapsed}
            </span>
          </div>

          {/* Search row */}
          <input
            type="text"
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              background: '#f9f9f9',
              color: '#333',
              fontFamily: 'inherit',
              fontSize: '14px',
              width: '100%',
            }}
          />
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '16px',
      }}>
        {/* BREAKING NEWS HERO */}
        {hasBreaking && (
          <a
            href={breakingLink}
            target={isBreakingExternal ? '_blank' : undefined}
            rel={isBreakingExternal ? 'noopener noreferrer' : undefined}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 0,
              marginBottom: '24px',
              borderRadius: '8px',
              overflow: 'hidden',
              textDecoration: 'none',
              background: '#fff',
              border: '2px solid #c0392b',
              cursor: 'pointer',
            }}
          >
            {/* Image */}
            {breakingImage && (
              <div style={{
                position: 'relative',
                width: '100%',
                height: '240px',
              }}>
                <Image
                  src={breakingImage}
                  alt={breakingTitle}
                  fill
                  unoptimized
                  style={{ objectFit: 'cover' }}
                />
              </div>
            )}

            {/* Content */}
            <div style={{ padding: '20px', background: '#fff' }}>
              <div style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                marginBottom: '10px',
              }}>
                <span style={{
                  background: '#c0392b',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                }}>
                  ⚡ Breaking News
                </span>
              </div>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '700',
                margin: '0 0 8px 0',
                lineHeight: '1.3',
                color: '#1a1a1a',
              }}>
                {breakingTitle}
              </h2>
            </div>
          </a>
        )}

        {/* GRID LAYOUT - MOBILE FIRST */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '16px',
          marginBottom: '24px',
        }}
        className="feed-grid"
        >
          {nonBreakingFeed.length === 0 ? (
            <div style={{
              background: 'white',
              borderRadius: '8px',
              padding: '40px 20px',
              textAlign: 'center',
              gridColumn: '1 / -1',
            }}>
              <p style={{ fontSize: '14px', color: '#999', margin: 0 }}>
                No results for "{searchTerm}"
              </p>
            </div>
          ) : (
            nonBreakingFeed.map((item) => {
              const isArticle = item.type === 'article';
              const imageUrl = isArticle ? articleImages[item.slug] : item.imageUrl;
              const title = isArticle ? item.title : item.headline;
              const body = isArticle ? item.excerpt : item.summary;
              const label = isArticle ? item.category : item.source;
              const link = isArticle ? `/articles/${item.slug}` : item.sourceUrl;
              const isExternal = !isArticle;

              return (
                <a
                  key={item.feedId}
                  href={link}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  style={{
                    background: 'white',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                    transition: 'box-shadow 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
                  }}
                >
                  {/* Image */}
                  {imageUrl && (
                    <div style={{
                      position: 'relative',
                      width: '100%',
                      height: '180px',
                      background: '#f0f0f0',
                    }}>
                      <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        unoptimized
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    {/* Label */}
                    <div style={{
                      display: 'flex',
                      gap: '6px',
                      alignItems: 'center',
                    }}>
                      <span style={{
                        background: isArticle ? '#f0f0f0' : '#e3f2fd',
                        color: isArticle ? '#555' : '#1976d2',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontSize: '10px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                      }}>
                        {label}
                      </span>
                      <span style={{ fontSize: '10px', color: '#999' }}>
                        {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      margin: 0,
                      lineHeight: '1.3',
                      color: '#1a1a1a',
                    }}>
                      {title}
                    </h3>

                    {/* Summary */}
                    <p style={{
                      fontSize: '12px',
                      color: '#666',
                      margin: 0,
                      lineHeight: '1.4',
                      flex: 1,
                    }}>
                      {body}
                    </p>

                    {/* CTA */}
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#1976d2',
                      marginTop: '4px',
                    }}>
                      {isArticle ? 'Read article' : 'Read source'} →
                    </span>
                  </div>
                </a>
              );
            })
          )}
        </div>

        {/* 2-COLUMN LAYOUT FOR DESKTOP */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '24px',
        }}
        className="sidebar-layout"
        >
          {/* Sidebar */}
          <aside>
            {/* Disclaimer */}
            <div style={{
              background: '#fff9e6',
              border: '1px solid #ffe8cc',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '12px',
            }}>
              <h3 style={{ fontSize: '12px', fontWeight: '700', marginBottom: '6px', color: '#1a1a1a', margin: 0 }}>
                ⚠️ Medical Disclaimer
              </h3>
              <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.4', margin: '6px 0 0 0' }}>
                Not medical advice. Contact your healthcare provider for urgent concerns.
              </p>
            </div>

            {/* Outbreak Status */}
            <div style={{
              background: 'white',
              borderRadius: '6px',
              padding: '14px',
              marginBottom: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}>
              <h3 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '12px', color: '#1a1a1a', margin: 0 }}>
                Current Status
              </h3>
              <div style={{ display: 'grid', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #e0e0e0' }}>
                  <span style={{ fontSize: '11px', color: '#666' }}>Cases</span>
                  <strong style={{ fontSize: '14px', color: '#c0392b' }}>{outbreakStats.cases}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #e0e0e0' }}>
                  <span style={{ fontSize: '11px', color: '#666' }}>Deaths</span>
                  <strong style={{ fontSize: '14px', color: '#c0392b' }}>{outbreakStats.deaths}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #e0e0e0' }}>
                  <span style={{ fontSize: '11px', color: '#666' }}>Countries</span>
                  <strong style={{ fontSize: '14px', color: '#2d2d2d' }}>{outbreakStats.countries}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', color: '#666' }}>Mortality</span>
                  <strong style={{ fontSize: '14px', color: '#2d2d2d' }}>{outbreakStats.mortality}</strong>
                </div>
              </div>
            </div>

            {/* Essential Reading */}
            <div style={{
              background: 'white',
              borderRadius: '6px',
              padding: '14px',
              marginBottom: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}>
              <h3 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '10px', color: '#1a1a1a', margin: 0 }}>
                Essential Reading
              </h3>
              <div style={{ display: 'grid', gap: '8px' }}>
                <a href="/articles/what-is-hantavirus" style={{
                  fontSize: '12px',
                  color: '#1976d2',
                  textDecoration: 'none',
                  fontWeight: '500',
                  padding: '6px 0',
                  borderBottom: '1px solid #f0f0f0',
                }}>
                  → What is Hantavirus?
                </a>
                <a href="/articles/hantavirus-symptoms-warning-signs" style={{
                  fontSize: '12px',
                  color: '#1976d2',
                  textDecoration: 'none',
                  fontWeight: '500',
                  padding: '6px 0',
                  borderBottom: '1px solid #f0f0f0',
                }}>
                  → Symptoms & Warning Signs
                </a>
                <a href="/articles/hantavirus-prevention-guide" style={{
                  fontSize: '12px',
                  color: '#1976d2',
                  textDecoration: 'none',
                  fontWeight: '500',
                  padding: '6px 0',
                }}>
                  → Prevention Guide
                </a>
              </div>
            </div>

            {/* Official Sources */}
            <div style={{
              background: 'white',
              borderRadius: '6px',
              padding: '14px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}>
              <h4 style={{ fontSize: '11px', fontWeight: '700', marginBottom: '10px', color: '#1a1a1a', textTransform: 'uppercase', margin: 0 }}>
                Official Sources
              </h4>
              <div style={{ display: 'grid', gap: '8px' }}>
                <a href="https://www.who.int" target="_blank" rel="noopener noreferrer" style={{
                  fontSize: '11px',
                  color: '#1976d2',
                  textDecoration: 'none',
                }}>
                  World Health Organization
                </a>
                <a href="https://www.cdc.gov" target="_blank" rel="noopener noreferrer" style={{
                  fontSize: '11px',
                  color: '#1976d2',
                  textDecoration: 'none',
                }}>
                  CDC (United States)
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* RESPONSIVE CSS */}
      <style>{`
        @media (min-width: 768px) {
          .feed-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .sidebar-layout {
            grid-template-columns: 1fr 280px !important;
          }
        }
        @media (min-width: 1024px) {
          .feed-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}
