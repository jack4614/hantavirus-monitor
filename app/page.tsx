'use client';

import { articles } from '@/articles';
import { outbreakStats } from '@/lib/stats';
import Image from 'next/image';
import { useState } from 'react';

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
  const breakingArticles = articles.filter(a => a.isBreaking);

  // Filter articles based on search
  const filteredArticles = searchTerm.trim() === '' 
    ? articles 
    : articles.filter(a => 
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.category.toLowerCase().includes(searchTerm.toLowerCase())
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
        padding: '16px 32px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: breakingArticles.length > 0 ? 'block' : 'none',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
        }}>
          <div style={{ fontSize: '20px' }}>🚨</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>
              Breaking News
            </div>
            <p style={{ fontSize: '17px', fontWeight: '600', margin: '2px 0' }}>
              {breakingArticles.length > 0 ? breakingArticles[0].title : ''}
            </p>
            <p style={{ fontSize: '12px', opacity: 0.9, margin: '4px 0 0 0' }}>
              {outbreakStats.banner.subtitle}
            </p>
          </div>
          <a href={breakingArticles.length > 0 ? `/articles/${breakingArticles[0].slug}` : '#'} style={{
            background: 'white',
            color: '#c0392b',
            padding: '10px 18px',
            borderRadius: '6px',
            fontWeight: '700',
            fontSize: '13px',
            whiteSpace: 'nowrap',
            textDecoration: 'none',
          }}>
            Read More →
          </a>
        </div>
      </div>

      {/* HEADER */}
      <header style={{
        background: '#2d2d2d',
        color: 'white',
        padding: '20px 32px',
        marginTop: breakingArticles.length > 0 ? '80px' : '0',
        borderBottom: '1px solid #e0e0e0',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
        }}>
          <div style={{ fontSize: '22px', fontWeight: '600' }}>🚨 Hantavirus Updates</div>
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              maxWidth: '400px',
              padding: '10px 14px',
              border: '1px solid #555',
              borderRadius: '6px',
              background: '#3a3a3a',
              color: 'white',
              fontFamily: 'inherit',
              fontSize: '14px',
            }}
          />
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 32px',
      }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '10px', color: '#1a1a1a' }}>
          Latest News & Updates
        </h1>
        <p style={{ fontSize: '15px', color: '#666', marginBottom: '32px' }}>
          Breaking news and comprehensive information about the 2026 Hantavirus outbreak
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
          {/* ARTICLES */}
          <div>
            {filteredArticles.length === 0 ? (
              <div style={{
                background: 'white',
                borderRadius: '8px',
                padding: '40px',
                textAlign: 'center',
                border: '1px solid #e8e8e8',
              }}>
                <p style={{ fontSize: '18px', color: '#999', margin: 0 }}>
                  No articles found matching "{searchTerm}"
                </p>
              </div>
            ) : (
              filteredArticles.map((article) => {
              const imageUrl = articleImages[article.slug];
              return (
                <article key={article.id} style={{
                  background: 'white',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  marginBottom: '32px',
                  border: '1px solid #e8e8e8',
                }}>
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '320px',
                    background: '#f0f0f0',
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
                        color: '#999',
                        fontSize: '14px',
                      }}>
                        Featured Image
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '32px' }}>
                    <div style={{
                      display: 'inline-block',
                      background: '#f5f5f5',
                      color: '#555',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '600',
                      marginBottom: '16px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}>
                      {article.category}
                    </div>
                    <h2 style={{
                      fontSize: '22px',
                      fontWeight: '700',
                      marginBottom: '12px',
                      lineHeight: '1.4',
                      color: '#1a1a1a',
                    }}>
                      {article.title}
                    </h2>
                    <div style={{
                      display: 'flex',
                      gap: '16px',
                      fontSize: '12px',
                      color: '#999',
                      marginBottom: '16px',
                      paddingBottom: '16px',
                      borderBottom: '1px solid #e8e8e8',
                    }}>
                      <span>By {article.author}</span>
                      <span>•</span>
                      <span>May 2026</span>
                    </div>
                    <p style={{
                      fontSize: '15px',
                      lineHeight: '1.7',
                      color: '#555',
                      marginBottom: '24px',
                    }}>
                      {article.excerpt}
                    </p>
                    <a href={`/articles/${article.slug}`} style={{
                      display: 'inline-block',
                      background: '#2d2d2d',
                      color: 'white',
                      padding: '12px 24px',
                      borderRadius: '6px',
                      fontWeight: '600',
                      fontSize: '14px',
                      textDecoration: 'none',
                    }}>
                      Read Article →
                    </a>
                  </div>
                </article>
              );
            })
            )}
          </div>

          {/* SIDEBAR */}
          <div>
            {/* DISCLAIMER BOX */}
            <div style={{
              background: '#fff9e6',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '28px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              border: '1px solid #ffe8cc',
            }}>
              <div style={{ fontSize: '18px', marginBottom: '8px' }}>⚠️</div>
              <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px', color: '#1a1a1a' }}>
                Important Disclaimer
              </h3>
              <p style={{ fontSize: '12px', color: '#666', lineHeight: '1.6', margin: 0 }}>
                This website provides <strong>informational purposes only</strong> and is not a substitute for professional medical advice. We monitor official health sources (WHO, CDC, national health authorities) and curate updates for public awareness. Always consult healthcare professionals for medical guidance or concerns.
              </p>
            </div>

            {/* STATS */}
            <div style={{
              background: 'white',
              borderRadius: '8px',
              padding: '28px',
              marginBottom: '28px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              border: '1px solid #e8e8e8',
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: '#1a1a1a' }}>
                Outbreak Status
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{
                  textAlign: 'center',
                  padding: '16px',
                  background: '#f9f9f9',
                  borderRadius: '6px',
                  border: '1px solid #e8e8e8',
                }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#c0392b' }}>
                    {outbreakStats.cases}
                  </div>
                  <div style={{ fontSize: '12px', color: '#999', marginTop: '6px' }}>Cases</div>
                </div>
                <div style={{
                  textAlign: 'center',
                  padding: '16px',
                  background: '#f9f9f9',
                  borderRadius: '6px',
                  border: '1px solid #e8e8e8',
                }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#c0392b' }}>
                    {outbreakStats.deaths}
                  </div>
                  <div style={{ fontSize: '12px', color: '#999', marginTop: '6px' }}>Deaths</div>
                </div>
                <div style={{
                  textAlign: 'center',
                  padding: '16px',
                  background: '#f9f9f9',
                  borderRadius: '6px',
                  border: '1px solid #e8e8e8',
                }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#2d2d2d' }}>
                    {outbreakStats.countries}
                  </div>
                  <div style={{ fontSize: '12px', color: '#999', marginTop: '6px' }}>Countries</div>
                </div>
                <div style={{
                  textAlign: 'center',
                  padding: '16px',
                  background: '#f9f9f9',
                  borderRadius: '6px',
                  border: '1px solid #e8e8e8',
                }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#2d2d2d' }}>
                    {outbreakStats.mortality}
                  </div>
                  <div style={{ fontSize: '12px', color: '#999', marginTop: '6px' }}>Mortality</div>
                </div>
              </div>
              <p style={{ fontSize: '11px', color: '#999', marginTop: '12px' }}>
                Last updated: {outbreakStats.lastUpdated}
              </p>
            </div>

            {/* FEATURED */}
            <div style={{
              background: 'white',
              borderRadius: '8px',
              padding: '28px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              border: '1px solid #e8e8e8',
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: '#1a1a1a' }}>
                Featured Articles
              </h3>
              {articles.slice(0, 5).map((article) => (
                <a key={article.id} href={`/articles/${article.slug}`} style={{
                  display: 'block',
                  padding: '10px 12px',
                  background: '#f9f9f9',
                  borderRadius: '6px',
                  marginBottom: '8px',
                  color: '#555',
                  fontSize: '12px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  border: '1px solid #e8e8e8',
                }}>
                  {article.title}
                </a>
              ))}
            </div>
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
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            marginBottom: '32px',
            paddingBottom: '32px',
            borderBottom: '1px solid #e0e0e0',
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', color: '#1a1a1a' }}>
              About Hantavirus Updates
            </h3>
            <p style={{ fontSize: '13px', lineHeight: '1.6', margin: 0, color: '#666' }}>
              Hantavirus Updates is an independent news and information resource dedicated to tracking and reporting on the 2026 Hantavirus outbreak. We aggregate information from official health organizations including the World Health Organization (WHO), Centers for Disease Control and Prevention (CDC), and national health authorities. This website is for informational purposes only and does not provide medical advice. Always consult qualified healthcare professionals for medical guidance.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px',
            marginBottom: '32px',
          }}>
            <div>
              <h4 style={{ fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: '#1a1a1a', textTransform: 'uppercase' }}>
                Official Sources
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '6px' }}>
                  <a href='https://www.who.int' target='_blank' rel='noopener noreferrer' style={{ color: '#666', fontSize: '12px', textDecoration: 'none' }}>WHO</a>
                </li>
                <li style={{ marginBottom: '6px' }}>
                  <a href='https://www.cdc.gov' target='_blank' rel='noopener noreferrer' style={{ color: '#666', fontSize: '12px', textDecoration: 'none' }}>CDC</a>
                </li>
              </ul>
            </div>
          </div>

          <div style={{
            textAlign: 'center',
            paddingTop: '24px',
            borderTop: '1px solid #e0e0e0',
          }}>
            <p style={{ marginBottom: '8px', fontSize: '13px' }}>
              © 2026 Hantavirus Updates. All rights reserved.
            </p>
            <p style={{ fontSize: '11px', color: '#999', margin: 0 }}>
              Breaking news about the 2026 Hantavirus outbreak | Not a substitute for professional medical advice
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
