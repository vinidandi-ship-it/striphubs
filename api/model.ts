import type { VercelRequest, VercelResponse } from '@vercel/node';

const AFFILIATE_ID = 'd28a8a923e19b6fd3ed0c160238cdfed71b13f759191c9457b28797b81780881';
const MIN_UPSTREAM_INTERVAL_MS = 5_000;
const DEFAULT_ENDPOINT = 'https://go.mavrtracktor.com/api/models';
let lastUpstreamRequestAt = 0;

type LiveModel = {
  username: string;
  thumbnail: string;
  viewers: number;
  tags: string[];
  country: string;
  isLive: boolean;
  clickUrl?: string;
};

const normalize = (item: unknown): LiveModel | null => {
  if (!item || typeof item !== 'object') return null;
  const raw = item as Record<string, unknown>;
  const username = String(raw.username || raw.user || raw.model_name || '').trim();
  if (!username) return null;

  return {
    username,
    thumbnail: String(raw.snapshotUrl || raw.popularSnapshotUrl || raw.previewUrlThumbSmall || raw.thumbnail || raw.image_url || raw.preview || ''),
    viewers: Number(raw.viewersCount || raw.viewers || raw.users_count || 0),
    tags: Array.isArray(raw.tags) ? raw.tags.map((t) => String(t).toLowerCase()) : [],
    country: String(raw.modelsCountry || raw.country || raw.country_code || 'N/A').toUpperCase(),
    isLive: ['public', 'groupShow', 'p2p', 'private'].includes(String(raw.status || '')) || Boolean(raw.isLive ?? raw.is_live ?? true),
    clickUrl: String(raw.clickUrl || '')
  };
};

const extract = (payload: unknown): LiveModel[] => {
  const arr = Array.isArray(payload)
    ? payload
    : (payload as { models?: unknown[]; data?: { models?: unknown[] } })?.models ||
      (payload as { data?: { models?: unknown[] } })?.data?.models ||
      [];

  return arr.map(normalize).filter((item): item is LiveModel => Boolean(item));
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const name = String(req.query.name || '').trim().toLowerCase();
  if (!name) {
    res.status(400).json({ error: 'Missing name query parameter' });
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
    url.searchParams.set('tag', 'girls');
    url.searchParams.set('limit', '1000');

    const response = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`
      }
    });
    lastUpstreamRequestAt = Date.now();
    if (!response.ok) throw new Error(`Provider API failed with status ${response.status}`);

    const models = extract(await response.json());
    const model = models.find((item) => item.username.toLowerCase() === name);

    if (!model) {
      res.status(404).json({ error: 'Model not found' });
      return;
    }

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    res.status(200).json(model);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch model',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
