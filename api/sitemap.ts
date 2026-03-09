import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  AFFILIATE_ID,
  apiError,
  deriveCategories,
  parseProviderModels,
  waitForRateLimit
} from './_shared';

const SITE_URL = process.env.VITE_SITE_URL || 'https://striphubs.vercel.app';
const MODELS_ENDPOINT = process.env.STRIPCHAT_API_ENDPOINT || 'https://go.mavrtracktor.com/api/models';

const baseRoutes = ['/', '/live', '/search'];

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const apiKey = process.env.STRIPCASH_API_KEY;
    if (!apiKey) return apiError(res, 'Missing STRIPCASH_API_KEY environment variable.', 500);

    const url = new URL(MODELS_ENDPOINT);
    url.searchParams.set('userId', AFFILIATE_ID);
    url.searchParams.set('limit', '200');
    url.searchParams.set('tag', 'girls,couples,trans,men');
    url.searchParams.set('strict', '1');

    await waitForRateLimit(5000);

    const upstreamRes = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`
      }
    });

    if (!upstreamRes.ok) {
      const detail = await upstreamRes.text();
      return apiError(res, `upstream error: ${detail.slice(0, 250)}`, upstreamRes.status);
    }

    const providerModels = parseProviderModels(await upstreamRes.json());
    const models = providerModels
      .map((item) => String(item.username || '').trim())
      .filter(Boolean)
      .slice(0, 120);

    const categories = deriveCategories(
      providerModels.map((m) => ({
        username: String(m.username || ''),
        thumbnail: '',
        viewers: 0,
        tags: Array.isArray(m.tags) ? m.tags.map((t) => String(t).toLowerCase()) : [],
        country: 'N/A',
        category: '',
        isLive: true
      }))
    ).slice(0, 20);

    const tags = new Set<string>();
    for (const m of providerModels) {
      if (Array.isArray(m.tags)) {
        for (const t of m.tags.slice(0, 2)) {
          const cleaned = String(t).toLowerCase().replace(/^girls\//, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
          if (cleaned) tags.add(cleaned);
          if (tags.size >= 20) break;
        }
      }
      if (tags.size >= 20) break;
    }

    const routes = [
      ...baseRoutes,
      ...categories.map((c) => `/cam/${c.slug}`),
      ...[...tags].map((t) => `/tag/${t}`),
      ...models.map((u) => `/model/${encodeURIComponent(u)}`)
    ];

    const now = new Date().toISOString();
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
      .map((path) => `  <url>\n    <loc>${SITE_URL}${path}</loc>\n    <lastmod>${now}</lastmod>\n  </url>`)
      .join('\n')}\n</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.status(200).send(xml);
  } catch (error) {
    return apiError(res, error instanceof Error ? error.message : 'sitemap error', 500);
  }
}
