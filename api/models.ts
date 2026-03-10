import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  AFFILIATE_ID,
  apiError,
  CATEGORY_DEFINITIONS,
  createNormalizedModel,
  NormalizedModel,
  parseProviderModels,
  waitForRateLimit
} from './shared.js';

const CACHE_TTL_MS = 60_000;
const DEFAULT_ENDPOINT = 'https://go.mavrtracktor.com/api/models';

const CATEGORY_TAG_MAP: Record<string, string> = CATEGORY_DEFINITIONS.reduce<Record<string, string>>((acc, category) => {
  acc[category.slug] = category.tag;
  return acc;
}, {});

let cache: { key: string; expiresAt: number; models: NormalizedModel[] } | null = null;

const filterModels = (models: NormalizedModel[], req: VercelRequest): NormalizedModel[] => {
  const search = (req.query.search as string | undefined)?.toLowerCase() ?? '';
  const category = (req.query.category as string | undefined)?.toLowerCase() ?? '';
  const tag = (req.query.tag as string | undefined)?.toLowerCase() ?? '';
  const country = (req.query.country as string | undefined)?.toLowerCase() ?? '';
  const limit = Math.min(Math.max(Number(req.query.limit) || 200, 1), 1000);
  const offset = Math.max(Number(req.query.offset) || 0, 0);

  let out = models;

  if (category) out = out.filter((model) => model.category === category);
  if (tag) {
    const required = tag.split(',').map((value) => value.trim()).filter(Boolean);
    out = out.filter((model) => required.some((needle) => model.tags.some((t) => t.includes(needle))));
  }
  if (country) out = out.filter((model) => model.country.toLowerCase() === country);

  if (search) {
    out = out.filter((model) =>
      model.username.toLowerCase().includes(search) ||
      model.country.toLowerCase().includes(search) ||
      model.tags.some((t) => t.includes(search))
    );
  }

  return out.sort((a, b) => b.viewers - a.viewers).slice(offset, offset + limit);
};

const buildUpstreamUrl = (req: VercelRequest): string => {
  const endpoint = process.env.STRIPCHAT_API_ENDPOINT || DEFAULT_ENDPOINT;
  const url = new URL(endpoint);
  url.searchParams.set('userId', AFFILIATE_ID);
  const hasSearch = Boolean((req.query.search as string | undefined)?.trim());
  const hasCategory = Boolean((req.query.category as string | undefined)?.trim());

  const pass = ['limit', 'offset', 'tag', 'modelsList', 'excludeModelsList', 'strict'];
  for (const key of pass) {
    const value = req.query[key];
    if (Array.isArray(value)) {
      for (const item of value) url.searchParams.append(key, String(item));
    } else if (value !== undefined && value !== null && String(value).trim()) {
      url.searchParams.set(key, String(value));
    }
  }

  if (!url.searchParams.has('tag')) {
    const category = (req.query.category as string | undefined)?.toLowerCase() ?? '';
    if (hasCategory) {
      url.searchParams.set('tag', CATEGORY_TAG_MAP[category] || 'girls');
    }
    // Removed default tag to allow all models
  }

  if (hasSearch && !url.searchParams.has('limit')) {
    url.searchParams.set('limit', '1000');
  }

  if (!url.searchParams.has('strict')) url.searchParams.set('strict', '1');
  if (!url.searchParams.has('fields')) url.searchParams.set('fields', 'tags');
  return url.toString();
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return apiError(res, 'Method not allowed', 405);

  try {
    const apiKey = process.env.STRIPCASH_API_KEY;
    if (!apiKey) return apiError(res, 'Missing STRIPCASH_API_KEY environment variable.', 500);

    const upstreamUrl = buildUpstreamUrl(req);

    let normalized: NormalizedModel[];
    if (cache && cache.key === upstreamUrl && cache.expiresAt > Date.now()) {
      normalized = cache.models;
    } else {
      await waitForRateLimit(5000);
      const upstreamRes = await fetch(upstreamUrl, {
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
      normalized = parseProviderModels(providerPayload)
        .map(createNormalizedModel)
        .filter((item): item is NormalizedModel => Boolean(item))
        .filter((model) => model.isLive);

      cache = {
        key: upstreamUrl,
        expiresAt: Date.now() + CACHE_TTL_MS,
        models: normalized
      };
    }

    const models = filterModels(normalized, req);
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    res.status(200).json({ models });
  } catch (error) {
    return apiError(res, error instanceof Error ? error.message : 'upstream error', 500);
  }
}
