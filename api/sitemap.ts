import type { VercelRequest, VercelResponse } from '@vercel/node';

const AFFILIATE_ID = 'd28a8a923e19b6fd3ed0c160238cdfed71b13f759191c9457b28797b81780881';
const SITE_URL = process.env.VITE_SITE_URL || 'https://striphubs.vercel.app';
const MODELS_ENDPOINT = process.env.STRIPCHAT_API_ENDPOINT || 'https://go.mavrtracktor.com/api/models';

const baseRoutes = ['/', '/live', '/search'];

let nextAllowedAt = 0;
let queue: Promise<void> = Promise.resolve();

const waitForRateLimit = (intervalMs = 5000): Promise<void> => {
  queue = queue.then(async () => {
    const now = Date.now();
    const waitMs = Math.max(0, nextAllowedAt - now);
    if (waitMs > 0) await new Promise((resolve) => setTimeout(resolve, waitMs));
    nextAllowedAt = Date.now() + intervalMs;
  });
  return queue;
};

const apiError = (res: VercelResponse, message: string, providerStatus = 500) =>
  res.status(providerStatus >= 400 && providerStatus < 600 ? providerStatus : 500).json({
    error: true,
    message,
    providerStatus
  });

const parseProviderModels = (payload: unknown): Record<string, unknown>[] => {
  if (Array.isArray(payload)) return payload as Record<string, unknown>[];
  if (!payload || typeof payload !== 'object') return [];
  const raw = payload as Record<string, unknown>;
  if (Array.isArray(raw.models)) return raw.models as Record<string, unknown>[];
  if (raw.data && typeof raw.data === 'object' && Array.isArray((raw.data as Record<string, unknown>).models)) {
    return (raw.data as Record<string, unknown>).models as Record<string, unknown>[];
  }
  return [];
};

const FALLBACK_ORDER = ['milf', 'blonde', 'asian', 'brunette', 'couple', 'trans'];

const normalizeTag = (tag: string): string => tag.toLowerCase().replace(/^girls\//, '').trim();
const toSlug = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

const deriveCategories = (models: Array<{ tags: string[]; category?: string }>) => {
  const map = new Map<string, number>();
  for (const model of models) {
    const tags = model.tags.length ? model.tags : [model.category || 'general'];
    for (const raw of tags) {
      const slug = toSlug(normalizeTag(raw));
      if (!slug) continue;
      map.set(slug, (map.get(slug) || 0) + 1);
    }
  }
  for (const base of FALLBACK_ORDER) {
    if (!map.has(base)) map.set(base, 0);
  }
  return [...map.entries()]
    .map(([slug, count]) => ({ slug, name: slug.charAt(0).toUpperCase() + slug.slice(1), count }))
    .sort((a, b) => {
      const ai = FALLBACK_ORDER.indexOf(a.slug);
      const bi = FALLBACK_ORDER.indexOf(b.slug);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      return b.count - a.count;
    });
};

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
