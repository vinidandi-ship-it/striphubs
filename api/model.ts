import type { VercelRequest, VercelResponse } from '@vercel/node';
import { AFFILIATE_ID } from '../src/lib/models';
import { waitForRateLimit } from '../src/lib/rateLimiter';

const DEFAULT_ENDPOINT = 'https://go.mavrtracktor.com/api/models';

const err = (res: VercelResponse, message: string, providerStatus = 500) =>
  res.status(providerStatus >= 400 && providerStatus < 600 ? providerStatus : 500).json({
    error: true,
    message,
    providerStatus
  });

const toString = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const parseModels = (payload: unknown): Record<string, unknown>[] => {
  if (Array.isArray(payload)) return payload as Record<string, unknown>[];
  if (!payload || typeof payload !== 'object') return [];
  const raw = payload as Record<string, unknown>;
  if (Array.isArray(raw.models)) return raw.models as Record<string, unknown>[];
  if (raw.data && typeof raw.data === 'object' && Array.isArray((raw.data as Record<string, unknown>).models)) {
    return (raw.data as Record<string, unknown>).models as Record<string, unknown>[];
  }
  return [];
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return err(res, 'Method not allowed', 405);

  const name = toString(req.query.name).toLowerCase();
  if (!name) return err(res, 'Missing name query parameter', 400);

  try {
    const apiKey = process.env.STRIPCASH_API_KEY;
    if (!apiKey) return err(res, 'Missing STRIPCASH_API_KEY environment variable.', 500);

    const endpoint = process.env.STRIPCHAT_API_ENDPOINT || DEFAULT_ENDPOINT;
    const url = new URL(endpoint);
    url.searchParams.set('userId', AFFILIATE_ID);
    url.searchParams.set('limit', '1000');
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
      return err(res, `upstream error: ${detail.slice(0, 250)}`, upstreamRes.status);
    }

    const models = parseModels(await upstreamRes.json());
    const model = models.find((item) => toString(item.username).toLowerCase() === name);

    if (!model) return err(res, 'Model not found', 404);

    const username = toString(model.username);
    const payload = {
      username,
      thumbnail:
        toString(model.snapshotUrl) ||
        toString(model.popularSnapshotUrl) ||
        toString(model.previewUrlThumbSmall) ||
        `https://picsum.photos/seed/${encodeURIComponent(username)}/640/800`,
      viewers: Number(model.viewersCount || model.viewers || 0),
      tags: Array.isArray(model.tags) ? model.tags.map((t) => String(t).toLowerCase()) : [],
      country: (toString(model.modelsCountry || model.country || model.country_code) || 'N/A').toUpperCase(),
      affiliateLink: `https://stripchat.com/${encodeURIComponent(username)}?userId=${AFFILIATE_ID}`
    };

    return res.status(200).json(payload);
  } catch (error) {
    return err(res, error instanceof Error ? error.message : 'upstream error', 500);
  }
}
