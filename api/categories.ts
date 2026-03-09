import type { VercelRequest, VercelResponse } from '@vercel/node';

const AFFILIATE_ID = 'd28a8a923e19b6fd3ed0c160238cdfed71b13f759191c9457b28797b81780881';
const categories = ['milf', 'blonde', 'asian', 'brunette', 'couple', 'trans'];
const MIN_UPSTREAM_INTERVAL_MS = 5_000;
const DEFAULT_ENDPOINT = 'https://go.mavrtracktor.com/api/models';
let lastUpstreamRequestAt = 0;

const extractTags = (item: unknown): string[] => {
  if (!item || typeof item !== 'object') return [];
  const raw = item as Record<string, unknown>;
  if (Array.isArray(raw.tags)) return raw.tags.map((tag) => String(tag).toLowerCase());
  if (typeof raw.tags === 'string') return raw.tags.split(',').map((tag) => tag.trim().toLowerCase());
  return [];
};

const extractModels = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];
  const raw = payload as Record<string, unknown>;
  if (Array.isArray(raw.models)) return raw.models;
  if (raw.data && typeof raw.data === 'object' && Array.isArray((raw.data as Record<string, unknown>).models)) {
    return (raw.data as Record<string, unknown>).models as unknown[];
  }
  return [];
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const endpoint = process.env.STRIPCHAT_API_ENDPOINT || DEFAULT_ENDPOINT;
    const apiKey = process.env.STRIPCASH_API_KEY;
    if (!apiKey) throw new Error('Missing STRIPCASH_API_KEY environment variable.');

    const delta = Date.now() - lastUpstreamRequestAt;
    if (delta < MIN_UPSTREAM_INTERVAL_MS) {
      await new Promise((resolve) => setTimeout(resolve, MIN_UPSTREAM_INTERVAL_MS - delta));
    }

    const url = new URL(endpoint);
    url.searchParams.set('userId', AFFILIATE_ID);
    url.searchParams.set('strict', '1');
    url.searchParams.set('tag', 'girls,couples,trans,men');
    url.searchParams.set('limit', '1000');

    const response = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`
      }
    });
    lastUpstreamRequestAt = Date.now();
    if (!response.ok) throw new Error(`Provider API failed with status ${response.status}`);

    const models = extractModels(await response.json());

    const payload = categories.map((category) => {
      const count = models.reduce((acc, item) => {
        const tags = extractTags(item);
        return tags.some((tag) => tag.includes(category)) ? acc + 1 : acc;
      }, 0);

      return {
        slug: category,
        name: category.charAt(0).toUpperCase() + category.slice(1),
        count
      };
    });

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    res.status(200).json({ categories: payload });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch categories',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
