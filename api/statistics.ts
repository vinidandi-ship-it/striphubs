import type { VercelRequest, VercelResponse } from '@vercel/node';

const AFFILIATE_ID = 'd28a8a923e19b6fd3ed0c160238cdfed71b13f759191c9457b28797b81780881';
const STATS_ENDPOINT = 'https://api.stripcash.com/external/v1/user/statistics';
const MIN_UPSTREAM_INTERVAL_MS = 5_000;

let lastUpstreamRequestAt = 0;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const apiKey = process.env.STRIPCASH_STATS_API_KEY || process.env.STRIPCASH_API_KEY;
    if (!apiKey) {
      throw new Error('Missing STRIPCASH_STATS_API_KEY (or STRIPCASH_API_KEY) environment variable.');
    }

    const delta = Date.now() - lastUpstreamRequestAt;
    if (delta < MIN_UPSTREAM_INTERVAL_MS) {
      await new Promise((resolve) => setTimeout(resolve, MIN_UPSTREAM_INTERVAL_MS - delta));
    }

    const upstream = new URL(STATS_ENDPOINT);
    upstream.searchParams.set('userId', AFFILIATE_ID);

    for (const [key, value] of Object.entries(req.query)) {
      if (key === 'userId') continue;
      if (Array.isArray(value)) {
        for (const item of value) upstream.searchParams.append(key, String(item));
      } else if (value !== undefined && value !== null && String(value).trim()) {
        upstream.searchParams.set(key, String(value));
      }
    }

    const response = await fetch(upstream.toString(), {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`
      }
    });
    lastUpstreamRequestAt = Date.now();

    if (!response.ok) {
      throw new Error(`Statistics API failed with status ${response.status}`);
    }

    const payload = await response.json();
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
    res.status(200).json(payload);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch statistics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
