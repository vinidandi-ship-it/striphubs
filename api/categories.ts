import type { VercelRequest, VercelResponse } from '@vercel/node';
import { AFFILIATE_ID, apiError, deriveCategories, parseProviderModels, waitForRateLimit } from './_shared';

const DEFAULT_ENDPOINT = 'https://go.mavrtracktor.com/api/models';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return apiError(res, 'Method not allowed', 405);

  try {
    const apiKey = process.env.STRIPCASH_API_KEY;
    if (!apiKey) return apiError(res, 'Missing STRIPCASH_API_KEY environment variable.', 500);

    const endpoint = process.env.STRIPCHAT_API_ENDPOINT || DEFAULT_ENDPOINT;
    const url = new URL(endpoint);
    url.searchParams.set('userId', AFFILIATE_ID);
    url.searchParams.set('limit', '300');
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
    const normalized = providerModels.map((model) => ({
      username: String(model.username || ''),
      thumbnail: String(model.snapshotUrl || model.previewUrlThumbSmall || ''),
      viewers: Number(model.viewersCount || 0),
      tags: Array.isArray(model.tags) ? model.tags.map((t) => String(t).toLowerCase()) : [],
      country: String(model.modelsCountry || model.country || 'N/A').toUpperCase(),
      category: '',
      isLive: true
    }));

    const categories = deriveCategories(normalized);
    return res.status(200).json({ categories });
  } catch (error) {
    return apiError(res, error instanceof Error ? error.message : 'upstream error', 500);
  }
}
