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
    isBreaking: true,
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
    summary: 'Update on the cruise ship route change and medical evacuation of confirmed cases.',
    isBreaking: true,
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
  const [tickerIndex, setTickerIndex] = useState(0);

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

  // Rotate ticker every 6 seconds
  useEffect(() => {
    const breakingItems = unifiedFeed.filter(item => item.isBreaking);
    if (breakingItems.length === 0) return;

    const timer = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % breakingItems.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [unifiedFeed]);

  const breakingItems = unifiedFeed.filter(item => item.isBreaking);
  const breakingItem = breakingItems.length > 0 ? breakingItems[0] : null;

  const filteredFeed = searchTerm.trim() === ''
    ? unifiedFeed.filter(item => !item.isBreaking)
    : unifiedFeed.filter(item => {
        const searchLower = searchTerm.toLowerCase();
        const itemTitle = item.type === 'article' ? item.title : item.headline;
        const itemBody = item.type === 'article' ? item.excerpt : item.summary;
        return itemTitle.toLowerCase().includes(searchLower) || itemBody.toLowerCase().includes(searchLower);
      });

  const groupByCategory = (items: FeedItem[]) => {
    const groups: { [key: string]: FeedItem[] } = {};
    items.forEach(item => {
      const category = item.type === 'article' ? item.category : item.source;
      if (!groups[category]) groups[category] = [];
      groups[category].push(item);
    });
    return groups;
  };

  const categorized = groupByCategory(filteredFeed);
  const currentTickerItem = breakingItems[tickerIndex];

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a1a', color: '#f0f0f0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* MOVING TICKER - 3 BREAKING NEWS */}
      {breakingItems.length > 0 && (
        <div style={{
          background: '#c0392b',
          color: 'white',
          padding: '12px 20px',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
        onClick={() => {
          const link = currentTickerItem.type === 'article' 
            ? `/articles/${currentTickerItem.slug}` 
            : currentTickerItem.sourceUrl;
          window.location.href = link;
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = '#a02d24';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = '#c0392b';
        }}
        >
          <span style={{ fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap' }}>⚡ BREAKING</span>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <p style={{
              margin: 0,
              fontSize: '13px',
              whiteSpace: 'nowrap',
              animation: 'scroll 0.3s ease-in',
            }}>
              {currentTickerItem?.type === 'article' 
                ? currentTickerItem.title 
                : currentTickerItem?.headline}
            </p>
          </div>
          <span style={{ fontSize: '11px', opacity: 0.9 }}>{tickerIndex + 1} of {breakingItems.length}</span>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '30px 20px',
      }}>
        {/* HEADER */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px',
          paddingBottom: '24px',
          borderBottom: '1px solid #333',
        }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '11px', letterSpacing: '2px', color: '#888', textTransform: 'uppercase' }}>
            Real-time monitoring
          </p>
          <h1 style={{
            margin: '0 0 8px 0',
            fontSize: '48px',
            fontWeight: '700',
            letterSpacing: '-1px',
            fontFamily: 'Georgia, "Times New Roman", serif',
          }}>
            Hantavirus Updates
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#aaa' }}>
            Breaking news & comprehensive coverage
          </p>
        </div>

        {/* SEARCH */}
        <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'center' }}>
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '10px 14px',
              border: '1px solid #333',
              borderRadius: '4px',
              width: '100%',
              maxWidth: '380px',
              fontSize: '13px',
              background: '#222',
              color: '#f0f0f0',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* FEATURED BREAKING NEWS */}
        {breakingItem && (
          <a
            href={breakingItem.type === 'article' ? `/articles/${breakingItem.slug}` : breakingItem.sourceUrl}
            target={breakingItem.type === 'news' ? '_blank' : undefined}
            rel={breakingItem.type === 'news' ? 'noopener noreferrer' : undefined}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '28px',
              marginBottom: '40px',
              border: '1px solid #333',
              borderRadius: '4px',
              overflow: 'hidden',
              background: '#222',
              textDecoration: 'none',
              color: '#f0f0f0',
            }}
            className="breaking-featured"
          >
            {/* Image */}
            {(breakingItem.type === 'article' 
              ? articleImages[breakingItem.slug] 
              : 'https://via.placeholder.com/600x340/1a1a1a/888888?text=Breaking+News') && (
              <div style={{
                position: 'relative',
                height: '340px',
              }}>
                <Image
                  src={breakingItem.type === 'article' 
                    ? articleImages[breakingItem.slug] 
                    : 'https://via.placeholder.com/600x340/1a1a1a/888888?text=Breaking+News'}
                  alt={breakingItem.type === 'article' ? breakingItem.title : breakingItem.headline}
                  fill
                  unoptimized
                  style={{ objectFit: 'cover' }}
                />
              </div>
            )}

            {/* Content */}
            <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '10px', letterSpacing: '1px', color: '#c0392b', textTransform: 'uppercase', fontWeight: '700' }}>
                ⚡ Breaking News
              </p>
              <h2 style={{
                margin: '0 0 14px 0',
                fontSize: '28px',
                fontWeight: '700',
                lineHeight: '1.2',
                fontFamily: 'Georgia, "Times New Roman", serif',
              }}>
                {breakingItem.type === 'article' ? breakingItem.title : breakingItem.headline}
              </h2>
              <p style={{
                margin: '0',
                fontSize: '14px',
                color: '#bbb',
                lineHeight: '1.6',
              }}>
                {breakingItem.type === 'article' ? breakingItem.excerpt : breakingItem.summary}
              </p>
            </div>
          </a>
        )}

        {/* 2-COLUMN MAIN LAYOUT */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '30px',
        }}
        className="main-layout"
        >
          {/* DAILY FEED */}
          <div>
            <h3 style={{
              fontSize: '12px',
              fontWeight: '700',
              letterSpacing: '1px',
              margin: '0 0 24px 0',
              color: '#c0392b',
              textTransform: 'uppercase',
            }}>
              Daily Feed
            </h3>

            <div style={{ display: 'grid', gap: '28px' }}>
              {filteredFeed.length === 0 ? (
                <p style={{ color: '#888', fontSize: '13px' }}>No results for "{searchTerm}"</p>
              ) : (
                Object.entries(categorized).map(([category, items], categoryIdx) => {
                  const categoryColors = [
                    { border: '#0066cc', bg: 'rgba(0, 102, 204, 0.1)' },
                    { border: '#00aa66', bg: 'rgba(0, 170, 102, 0.1)' },
                    { border: '#cc7700', bg: 'rgba(204, 119, 0, 0.1)' },
                    { border: '#aa00cc', bg: 'rgba(170, 0, 204, 0.1)' },
                  ];
                  const colors = categoryColors[categoryIdx % categoryColors.length];

                  return (
                    <div key={category}>
                      <p style={{
                        fontSize: '10px',
                        letterSpacing: '2px',
                        color: colors.border,
                        textTransform: 'uppercase',
                        margin: '0 0 16px 0',
                        fontWeight: '700',
                      }}>
                        {category}
                      </p>
                      <div style={{ display: 'grid', gap: '18px' }}>
                        {items.slice(0, 2).map(item => {
                          const title = item.type === 'article' ? item.title : item.headline;
                          const summary = item.type === 'article' ? item.excerpt : item.summary;
                          const link = item.type === 'article' ? `/articles/${item.slug}` : item.sourceUrl;
                          const isExternal = item.type === 'news';

                          return (
                            <a
                              key={item.feedId}
                              href={link}
                              target={isExternal ? '_blank' : undefined}
                              rel={isExternal ? 'noopener noreferrer' : undefined}
                              style={{
                                textDecoration: 'none',
                                color: '#f0f0f0',
                                transition: 'all 0.2s',
                                borderLeft: `3px solid ${colors.border}`,
                                paddingLeft: '16px',
                                display: 'block',
                              }}
                              onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.color = colors.border;
                                (e.currentTarget as HTMLElement).style.paddingLeft = '20px';
                              }}
                              onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.color = '#f0f0f0';
                                (e.currentTarget as HTMLElement).style.paddingLeft = '16px';
                              }}
                            >
                              <h4 style={{
                                margin: '0 0 8px 0',
                                fontSize: '15px',
                                fontWeight: '600',
                                lineHeight: '1.3',
                                fontFamily: 'Georgia, "Times New Roman", serif',
                              }}>
                                {title}
                              </h4>
                              <p style={{
                                margin: '0',
                                fontSize: '12px',
                                color: '#999',
                                lineHeight: '1.6',
                              }}>
                                {summary.length > 100 ? summary.substring(0, 100) + '...' : summary}
                              </p>
                              <span style={{
                                fontSize: '10px',
                                color: colors.border,
                                fontWeight: '600',
                                marginTop: '8px',
                                display: 'inline-block',
                              }}>
                                {isExternal ? `Read at ${(item as NewsItem).source} →` : 'Read article →'}
                              </span>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* SIDEBAR */}
          <div>
            {/* STATUS */}
            <div style={{ marginBottom: '28px' }}>
              <h3 style={{
                fontSize: '12px',
                fontWeight: '700',
                letterSpacing: '1px',
                margin: '0 0 16px 0',
                color: '#c0392b',
                textTransform: 'uppercase',
              }}>
                Current Status
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ background: '#222', border: '1px solid #333', borderRadius: '4px', padding: '14px' }}>
                  <p style={{ margin: '0 0 6px 0', fontSize: '10px', color: '#888', textTransform: 'uppercase', fontWeight: '700' }}>Confirmed Cases</p>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#c0392b' }}>{outbreakStats.cases}</p>
                </div>
                <div style={{ background: '#222', border: '1px solid #333', borderRadius: '4px', padding: '14px' }}>
                  <p style={{ margin: '0 0 6px 0', fontSize: '10px', color: '#888', textTransform: 'uppercase', fontWeight: '700' }}>Deaths</p>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#c0392b' }}>{outbreakStats.deaths}</p>
                </div>
                <div style={{ background: '#222', border: '1px solid #333', borderRadius: '4px', padding: '14px' }}>
                  <p style={{ margin: '0 0 6px 0', fontSize: '10px', color: '#888', textTransform: 'uppercase', fontWeight: '700' }}>Mortality Rate</p>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>{outbreakStats.mortality}</p>
                </div>
                <div style={{ background: '#222', border: '1px solid #333', borderRadius: '4px', padding: '14px' }}>
                  <p style={{ margin: '0 0 6px 0', fontSize: '10px', color: '#888', textTransform: 'uppercase', fontWeight: '700' }}>Countries</p>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>{outbreakStats.countries}</p>
                </div>
              </div>
              <p style={{ margin: '12px 0 0 0', fontSize: '10px', color: '#666' }}>{timeElapsed}</p>
            </div>

            {/* DISCLAIMER */}
            <div style={{
              background: '#222',
              border: '1px solid #c0392b',
              borderLeft: '3px solid #c0392b',
              borderRadius: '4px',
              padding: '14px',
              marginBottom: '20px',
            }}>
              <h4 style={{
                fontSize: '10px',
                fontWeight: '700',
                letterSpacing: '1px',
                margin: '0 0 8px 0',
                color: '#c0392b',
                textTransform: 'uppercase',
              }}>
                Medical Disclaimer
              </h4>
              <p style={{
                margin: 0,
                fontSize: '12px',
                color: '#999',
                lineHeight: '1.5',
              }}>
                Not medical advice. Contact your healthcare provider for urgent concerns.
              </p>
            </div>

            {/* ESSENTIAL READING */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{
                fontSize: '10px',
                fontWeight: '700',
                letterSpacing: '1px',
                margin: '0 0 12px 0',
                color: '#c0392b',
                textTransform: 'uppercase',
              }}>
                Essential Reading
              </h4>
              <div style={{ display: 'grid', gap: '8px' }}>
                <a href="/articles/what-is-hantavirus" style={{
                  fontSize: '12px',
                  color: '#bbb',
                  textDecoration: 'none',
                }}>
                  → What is Hantavirus?
                </a>
                <a href="/articles/hantavirus-symptoms-warning-signs" style={{
                  fontSize: '12px',
                  color: '#bbb',
                  textDecoration: 'none',
                }}>
                  → Symptoms & Warning Signs
                </a>
                <a href="/articles/hantavirus-prevention-guide" style={{
                  fontSize: '12px',
                  color: '#bbb',
                  textDecoration: 'none',
                }}>
                  → Prevention Guide
                </a>
              </div>
            </div>

            {/* OFFICIAL SOURCES */}
            <div>
              <h4 style={{
                fontSize: '10px',
                fontWeight: '700',
                letterSpacing: '1px',
                margin: '0 0 12px 0',
                color: '#c0392b',
                textTransform: 'uppercase',
              }}>
                Official Sources
              </h4>
              <div style={{ display: 'grid', gap: '8px' }}>
                <a href="https://www.who.int" target="_blank" rel="noopener noreferrer" style={{
                  fontSize: '12px',
                  color: '#bbb',
                  textDecoration: 'none',
                }}>
                  WHO
                </a>
                <a href="https://www.cdc.gov" target="_blank" rel="noopener noreferrer" style={{
                  fontSize: '12px',
                  color: '#bbb',
                  textDecoration: 'none',
                }}>
                  CDC
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RESPONSIVE CSS */}
      <style>{`
        @media (max-width: 768px) {
          .main-layout {
            grid-template-columns: 1fr !important;
          }
          .breaking-featured {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
