import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  AFFILIATE_ID,
  apiError,
  createNormalizedModel,
  deriveCategoriesFromModels,
  NormalizedModel,
  parseProviderModels,
  waitForRateLimit
} from './shared.js';

const DEFAULT_ENDPOINT = 'https://go.mavrtracktor.com/api/models';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const apiKey = process.env.STRIPCASH_API_KEY;
    if (!apiKey) return apiError(res, 'Missing STRIPCASH_API_KEY environment variable.', 500);

    const endpoint = process.env.STRIPCHAT_API_ENDPOINT || DEFAULT_ENDPOINT;
    const url = new URL(endpoint);
    url.searchParams.set('userId', AFFILIATE_ID);
    url.searchParams.set('limit', '400');
    url.searchParams.set('tag', 'girls,couples,trans,men');
    url.searchParams.set('strict', '1');
    url.searchParams.set('fields', 'tags');

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

    const providerPayload = await upstreamRes.json();
    const models = parseProviderModels(providerPayload)
      .map(createNormalizedModel)
      .filter((item): item is NormalizedModel => Boolean(item) && item.isLive);

    const categories = deriveCategoriesFromModels(models);
    return res.status(200).json({ categories });
  } catch (error) {
    return apiError(res, error instanceof Error ? error.message : 'upstream error', 500);
  }
}
