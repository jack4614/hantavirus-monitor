/** @type {import('next').NextConfig} */

// Old article URLs from the May 2026 site, sent to the closest new page.
const moved = {
  'what-is-hantavirus': '/',
  'hantavirus-symptoms-warning-signs': '/symptoms',
  'andes-virus-transmission': '/transmission',
  'hantavirus-prevention-guide': '/prevention',
  'mv-hondius-outbreak': '/mv-hondius-outbreak',
  'mv-hondius-canary-islands-evacuation': '/mv-hondius-outbreak',
  'hantavirus-vs-covid-19': '/',
  'hantavirus-treatment-options': '/',
  'argentina-hantavirus-outbreak': '/transmission',
  'rodent-borne-diseases': '/prevention',
  'healthcare-provider-hantavirus-guide': '/symptoms',
  'climate-change-hantavirus': '/',
  'hantavirus-vaccine-development': '/',
  'hantavirus-history-timeline': '/',
  'living-endemic-hantavirus-areas': '/prevention',
  'occupational-hantavirus-risk': '/prevention',
};

const nextConfig = {
  async redirects() {
    const rules = [];
    for (const [slug, destination] of Object.entries(moved)) {
      rules.push({ source: `/articles/${slug}`, destination, permanent: true });
      if (destination !== `/${slug}`) {
        rules.push({ source: `/${slug}`, destination, permanent: true });
      }
    }
    rules.push({ source: '/articles/:slug*', destination: '/', permanent: true });
    return rules;
  },
};

module.exports = nextConfig;
