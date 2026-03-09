import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  AFFILIATE_ID,
  apiError,
  createNormalizedModel,
  NormalizedModel,
  parseProviderModels,
  waitForRateLimit
} from './shared';

const DEFAULT_ENDPOINT = 'https://go.mavrtracktor.com/api/models';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return apiError(res, 'Method not allowed', 405);

  const name = (req.query.name as string | undefined)?.toLowerCase?.() ?? '';
  if (!name) return apiError(res, 'Missing name query parameter', 400);

  try {
    const apiKey = process.env.STRIPCASH_API_KEY;
    if (!apiKey) return apiError(res, 'Missing STRIPCASH_API_KEY environment variable.', 500);

    const endpoint = process.env.STRIPCHAT_API_ENDPOINT || DEFAULT_ENDPOINT;
    const url = new URL(endpoint);
    url.searchParams.set('userId', AFFILIATE_ID);
    url.searchParams.set('limit', '1000');
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
      .filter((item): item is NormalizedModel => Boolean(item));

    const model = models.find((item) => item.username.toLowerCase() === name);
    if (!model) return apiError(res, 'Model not found', 404);

    return res.status(200).json({
      username: model.username,
      thumbnail: model.thumbnail,
      viewers: model.viewers,
      tags: model.tags,
      country: model.country,
      clickUrl: model.clickUrl
    });
  } catch (error) {
    return apiError(res, error instanceof Error ? error.message : 'upstream error', 500);
  }
}
