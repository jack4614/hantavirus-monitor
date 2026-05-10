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

  // Group articles by category
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
    <div style={{ minHeight: '100vh', background: '#ffffff', fontFamily: 'Georgia, "Times New Roman", serif', color: '#1a1a1a' }}>
      {/* TOP NAV */}
      <div style={{
        borderBottom: '1px solid #e0e0e0',
        padding: '12px 16px',
        fontSize: '12px',
        color: '#666',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        <span>{timeElapsed}</span>
      </div>

      {/* MASTHEAD */}
      <div style={{
        textAlign: 'center',
        padding: '40px 16px 20px',
        borderBottom: '2px solid #000',
      }}>
        <p style={{ fontSize: '12px', letterSpacing: '4px', margin: '0 0 10px 0', color: '#666' }}>
          HANTAVIRUS UPDATES
        </p>
        <h1 style={{
          fontSize: '52px',
          fontWeight: '900',
          margin: '0 0 10px 0',
          letterSpacing: '2px',
        }}>
          OUTBREAK
        </h1>
        <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
          Breaking news & comprehensive analysis
        </p>
      </div>

      {/* NAV MENU */}
      <nav style={{
        display: 'flex',
        gap: '0',
        borderBottom: '1px solid #000',
        overflow: 'auto',
        padding: '0 16px',
      }}>
        <a href="#" style={{
          padding: '12px 16px',
          fontSize: '12px',
          fontWeight: '600',
          textDecoration: 'none',
          color: '#000',
          borderBottom: '3px solid #000',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          Home
        </a>
        <a href="#" style={{
          padding: '12px 16px',
          fontSize: '12px',
          fontWeight: '500',
          textDecoration: 'none',
          color: '#666',
          borderBottom: '3px solid transparent',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          Health
        </a>
        <a href="#" style={{
          padding: '12px 16px',
          fontSize: '12px',
          fontWeight: '500',
          textDecoration: 'none',
          color: '#666',
          borderBottom: '3px solid transparent',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          Prevention
        </a>
        <a href="#" style={{
          padding: '12px 16px',
          fontSize: '12px',
          fontWeight: '500',
          textDecoration: 'none',
          color: '#666',
          borderBottom: '3px solid transparent',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          Travel
        </a>
      </nav>

      {/* FEATURED ARTICLES GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '20px',
        padding: '30px 16px',
        borderBottom: '2px solid #000',
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
              paddingBottom: idx < 2 ? '20px' : '0',
              borderBottom: idx < 2 ? '1px solid #e0e0e0' : 'none',
            }}>
              <h3 style={{
                fontSize: '11px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                margin: 0,
                color: '#666',
              }}>
                {cat}
              </h3>
              <a href={catItems[0].type === 'article' ? `/articles/${catItems[0].slug}` : catItems[0].sourceUrl} target={catItems[0].type === 'news' ? '_blank' : undefined} rel={catItems[0].type === 'news' ? 'noopener noreferrer' : undefined} style={{
                textDecoration: 'none',
                color: '#000',
              }}>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  margin: 0,
                  lineHeight: '1.2',
                }}>
                  {catItems[0].type === 'article' ? catItems[0].title : catItems[0].headline}
                </h2>
              </a>
            </div>
          );
        })}
      </div>

      {/* MAIN LAYOUT - BREAKING NEWS + DAILY FEED */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '30px',
        padding: '30px 16px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
      className="main-grid"
      >
        {/* LEFT: BREAKING NEWS */}
        {breakingItem && (
          <section style={{ borderBottom: '2px solid #000', paddingBottom: '30px' }}>
            <h2 style={{
              fontSize: '22px',
              fontWeight: '700',
              margin: '0 0 20px 0',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}>
              Breaking News
            </h2>

            <a
              href={breakingItem.type === 'article' ? `/articles/${breakingItem.slug}` : breakingItem.sourceUrl}
              target={breakingItem.type === 'news' ? '_blank' : undefined}
              rel={breakingItem.type === 'news' ? 'noopener noreferrer' : undefined}
              style={{
                textDecoration: 'none',
                color: '#000',
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '16px',
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
                <h3 style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  margin: '0 0 12px 0',
                  lineHeight: '1.2',
                }}>
                  {breakingItem.type === 'article' ? breakingItem.title : breakingItem.headline}
                </h3>
                <p style={{
                  fontSize: '15px',
                  margin: '0 0 12px 0',
                  lineHeight: '1.6',
                  color: '#333',
                }}>
                  {breakingItem.type === 'article' ? breakingItem.excerpt : breakingItem.summary}
                </p>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: '#c0392b',
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
            fontSize: '22px',
            fontWeight: '700',
            margin: '0 0 20px 0',
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}>
            Daily Feed
          </h2>

          {/* Search */}
          <input
            type="text"
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #e0e0e0',
              fontSize: '13px',
              marginBottom: '20px',
              fontFamily: 'inherit',
            }}
          />

          {/* Categories */}
          <div style={{ display: 'grid', gap: '30px' }}>
            {Object.entries(categorized).map(([category, items]) => (
              <div key={category}>
                <h3 style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  margin: '0 0 16px 0',
                  color: '#666',
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
                          color: '#000',
                          paddingBottom: '16px',
                          borderBottom: '1px solid #e0e0e0',
                        }}
                      >
                        <h4 style={{
                          fontSize: '14px',
                          fontWeight: '700',
                          margin: '0 0 6px 0',
                          lineHeight: '1.3',
                        }}>
                          {title}
                        </h4>
                        <p style={{
                          fontSize: '12px',
                          color: '#666',
                          margin: '0',
                          lineHeight: '1.5',
                        }}>
                          {summary.length > 100 ? summary.substring(0, 100) + '...' : summary}
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

      {/* SIDEBAR - BOTTOM ON MOBILE */}
      <div style={{
        borderTop: '2px solid #000',
        padding: '30px 16px',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '30px',
      }}
      className="sidebar-grid"
      >
        {/* Outbreak Status */}
        <div>
          <h3 style={{
            fontSize: '11px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            margin: '0 0 16px 0',
          }}>
            Current Status
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <p style={{ fontSize: '11px', color: '#666', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Cases</p>
              <p style={{ fontSize: '20px', fontWeight: '700', margin: 0, color: '#c0392b' }}>{outbreakStats.cases}</p>
            </div>
            <div>
              <p style={{ fontSize: '11px', color: '#666', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Deaths</p>
              <p style={{ fontSize: '20px', fontWeight: '700', margin: 0, color: '#c0392b' }}>{outbreakStats.deaths}</p>
            </div>
            <div>
              <p style={{ fontSize: '11px', color: '#666', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Countries</p>
              <p style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>{outbreakStats.countries}</p>
            </div>
            <div>
              <p style={{ fontSize: '11px', color: '#666', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Mortality</p>
              <p style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>{outbreakStats.mortality}</p>
            </div>
          </div>
        </div>

        {/* Medical Disclaimer */}
        <div>
          <h3 style={{
            fontSize: '11px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            margin: '0 0 12px 0',
          }}>
            ⚠️ Medical Disclaimer
          </h3>
          <p style={{
            fontSize: '12px',
            lineHeight: '1.5',
            color: '#666',
            margin: 0,
          }}>
            This content is for informational purposes only and is not a substitute for professional medical advice. Contact your healthcare provider for urgent concerns.
          </p>
        </div>

        {/* Essential Reading */}
        <div>
          <h3 style={{
            fontSize: '11px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            margin: '0 0 12px 0',
          }}>
            Essential Reading
          </h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            <a href="/articles/what-is-hantavirus" style={{
              fontSize: '12px',
              color: '#666',
              textDecoration: 'none',
            }}>
              → What is Hantavirus?
            </a>
            <a href="/articles/hantavirus-symptoms-warning-signs" style={{
              fontSize: '12px',
              color: '#666',
              textDecoration: 'none',
            }}>
              → Symptoms & Warning Signs
            </a>
            <a href="/articles/hantavirus-prevention-guide" style={{
              fontSize: '12px',
              color: '#666',
              textDecoration: 'none',
            }}>
              → Prevention Guide
            </a>
          </div>
        </div>

        {/* Official Sources */}
        <div>
          <h3 style={{
            fontSize: '11px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            margin: '0 0 12px 0',
          }}>
            Official Sources
          </h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            <a href="https://www.who.int" target="_blank" rel="noopener noreferrer" style={{
              fontSize: '12px',
              color: '#666',
              textDecoration: 'none',
            }}>
              World Health Organization
            </a>
            <a href="https://www.cdc.gov" target="_blank" rel="noopener noreferrer" style={{
              fontSize: '12px',
              color: '#666',
              textDecoration: 'none',
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
