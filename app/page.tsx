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

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeElapsed, setTimeElapsed] = useState('Updated 2 hours ago');

  const breakingArticles = articles.filter(a => a.isBreaking);
  const originalArticles = articles.slice(0, 6);

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

  const filteredArticles = searchTerm.trim() === '' 
    ? originalArticles 
    : originalArticles.filter(a => 
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff' }}>
      {/* BREAKING NEWS BANNER */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: '#c0392b',
        color: 'white',
        padding: '12px 32px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: breakingArticles.length > 0 ? 'block' : 'none',
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
          <strong>{breakingArticles.length > 0 ? breakingArticles[0].title : ''}</strong>
          <span style={{ marginLeft: 'auto', opacity: 0.9, fontSize: '12px' }}>
            {timeElapsed}
          </span>
        </div>
      </div>

      {/* HEADER */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #e0e0e0',
        padding: '24px 32px',
        marginTop: breakingArticles.length > 0 ? '50px' : '0',
        position: 'sticky',
        top: breakingArticles.length > 0 ? '50px' : '0',
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
            placeholder="Search guides..."
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
        {/* MAIN CONTENT */}
        <main>
          {/* FEATURED ORIGINAL ARTICLES */}
          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: '#1a1a1a' }}>
              Our Research & Guides
            </h2>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
              In-depth analysis and comprehensive guides written by our team
            </p>
            <div style={{ display: 'grid', gap: '20px' }}>
              {filteredArticles.map((article) => {
                const imageUrl = articleImages[article.slug];
                return (
                  <article key={article.id} style={{
                    background: 'white',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid #e0e0e0',
                    display: 'grid',
                    gridTemplateColumns: '200px 1fr',
                    gap: 0,
                  }}>
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
                          alt={article.title}
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
                          textAlign: 'center',
                        }}>
                          Image
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{
                          display: 'inline-block',
                          background: '#f5f5f5',
                          color: '#555',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '600',
                          marginBottom: '10px',
                          textTransform: 'uppercase',
                        }}>
                          {article.category}
                        </div>
                        <h3 style={{
                          fontSize: '16px',
                          fontWeight: '700',
                          margin: '8px 0',
                          lineHeight: '1.3',
                          color: '#1a1a1a',
                        }}>
                          {article.title}
                        </h3>
                        <p style={{
                          fontSize: '13px',
                          color: '#666',
                          margin: '8px 0',
                          lineHeight: '1.5',
                        }}>
                          {article.excerpt}
                        </p>
                      </div>
                      <a href={`/articles/${article.slug}`} style={{
                        display: 'inline-block',
                        color: '#2d2d2d',
                        fontWeight: '600',
                        fontSize: '13px',
                        textDecoration: 'none',
                        marginTop: '12px',
                      }}>
                        Read full article →
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* LATEST NEWS FROM SOURCES */}
          <section>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: '#1a1a1a' }}>
              Latest News From Official Sources
            </h2>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
              Curated updates from WHO, CDC, and international media
            </p>
            <div style={{ display: 'grid', gap: '16px' }}>
              {/* SAMPLE NEWS ITEMS - Replace with dynamic data from Make.com */}
              <div style={{
                background: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                padding: '20px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', color: '#999', marginBottom: '6px' }}>
                      <strong>NDTV Health</strong> • May 9, 2026
                    </div>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '6px 0', color: '#1a1a1a' }}>
                      MV Hondius Cruise Ship: Passengers to Evacuate at Canary Islands
                    </h3>
                    <p style={{ fontSize: '13px', color: '#666', margin: '8px 0' }}>
                      WHO implements comprehensive screening and contact tracing protocols as cruise ship prepares for evacuation operations.
                    </p>
                  </div>
                  <a href="https://www.ndtv.com/health/hantavirus-cruise-ship-passengers-to-evacuate-at-canary-islands-soon-who-shares-screening-contact-tracing-plans-11470796" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     style={{
                       color: '#2d2d2d',
                       fontWeight: '600',
                       fontSize: '12px',
                       textDecoration: 'none',
                       whiteSpace: 'nowrap',
                       padding: '8px 14px',
                       background: '#f5f5f5',
                       borderRadius: '4px',
                     }}>
                    Read source →
                  </a>
                </div>
              </div>

              <div style={{
                background: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                padding: '20px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', color: '#999', marginBottom: '6px' }}>
                      <strong>Deutsche Welle</strong> • May 7, 2026
                    </div>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '6px 0', color: '#1a1a1a' }}>
                      Hantavirus: American CDC Says Risk to Public 'Very Low'
                    </h3>
                    <p style={{ fontSize: '13px', color: '#666', margin: '8px 0' }}>
                      Live update on CDC monitoring, medical evacuations, and public health risk assessment around the MV Hondius outbreak.
                    </p>
                  </div>
                  <a href="https://www.dw.com/en/hantavirus-american-cdc-says-risk-to-public-very-low/live-77063670" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     style={{
                       color: '#2d2d2d',
                       fontWeight: '600',
                       fontSize: '12px',
                       textDecoration: 'none',
                       whiteSpace: 'nowrap',
                       padding: '8px 14px',
                       background: '#f5f5f5',
                       borderRadius: '4px',
                     }}>
                    Read source →
                  </a>
                </div>
              </div>

              <div style={{
                background: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                padding: '20px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', color: '#999', marginBottom: '6px' }}>
                      <strong>BBC News</strong> • May 7, 2026
                    </div>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '6px 0', color: '#1a1a1a' }}>
                      Hantavirus-Hit Cruise Ship on Way to Canary Islands After Three Evacuated
                    </h3>
                    <p style={{ fontSize: '13px', color: '#666', margin: '8px 0' }}>
                      Update on the cruise ship's route and the medical evacuation of three confirmed cases to Spanish ports.
                    </p>
                  </div>
                  <a href="https://www.bbc.com/news/articles/c5y093d5n9ko" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     style={{
                       color: '#2d2d2d',
                       fontWeight: '600',
                       fontSize: '12px',
                       textDecoration: 'none',
                       whiteSpace: 'nowrap',
                       padding: '8px 14px',
                       background: '#f5f5f5',
                       borderRadius: '4px',
                     }}>
                    Read source →
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* SIDEBAR - ALWAYS VISIBLE */}
        <aside style={{ position: 'sticky', top: breakingArticles.length > 0 ? '146px' : '96px', height: 'fit-content' }}>
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
              Disclaimer
            </h3>
            <p style={{ fontSize: '12px', color: '#666', lineHeight: '1.5', margin: 0 }}>
              Not medical advice. For urgent concerns, follow official health authority guidance.
            </p>
          </div>

          {/* STATS */}
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
                <span style={{ fontSize: '12px', color: '#666' }}>Mortality Rate</span>
                <strong style={{ fontSize: '18px', color: '#2d2d2d' }}>{outbreakStats.mortality}</strong>
              </div>
            </div>
            <p style={{ fontSize: '11px', color: '#999', marginTop: '12px', marginBottom: 0 }}>
              Last updated: {outbreakStats.lastUpdated}
            </p>
          </div>

          {/* QUICK LINKS */}
          <div style={{
            background: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            padding: '20px',
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', color: '#1a1a1a' }}>
              Essential Reading
            </h3>
            <div style={{ display: 'grid', gap: '8px' }}>
              <a href="/articles/what-is-hantavirus" style={{
                display: 'block',
                fontSize: '12px',
                color: '#2d2d2d',
                textDecoration: 'none',
                fontWeight: '500',
              }}>
                → What is Hantavirus?
              </a>
              <a href="/articles/hantavirus-symptoms-warning-signs" style={{
                display: 'block',
                fontSize: '12px',
                color: '#2d2d2d',
                textDecoration: 'none',
                fontWeight: '500',
              }}>
                → Symptoms & Warning Signs
              </a>
              <a href="/articles/hantavirus-prevention-guide" style={{
                display: 'block',
                fontSize: '12px',
                color: '#2d2d2d',
                textDecoration: 'none',
                fontWeight: '500',
              }}>
                → Prevention Guide
              </a>
            </div>
          </div>

          {/* SOURCES */}
          <div style={{
            background: '#f9f9f9',
            borderRadius: '6px',
            padding: '16px',
            marginTop: '20px',
          }}>
            <h4 style={{ fontSize: '12px', fontWeight: '700', marginBottom: '10px', color: '#1a1a1a', textTransform: 'uppercase' }}>
              Official Sources
            </h4>
            <div style={{ display: 'grid', gap: '8px' }}>
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
                CDC (US)
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
