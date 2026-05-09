import { createClient } from 'contentful';

const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
});

const previewClient = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN,
  host: 'preview.contentful.com',
});

/**
 * Get all articles
 * @param {string} locale - 'en' or 'de'
 * @param {boolean} preview - Use preview API
 */
export async function getArticles(locale = 'en', preview = false) {
  const ctfClient = preview ? previewClient : client;

  try {
    const entries = await ctfClient.getEntries({
      content_type: 'article',
      locale: locale === 'de' ? 'de-DE' : 'en-US',
      order: '-sys.createdAt',
      limit: 50,
    });

    return entries.items.map(item => ({
      id: item.sys.id,
      title: item.fields.title,
      slug: item.fields.slug,
      excerpt: item.fields.excerpt,
      content: item.fields.content,
      category: item.fields.category,
      isBreaking: item.fields.isBreaking || false,
      publishedAt: item.sys.publishedAt || item.sys.createdAt,
      updatedAt: item.sys.updatedAt,
      featuredImage: item.fields.featuredImage
        ? {
            url: item.fields.featuredImage.fields.file.url,
            title: item.fields.featuredImage.fields.title,
          }
        : null,
      author: item.fields.author || 'Hantavirus Monitor',
    }));
  } catch (error) {
    console.error('Error fetching articles from Contentful:', error);
    return [];
  }
}

/**
 * Get single article by slug
 */
export async function getArticleBySlug(slug, locale = 'en', preview = false) {
  const ctfClient = preview ? previewClient : client;

  try {
    const entries = await ctfClient.getEntries({
      content_type: 'article',
      'fields.slug': slug,
      locale: locale === 'de' ? 'de-DE' : 'en-US',
      limit: 1,
    });

    if (!entries.items.length) return null;

    const item = entries.items[0];

    return {
      id: item.sys.id,
      title: item.fields.title,
      slug: item.fields.slug,
      excerpt: item.fields.excerpt,
      content: item.fields.content,
      category: item.fields.category,
      isBreaking: item.fields.isBreaking || false,
      publishedAt: item.sys.publishedAt || item.sys.createdAt,
      updatedAt: item.sys.updatedAt,
      featuredImage: item.fields.featuredImage
        ? {
            url: `https:${item.fields.featuredImage.fields.file.url}`,
            title: item.fields.featuredImage.fields.title,
          }
        : null,
      author: item.fields.author || 'Hantavirus Monitor',
      relatedArticles: item.fields.relatedArticles || [],
    };
  } catch (error) {
    console.error('Error fetching article from Contentful:', error);
    return null;
  }
}

/**
 * Get latest article marked as "breaking"
 */
export async function getLatestBreakingArticle(locale = 'en', preview = false) {
  const ctfClient = preview ? previewClient : client;

  try {
    const entries = await ctfClient.getEntries({
      content_type: 'article',
      'fields.isBreaking': true,
      locale: locale === 'de' ? 'de-DE' : 'en-US',
      order: '-sys.publishedAt',
      limit: 1,
    });

    if (!entries.items.length) return null;

    const item = entries.items[0];

    return {
      id: item.sys.id,
      title: item.fields.title,
      slug: item.fields.slug,
      excerpt: item.fields.excerpt,
      publishedAt: item.sys.publishedAt || item.sys.createdAt,
      featuredImage: item.fields.featuredImage
        ? {
            url: `https:${item.fields.featuredImage.fields.file.url}`,
            title: item.fields.featuredImage.fields.title,
          }
        : null,
    };
  } catch (error) {
    console.error('Error fetching breaking news:', error);
    return null;
  }
}

/**
 * Get articles by category
 */
export async function getArticlesByCategory(category, locale = 'en', preview = false) {
  const ctfClient = preview ? previewClient : client;

  try {
    const entries = await ctfClient.getEntries({
      content_type: 'article',
      'fields.category': category,
      locale: locale === 'de' ? 'de-DE' : 'en-US',
      order: '-sys.publishedAt',
      limit: 20,
    });

    return entries.items.map(item => ({
      id: item.sys.id,
      title: item.fields.title,
      slug: item.fields.slug,
      excerpt: item.fields.excerpt,
      category: item.fields.category,
      publishedAt: item.sys.publishedAt || item.sys.createdAt,
      featuredImage: item.fields.featuredImage
        ? {
            url: `https:${item.fields.featuredImage.fields.file.url}`,
            title: item.fields.featuredImage.fields.title,
          }
        : null,
    }));
  } catch (error) {
    console.error('Error fetching articles by category:', error);
    return [];
  }
}

/**
 * Get all categories
 */
export async function getCategories() {
  try {
    const entries = await client.getEntries({
      content_type: 'category',
    });

    return entries.items.map(item => ({
      id: item.sys.id,
      name: item.fields.name,
      slug: item.fields.slug,
      description: item.fields.description,
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default client;
