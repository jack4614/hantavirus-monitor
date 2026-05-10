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
    summary: 'Update on the cruise ship route change and medical evacuation of confirmed cases.',
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

  return (
    <div style={{ minHeight: '100vh', background: '#faf9f6', color: '#2d2d2d' }}>
      {/* TOP NAV */}
      <div style={{
        borderBottom: '1px solid #e8e6e1',
        padding: '14px 20px',
        fontSize: '12px',
        color: '#888',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        background: '#fff',
      }}>
        <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        <span>{timeElapsed}</span>
      </div>

      {/* MASTHEAD */}
      <div style={{
        textAlign: 'center',
        padding: '50px 20px 30px',
        borderBottom: '1px solid #e8e6e1',
        background: '#fff',
      }}>
        <p style={{ fontSize: '11px', letterSpacing: '3px', margin: '0 0 12px 0', color: '#999', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: '500' }}>
          HANTAVIRUS UPDATES
        </p>
        <h1 style={{
          fontSize: '56px',
          fontWeight: '900',
          margin: '0 0 12px 0',
          letterSpacing: '1px',
          fontFamily: 'Georgia, "Times New Roman", serif',
        }}>
          OUTBREAK
        </h1>
        <p style={{ fontSize: '14px', color: '#888', margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
          Breaking news & comprehensive analysis
        </p>
      </div>

      {/* NAV MENU */}
      <nav style={{
        display: 'flex',
        gap: '0',
        borderBottom: '1px solid #e8e6e1',
        overflow: 'auto',
        padding: '0 20px',
        background: '#fff',
      }}>
        <a href="#" style={{
          padding: '12px 16px',
          fontSize: '12px',
          fontWeight: '600',
          textDecoration: 'none',
          color: '#2d2d2d',
          borderBottom: '2px solid #c0392b',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}>
          Home
        </a>
        <a href="#" style={{
          padding: '12px 16px',
          fontSize: '12px',
          fontWeight: '500',
          textDecoration: 'none',
          color: '#999',
          borderBottom: '2px solid transparent',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}>
          Health
        </a>
        <a href="#" style={{
          padding: '12px 16px',
          fontSize: '12px',
          fontWeight: '500',
          textDecoration: 'none',
          color: '#999',
          borderBottom: '2px solid transparent',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}>
          Prevention
        </a>
        <a href="#" style={{
          padding: '12px 16px',
          fontSize: '12px',
          fontWeight: '500',
          textDecoration: 'none',
          color: '#999',
          borderBottom: '2px solid transparent',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}>
          Travel
        </a>
      </nav>

      {/* FEATURED ARTICLES GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '0',
        padding: '30px 20px',
        background: '#fff',
        borderBottom: '1px solid #e8e6e1',
      }}
      className="featured-grid"
      >
        {['HEALTH', 'PREVENTION', 'TRAVEL'].map((cat, idx) => {
          const catItems = filteredFeed.filter(item => 
            (item.type === 'article' ? item.category : item.source).toUpperCase() === cat.toUpperCase()
          ).slice(0, 1);

          return catItems.length > 0 && (
            <div key={cat} style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '12px',
              paddingBottom: idx < 2 ? '24px' : '0',
              borderBottom: idx < 2 ? '1px solid #e8e6e1' : 'none',
            }}>
              <h3 style={{
                fontSize: '10px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                margin: 0,
                color: '#c0392b',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              }}>
                {cat}
              </h3>
              <a href={catItems[0].type === 'article' ? `/articles/${catItems[0].slug}` : catItems[0].sourceUrl} target={catItems[0].type === 'news' ? '_blank' : undefined} rel={catItems[0].type === 'news' ? 'noopener noreferrer' : undefined} style={{
                textDecoration: 'none',
                color: '#2d2d2d',
              }}>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  margin: 0,
                  lineHeight: '1.2',
                  fontFamily: 'Georgia, "Times New Roman", serif',
                }}>
                  {catItems[0].type === 'article' ? catItems[0].title : catItems[0].headline}
                </h2>
              </a>
            </div>
          );
        })}
      </div>

      {/* MAIN LAYOUT */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '30px',
        padding: '30px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
      className="main-grid"
      >
        {/* LEFT: BREAKING NEWS */}
        {breakingItem && (
          <section style={{ paddingBottom: '30px', borderBottom: '1px solid #e8e6e1' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '700',
              margin: '0 0 20px 0',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              color: '#2d2d2d',
            }}>
              Breaking News
            </h2>

            <a
              href={breakingItem.type === 'article' ? `/articles/${breakingItem.slug}` : breakingItem.sourceUrl}
              target={breakingItem.type === 'news' ? '_blank' : undefined}
              rel={breakingItem.type === 'news' ? 'noopener noreferrer' : undefined}
              style={{
                textDecoration: 'none',
                color: '#2d2d2d',
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '18px',
                background: '#fff',
                padding: '20px',
                borderRadius: '4px',
                border: '1px solid #e8e6e1',
              }}
            >
              {/* Image */}
              {(breakingItem.type === 'article' 
                ? articleImages[breakingItem.slug] 
                : breakingItem.imageUrl) && (
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '280px',
                  borderRadius: '3px',
                  overflow: 'hidden',
                }}>
                  <Image
                    src={breakingItem.type === 'article' 
                      ? articleImages[breakingItem.slug] 
                      : breakingItem.imageUrl}
                    alt={breakingItem.type === 'article' ? breakingItem.title : breakingItem.headline}
                    fill
                    unoptimized
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              )}

              {/* Content */}
              <div>
                <span style={{
                  display: 'inline-block',
                  background: '#c0392b',
                  color: 'white',
                  padding: '4px 10px',
                  fontSize: '10px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  borderRadius: '2px',
                  marginBottom: '12px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}>
                  ⚡ Breaking
                </span>
                <h3 style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  margin: '12px 0',
                  lineHeight: '1.2',
                  fontFamily: 'Georgia, "Times New Roman", serif',
                }}>
                  {breakingItem.type === 'article' ? breakingItem.title : breakingItem.headline}
                </h3>
                <p style={{
                  fontSize: '15px',
                  margin: '12px 0',
                  lineHeight: '1.6',
                  color: '#666',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}>
                  {breakingItem.type === 'article' ? breakingItem.excerpt : breakingItem.summary}
                </p>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: '#c0392b',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}>
                  {breakingItem.type === 'article' ? 'Read article →' : `Read at ${breakingItem.source} →`}
                </span>
              </div>
            </a>
          </section>
        )}

        {/* RIGHT: DAILY FEED */}
        <section>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '700',
            margin: '0 0 20px 0',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            color: '#2d2d2d',
          }}>
            Daily Feed
          </h2>

          {/* Search */}
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '11px 14px',
              border: '1px solid #e8e6e1',
              fontSize: '13px',
              marginBottom: '24px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              background: '#fff',
              borderRadius: '3px',
              boxSizing: 'border-box',
              color: '#2d2d2d',
            }}
          />

          {/* Categories */}
          <div style={{ display: 'grid', gap: '28px' }}>
            {Object.entries(categorized).map(([category, items]) => (
              <div key={category}>
                <h3 style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  margin: '0 0 16px 0',
                  color: '#c0392b',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}>
                  {category}
                </h3>

                <div style={{ display: 'grid', gap: '16px' }}>
                  {items.slice(0, 3).map(item => {
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
                          color: '#2d2d2d',
                          padding: '14px',
                          background: '#fff',
                          border: '1px solid #e8e6e1',
                          borderRadius: '3px',
                          display: 'block',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.borderColor = '#c0392b';
                          (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 6px rgba(192, 57, 43, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.borderColor = '#e8e6e1';
                          (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                        }}
                      >
                        <h4 style={{
                          fontSize: '14px',
                          fontWeight: '700',
                          margin: '0 0 6px 0',
                          lineHeight: '1.3',
                          fontFamily: 'Georgia, "Times New Roman", serif',
                        }}>
                          {title}
                        </h4>
                        <p style={{
                          fontSize: '12px',
                          color: '#888',
                          margin: '0',
                          lineHeight: '1.5',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        }}>
                          {summary.length > 90 ? summary.substring(0, 90) + '...' : summary}
                        </p>
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* SIDEBAR */}
      <div style={{
        borderTop: '1px solid #e8e6e1',
        padding: '30px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '28px',
        background: '#fff',
      }}
      className="sidebar-grid"
      >
        {/* Outbreak Status */}
        <div>
          <h3 style={{
            fontSize: '10px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            margin: '0 0 16px 0',
            color: '#c0392b',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}>
            Current Status
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ padding: '14px', background: '#faf9f6', borderRadius: '3px' }}>
              <p style={{ fontSize: '10px', color: '#999', margin: '0 0 6px 0', textTransform: 'uppercase', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: '600' }}>Cases</p>
              <p style={{ fontSize: '24px', fontWeight: '700', margin: 0, color: '#c0392b', fontFamily: 'Georgia, "Times New Roman", serif' }}>{outbreakStats.cases}</p>
            </div>
            <div style={{ padding: '14px', background: '#faf9f6', borderRadius: '3px' }}>
              <p style={{ fontSize: '10px', color: '#999', margin: '0 0 6px 0', textTransform: 'uppercase', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: '600' }}>Deaths</p>
              <p style={{ fontSize: '24px', fontWeight: '700', margin: 0, color: '#c0392b', fontFamily: 'Georgia, "Times New Roman", serif' }}>{outbreakStats.deaths}</p>
            </div>
            <div style={{ padding: '14px', background: '#faf9f6', borderRadius: '3px' }}>
              <p style={{ fontSize: '10px', color: '#999', margin: '0 0 6px 0', textTransform: 'uppercase', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: '600' }}>Countries</p>
              <p style={{ fontSize: '24px', fontWeight: '700', margin: 0, fontFamily: 'Georgia, "Times New Roman", serif' }}>{outbreakStats.countries}</p>
            </div>
            <div style={{ padding: '14px', background: '#faf9f6', borderRadius: '3px' }}>
              <p style={{ fontSize: '10px', color: '#999', margin: '0 0 6px 0', textTransform: 'uppercase', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: '600' }}>Mortality</p>
              <p style={{ fontSize: '24px', fontWeight: '700', margin: 0, fontFamily: 'Georgia, "Times New Roman", serif' }}>{outbreakStats.mortality}</p>
            </div>
          </div>
        </div>

        {/* Medical Disclaimer */}
        <div style={{ padding: '16px', background: '#fff8e6', borderLeft: '4px solid #c0392b', borderRadius: '2px' }}>
          <h3 style={{
            fontSize: '10px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            margin: '0 0 8px 0',
            color: '#c0392b',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}>
            ⚠️ Medical Disclaimer
          </h3>
          <p style={{
            fontSize: '12px',
            lineHeight: '1.5',
            color: '#888',
            margin: 0,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}>
            Not medical advice. Contact your healthcare provider for urgent concerns.
          </p>
        </div>

        {/* Essential Reading */}
        <div>
          <h3 style={{
            fontSize: '10px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            margin: '0 0 12px 0',
            color: '#c0392b',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}>
            Essential Reading
          </h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            {[
              { href: '/articles/what-is-hantavirus', label: 'What is Hantavirus?' },
              { href: '/articles/hantavirus-symptoms-warning-signs', label: 'Symptoms & Warning Signs' },
              { href: '/articles/hantavirus-prevention-guide', label: 'Prevention Guide' },
            ].map(link => (
              <a key={link.href} href={link.href} style={{
                fontSize: '12px',
                color: '#c0392b',
                textDecoration: 'none',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontWeight: '500',
              }}>
                → {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Official Sources */}
        <div>
          <h3 style={{
            fontSize: '10px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            margin: '0 0 12px 0',
            color: '#c0392b',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}>
            Official Sources
          </h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            <a href="https://www.who.int" target="_blank" rel="noopener noreferrer" style={{
              fontSize: '12px',
              color: '#888',
              textDecoration: 'none',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}>
              World Health Organization
            </a>
            <a href="https://www.cdc.gov" target="_blank" rel="noopener noreferrer" style={{
              fontSize: '12px',
              color: '#888',
              textDecoration: 'none',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}>
              CDC (United States)
            </a>
          </div>
        </div>
      </div>

      {/* RESPONSIVE CSS */}
      <style>{`
        @media (min-width: 768px) {
          .featured-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 24px !important;
          }
          .main-grid {
            grid-template-columns: 2fr 1fr !important;
            gap: 40px !important;
          }
          .sidebar-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (min-width: 1024px) {
          .sidebar-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}
