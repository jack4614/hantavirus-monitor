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

const newsItems = [
  {
    feedId: 'news-001',
    type: 'news',
    source: 'NDTV Health',
    sourceUrl: 'https://www.ndtv.com/health/hantavirus-cruise-ship-passengers-to-evacuate-at-canary-islands-soon-who-shares-screening-contact-tracing-plans-11470796',
    date: new Date('2026-05-09T10:30:00'),
    headline: 'MV Hondius Cruise Ship: Passengers to Evacuate at Canary Islands',
    summary: 'WHO implements comprehensive screening and contact tracing protocols as cruise ship prepares for evacuation operations.',
    isBreaking: true,
    imageUrl: 'https://images.unsplash.com/photo-1559606063-bdf1b2c72f97?w=1200&h=630&fit=crop',
  },
  {
    feedId: 'news-002',
    type: 'news',
    source: 'BBC News',
    sourceUrl: 'https://www.bbc.com/news/articles/c4g8318v4yzo',
    date: new Date('2026-05-11T08:15:00'),
    headline: 'Hantavirus Cases Rise: Health Authorities Issue New Warnings',
    summary: 'Health officials warn of increased hantavirus transmission in multiple countries, with new cases reported daily. Authorities urge public to take precautions.',
    isBreaking: true,
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=630&fit=crop',
  },
  {
    feedId: 'news-003',
    type: 'news',
    source: 'Reuters',
    sourceUrl: 'https://www.reuters.com/business/healthcare-pharmaceuticals/who-says-seven-cases-hantavirus-confirmed-cruise-ship-2026-05-11/',
    date: new Date('2026-05-11T06:45:00'),
    headline: 'WHO Confirms Seven Hantavirus Cases on Cruise Ship',
    summary: 'World Health Organization officially confirms seventh case of Hantavirus on MV Hondius. Medical teams coordinate response across multiple regions.',
    isBreaking: true,
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=630&fit=crop',
  },
  {
    feedId: 'news-004',
    type: 'news',
    source: 'BBC News',
    sourceUrl: 'https://www.bbc.com/news/articles/cjep78l5835o',
    date: new Date('2026-05-10T14:20:00'),
    headline: 'Hantavirus Outbreak Spreads to South America',
    summary: 'New hantavirus cases confirmed in South America as global health agencies coordinate response. Early detection saves lives, say experts.',
    isBreaking: true,
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669714d2e9d8?w=1200&h=630&fit=crop',
  },
  {
    feedId: 'news-005',
    type: 'news',
    source: 'Deutsche Welle',
    sourceUrl: 'https://www.dw.com/en/hantavirus-american-cdc-says-risk-to-public-very-low/live-77063670',
    date: new Date('2026-05-07T14:20:00'),
    headline: 'Hantavirus: American CDC Says Risk to Public "Very Low"',
    summary: 'Live update on CDC monitoring and public health risk assessment.',
    isBreaking: true,
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=630&fit=crop',
  },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeElapsed, setTimeElapsed] = useState('Updated 2 hours ago');
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
      else if (diffMins < 60) time = `${diffMins}m ago`;
      else if (diffHours < 24) time = `${diffHours}h ago`;
      else time = `${diffDays}d ago`;

      setTimeElapsed(`Updated ${time}`);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const allBreaking = [...articles.filter(a => a.isBreaking), ...newsItems];
    if (allBreaking.length === 0) return;
    const timer = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % allBreaking.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const allBreaking = [...articles.filter(a => a.isBreaking), ...newsItems];
  const currentNews = allBreaking[tickerIndex];
  const breakingArticles = articles.filter(a => a.isBreaking);
  const breakingItem = breakingArticles.length > 0 ? breakingArticles[0] : null;

  const getNewsUrl = (item: any) => {
    if (item.type === 'article') {
      return `/articles/${item.slug}`;
    }
    return item.sourceUrl;
  };

  const getNewsTitle = (item: any) => {
    return item.type === 'article' ? item.title : item.headline;
  };

  const filtered = searchTerm.trim() === ''
    ? articles.filter(a => !a.isBreaking)
    : articles.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()) || a.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));

  const grouped: { [key: string]: any[] } = {};
  
  filtered.forEach(a => {
    if (!grouped[a.category]) grouped[a.category] = [];
    grouped[a.category].push({
      feedId: `article-${a.id}`,
      type: 'article',
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt,
      source: a.category,
      url: `/articles/${a.slug}`,
      isExternal: false,
    });
  });

  newsItems.forEach(n => {
    const source = n.source;
    if (!grouped[source]) grouped[source] = [];
    grouped[source].push({
      feedId: n.feedId,
      type: 'news',
      title: n.headline,
      excerpt: n.summary,
      url: n.sourceUrl,
      source: n.source,
      isExternal: true,
    });
  });

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a1a', color: '#f0f0f0', fontFamily: 'system-ui' }}>
      {currentNews && (
        <div style={{ background: '#c0392b', color: 'white', padding: '12px 20px', display: 'flex', gap: '16px', cursor: 'pointer' }} onClick={() => window.location.href = getNewsUrl(currentNews)}>
          <span style={{ fontWeight: '700', whiteSpace: 'nowrap' }}>⚡ BREAKING</span>
          <p style={{ margin: 0, flex: 1 }}>{getNewsTitle(currentNews)}</p>
          <span style={{ fontSize: '11px' }}>{tickerIndex + 1} of {allBreaking.length}</span>
        </div>
      )}

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px', paddingBottom: '24px', borderBottom: '1px solid #333' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '48px', fontWeight: '700', fontFamily: 'Georgia, serif' }}>Hantavirus Updates</h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#aaa' }}>Breaking news & comprehensive coverage</p>
        </div>

        <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'center' }}>
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '10px 14px', border: '1px solid #333', borderRadius: '4px', width: '100%', maxWidth: '380px', fontSize: '13px', background: '#222', color: '#f0f0f0' }}
          />
        </div>

        {breakingItem && (
          <a href={`/articles/${breakingItem.slug}`} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', marginBottom: '40px', border: '1px solid #333', borderRadius: '4px', background: '#222', textDecoration: 'none', color: '#f0f0f0', overflow: 'hidden' }}>
            <div style={{ position: 'relative', height: '340px', background: '#333' }}>
              {articleImages[breakingItem.slug] && (
                <Image src={articleImages[breakingItem.slug]} alt={breakingItem.title} fill priority style={{ objectFit: 'cover' }} />
              )}
            </div>
            <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '10px', color: '#c0392b', fontWeight: '700' }}>⚡ Breaking News</p>
              <h2 style={{ margin: '0 0 14px 0', fontSize: '28px', fontWeight: '700', lineHeight: '1.2', fontFamily: 'Georgia, serif' }}>{breakingItem.title}</h2>
              <p style={{ margin: '0', fontSize: '14px', color: '#bbb', lineHeight: '1.6' }}>{breakingItem.excerpt}</p>
            </div>
          </a>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
          <div>
            <h3 style={{ fontSize: '12px', fontWeight: '700', margin: '0 0 24px 0', color: '#c0392b', textTransform: 'uppercase' }}>Daily Feed</h3>
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category} style={{ marginBottom: '28px' }}>
                <p style={{ fontSize: '10px', fontWeight: '700', margin: '0 0 16px 0', color: '#0066cc', textTransform: 'uppercase' }}>{category}</p>
                {items.slice(0, 3).map(item => (
                  <a key={item.feedId} href={item.url} target={item.isExternal ? '_blank' : undefined} rel={item.isExternal ? 'noopener noreferrer' : undefined} style={{ display: 'block', textDecoration: 'none', color: '#f0f0f0', borderLeft: '3px solid #0066cc', paddingLeft: '16px', marginBottom: '18px' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: '600', fontFamily: 'Georgia, serif' }}>{item.title}</h4>
                    <p style={{ margin: '0', fontSize: '12px', color: '#999' }}>{item.excerpt.substring(0, 100)}...</p>
                    <span style={{ fontSize: '10px', color: '#0066cc', display: 'block', marginTop: '4px' }}>{item.isExternal ? `Read at ${item.source} →` : 'Read article →'}</span>
                  </a>
                ))}
              </div>
            ))}
          </div>

          <div>
            <div style={{ marginBottom: '28px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: '700', margin: '0 0 16px 0', color: '#c0392b', textTransform: 'uppercase' }}>Status</h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ background: '#222', border: '1px solid #333', borderRadius: '4px', padding: '14px' }}>
                  <p style={{ margin: '0 0 6px 0', fontSize: '10px', color: '#888' }}>Confirmed Cases</p>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#c0392b' }}>{outbreakStats.cases}</p>
                </div>
                <div style={{ background: '#222', border: '1px solid #333', borderRadius: '4px', padding: '14px' }}>
                  <p style={{ margin: '0 0 6px 0', fontSize: '10px', color: '#888' }}>Deaths</p>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#c0392b' }}>{outbreakStats.deaths}</p>
                </div>
                <div style={{ background: '#222', border: '1px solid #333', borderRadius: '4px', padding: '14px' }}>
                  <p style={{ margin: '0 0 6px 0', fontSize: '10px', color: '#888' }}>Mortality</p>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>{outbreakStats.mortality}</p>
                </div>
                <div style={{ background: '#222', border: '1px solid #333', borderRadius: '4px', padding: '14px' }}>
                  <p style={{ margin: '0 0 6px 0', fontSize: '10px', color: '#888' }}>Countries</p>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>{outbreakStats.countries}</p>
                </div>
              </div>
              <p style={{ margin: '12px 0 0 0', fontSize: '10px', color: '#666' }}>{timeElapsed}</p>
            </div>

            <div style={{ background: '#222', border: '1px solid #c0392b', borderLeft: '3px solid #c0392b', borderRadius: '4px', padding: '14px', marginBottom: '20px' }}>
              <h4 style={{ fontSize: '10px', fontWeight: '700', margin: '0 0 8px 0', color: '#c0392b' }}>Medical Disclaimer</h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>Not medical advice. Contact your healthcare provider.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
