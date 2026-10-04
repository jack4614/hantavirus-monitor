# hantavirus-updates.com

Static Next.js 14 site, deployed on Vercel from GitHub.

- Page text lives in `content/*.md` (frontmatter: title, seoTitle, description, lastReviewed). Edit text there, not in code.
- To add an update: add a row at the top of the table in `content/updates.md` and bump its `lastReviewed`.
- Routes and nav order are defined in `lib/content.ts`. Old URLs are redirected in `next.config.js`.
- Facts must come from WHO, CDC, ECDC or another health authority and be linked. No em dashes.
- Run `npm run build` before committing.
