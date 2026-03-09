import type { VercelRequest, VercelResponse } from '@vercel/node';

const AFFILIATE_ID = 'd28a8a923e19b6fd3ed0c160238cdfed71b13f759191c9457b28797b81780881';
const CACHE_TTL_MS = 60_000;
const DEFAULT_ENDPOINT = 'https://go.mavrtracktor.com/api/models';

type ProviderModel = Record<string, unknown>;

type NormalizedModel = {
  username: string;
  thumbnail: string;
  viewers: number;
  tags: string[];
  country: string;
  category: string;
  isLive: boolean;
  clickUrl: string;
};

let cache: { key: string; expiresAt: number; models: NormalizedModel[] } | null = null;

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

const toString = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');
const toNumber = (value: unknown): number => {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
};

const parseProviderModels = (payload: unknown): ProviderModel[] => {
  if (Array.isArray(payload)) return payload as ProviderModel[];
  if (!payload || typeof payload !== 'object') return [];
  const raw = payload as Record<string, unknown>;
  if (Array.isArray(raw.models)) return raw.models as ProviderModel[];
  if (raw.data && typeof raw.data === 'object' && Array.isArray((raw.data as Record<string, unknown>).models)) {
    return (raw.data as Record<string, unknown>).models as ProviderModel[];
  }
  return [];
};

const detectCategory = (tags: string[]): string => {
  const joined = tags.join(',').toLowerCase();
  if (/milf|milfs|mature/.test(joined)) return 'milf';
  if (/blonde/.test(joined)) return 'blonde';
  if (/asian/.test(joined)) return 'asian';
  if (/brunette/.test(joined)) return 'brunette';
  if (/couple|couples/.test(joined)) return 'couple';
  if (/trans/.test(joined)) return 'trans';
  return 'general';
};

const normalizeModel = (model: ProviderModel): NormalizedModel | null => {
  const username = toString(model.username || model.user || model.model_name || model.nick);
  if (!username) return null;

  const tags = Array.isArray(model.tags)
    ? model.tags.map((item) => String(item).toLowerCase())
    : typeof model.tags === 'string'
      ? model.tags.split(',').map((item) => item.trim().toLowerCase()).filter(Boolean)
      : [];

  const isLive = ['public', 'groupShow', 'p2p', 'private'].includes(toString(model.status)) || Boolean(model.isLive ?? model.is_live ?? true);

  return {
    username,
    thumbnail:
      toString(model.snapshotUrl) ||
      toString(model.popularSnapshotUrl) ||
      toString(model.previewUrlThumbSmall) ||
      toString(model.thumbnail) ||
      `https://picsum.photos/seed/${encodeURIComponent(username)}/640/800`,
    viewers: toNumber(model.viewersCount ?? model.viewers ?? model.users_count),
    tags,
    country: (toString(model.modelsCountry || model.country || model.country_code) || 'N/A').toUpperCase(),
    category: detectCategory(tags),
    isLive,
    clickUrl: toString(model.clickUrl)
  };
};

const filterModels = (models: NormalizedModel[], req: VercelRequest): NormalizedModel[] => {
  const search = toString(req.query.search).toLowerCase();
  const category = toString(req.query.category).toLowerCase();
  const tag = toString(req.query.tag).toLowerCase();
  const limit = Math.min(Math.max(toNumber(req.query.limit) || 48, 1), 1000);
  const offset = Math.max(toNumber(req.query.offset) || 0, 0);

  let out = models;

  if (category) out = out.filter((m) => m.category === category);
  if (tag) {
    const required = tag.split(',').map((v) => v.trim()).filter(Boolean);
    out = out.filter((m) => required.some((needle) => m.tags.some((t) => t.includes(needle))));
  }
  if (search) {
    out = out.filter((m) =>
      m.username.toLowerCase().includes(search) ||
      m.country.toLowerCase().includes(search) ||
      m.tags.some((t) => t.includes(search))
    );
  }

  return out.sort((a, b) => b.viewers - a.viewers).slice(offset, offset + limit);
};

const buildUpstreamUrl = (req: VercelRequest): string => {
  const endpoint = process.env.STRIPCHAT_API_ENDPOINT || DEFAULT_ENDPOINT;
  const url = new URL(endpoint);
  url.searchParams.set('userId', AFFILIATE_ID);

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
    const category = toString(req.query.category).toLowerCase();
    const categoryTag: Record<string, string> = {
      milf: 'girls/milfs',
      blonde: 'girls/blonde',
      asian: 'girls/asian',
      brunette: 'girls/brunette',
      couple: 'couples',
      trans: 'trans'
    };
    url.searchParams.set('tag', categoryTag[category] || 'girls');
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
        .map(normalizeModel)
        .filter((item): item is NormalizedModel => Boolean(item))
        .filter((item) => item.isLive);

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
