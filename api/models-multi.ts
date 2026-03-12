import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  apiError,
  createNormalizedModel,
  extractProviderTotal,
  NormalizedModel,
  parseProviderModels,
  waitForRateLimit,
  selectProviderByWeight,
  PROVIDERS
} from './providers.js';

const CACHE_TTL_MS = 60_000;
const DEFAULT_CHATURBATE_MAX_SHARE = 0.15;
const STRIPCHAT_ENDPOINT = process.env.STRIPCHAT_API_ENDPOINT || 'https://go.mavrtracktor.com/api/models';
const CHATURBATE_BASE = process.env.CHATURBATE_API_URL || 'https://it.chaturbate.com/api/public/affiliates/onlinerooms/';
const CHATURBATE_AFFILIATE = process.env.CHATURBATE_AFFILIATE || 'fxmnz';
const CHATURBATE_ENDPOINT = `${CHATURBATE_BASE}?wm=${CHATURBATE_AFFILIATE}&client_ip=request_ip&format=json`;

type CacheEntry = { key: string; expiresAt: number; models: NormalizedModel[]; provider: string };

const caches: Map<string, CacheEntry> = new Map();

const fetchStripchatModels = async (apiKey: string, params: URLSearchParams): Promise<NormalizedModel[]> => {
  const cacheKey = `stripchat:${params.toString()}`;
  const cached = caches.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.models;
  }

  await waitForRateLimit(5000);
  
  const url = new URL(STRIPCHAT_ENDPOINT);
  params.forEach((value, key) => url.searchParams.set(key, value));
  url.searchParams.set('userId', PROVIDERS.stripchat.buildClickUrl('').split('userId=')[1]?.split('&')[0] || '');
  
  const response = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${apiKey}`
    }
  });
  
  if (!response.ok) return [];
  
  const data = await response.json();
  const models = parseProviderModels(data)
    .map(m => createNormalizedModel(m, 'stripchat'))
    .filter((item): item is NormalizedModel => Boolean(item));
  
  caches.set(cacheKey, { key: cacheKey, expiresAt: Date.now() + CACHE_TTL_MS, models, provider: 'stripchat' });
  
  return models;
};

const fetchChaturbateModels = async (params: URLSearchParams): Promise<NormalizedModel[]> => {
  const cacheKey = `chaturbate:${params.toString()}`;
  const cached = caches.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.models;
  }

  await waitForRateLimit(3000);
  
  const url = new URL(CHATURBATE_ENDPOINT);
  
  const tag = params.get('tag') || params.get('category');
  if (tag) {
    url.searchParams.set('tag', tag);
  }
  
  const limit = params.get('limit') || '500';
  url.searchParams.set('limit', limit);
  
  const response = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json'
    }
  });
  
  if (!response.ok) return [];
  
  const data = await response.json();
  const models = parseProviderModels(data.results || data)
    .map((m: Record<string, unknown>) => createNormalizedModel({
      ...m,
      username: m.username || m.display_name,
      thumbnail: m.image_url || m.thumbnail,
      viewers: m.num_users || m.viewers,
      tags: m.tags || [],
      country: m.location || m.country,
      isLive: true
    }, 'chaturbate'))
    .filter((item): item is NormalizedModel => Boolean(item));
  
  caches.set(cacheKey, { key: cacheKey, expiresAt: Date.now() + CACHE_TTL_MS, models, provider: 'chaturbate' });
  
  return models;
};

const filterModels = (models: NormalizedModel[], req: VercelRequest): NormalizedModel[] => {
  const search = (req.query.search as string | undefined)?.toLowerCase() ?? '';
  const modelsList = (req.query.modelsList as string | undefined)
    ?.split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean) ?? [];
  const strict = req.query.strict === '1' || req.query.strict === 'true';
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

  if (modelsList.length > 0) {
    const requested = new Set(modelsList);
    out = out.filter((model) => {
      const username = model.username.toLowerCase();
      if (strict) return requested.has(username);
      return modelsList.some((needle) => username.includes(needle));
    });
  }

  return out.sort((a, b) => b.viewers - a.viewers).slice(offset, offset + limit);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return apiError(res, 'Method not allowed', 405);

  try {
    const apiKey = process.env.STRIPCASH_API_KEY;
    const enableChaturbate = process.env.ENABLE_CHATURBATE !== 'false';
    
    const params = new URLSearchParams();
    const passKeys = ['limit', 'offset', 'tag', 'category', 'modelsList', 'excludeModelsList', 'strict'];
    for (const key of passKeys) {
      const value = req.query[key];
      if (value) params.set(key, String(value));
    }
    
    if (!params.has('limit')) params.set('limit', '500');
    if (!params.has('fields')) params.set('fields', 'tags');

    const allModels: NormalizedModel[] = [];
    let stripchatModels: NormalizedModel[] = [];
    let chaturbateModels: NormalizedModel[] = [];
    
    if (apiKey) {
      stripchatModels = await fetchStripchatModels(apiKey, params);
      allModels.push(...stripchatModels);
    }
    
    if (enableChaturbate) {
      try {
        chaturbateModels = await fetchChaturbateModels(params);

        const hasPrecisionQuery = Boolean(req.query.search || req.query.modelsList);
        const configuredShare = Number(process.env.CHATURBATE_MAX_SHARE ?? DEFAULT_CHATURBATE_MAX_SHARE);
        const maxShare = Number.isFinite(configuredShare)
          ? Math.min(Math.max(configuredShare, 0), 0.5)
          : DEFAULT_CHATURBATE_MAX_SHARE;

        if (hasPrecisionQuery || stripchatModels.length === 0 || maxShare >= 0.5) {
          allModels.push(...chaturbateModels);
        } else {
          const maxChaturbate = Math.max(1, Math.floor((stripchatModels.length * maxShare) / (1 - maxShare)));
          allModels.push(...chaturbateModels.slice(0, maxChaturbate));
        }
      } catch (e) {
        console.error('Chaturbate fetch error:', e);
      }
    }

    const liveOnly = req.query.liveOnly !== '0' && req.query.liveOnly !== 'false';
    const filtered = liveOnly ? allModels.filter((model) => model.isLive) : allModels;
    const models = filterModels(filtered, req);
    
    const limit = Math.min(Math.max(Number(req.query.limit) || 200, 1), 1000);
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    const total = allModels.length;

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    res.status(200).json({
      models,
      total,
      offset,
      hasMore: offset + models.length < total,
      providers: {
        stripchat: allModels.filter(m => m.provider === 'stripchat').length,
        chaturbate: allModels.filter(m => m.provider === 'chaturbate').length
      }
    });
  } catch (error) {
    return apiError(res, error instanceof Error ? error.message : 'upstream error', 500);
  }
}
