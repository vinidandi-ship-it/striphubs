import type { VercelRequest, VercelResponse } from '@vercel/node';

const AFFILIATE_ID = 'd28a8a923e19b6fd3ed0c160238cdfed71b13f759191c9457b28797b81780881';
const DEFAULT_ENDPOINT = 'https://go.mavrtracktor.com/api/models';

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

const CORE_CATEGORIES = [
  { slug: 'milf', name: 'Milf', match: /(milf|milfs|mature)/ },
  { slug: 'blonde', name: 'Blonde', match: /blonde/ },
  { slug: 'asian', name: 'Asian', match: /asian/ },
  { slug: 'brunette', name: 'Brunette', match: /brunette/ },
  { slug: 'couple', name: 'Couple', match: /(couple|couples)/ },
  { slug: 'trans', name: 'Trans', match: /trans/ }
] as const;

const deriveCategories = (models: Array<{ tags: string[] }>) =>
  CORE_CATEGORIES.map((category) => {
    const count = models.reduce((acc, model) => {
      const hit = model.tags.some((tag) => category.match.test(tag.toLowerCase()));
      return acc + (hit ? 1 : 0);
    }, 0);
    return { slug: category.slug, name: category.name, count };
  });

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
