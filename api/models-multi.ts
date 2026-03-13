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

// Limits for dynamic fetching
const MAX_MODELS_PER_REQUEST = 500;
const MAX_TOTAL_MODELS = 50000;

type CacheEntry = { key: string; expiresAt: number; models: NormalizedModel[]; provider: string };

const caches: Map<string, CacheEntry> = new Map();

// Dynamic loop for StripChat
const fetchStripchatModelsDynamic = async (apiKey: string, params: URLSearchParams): Promise<NormalizedModel[]> => {
  const cacheKey = `stripchat:${params.toString()}`;
  const cached = caches.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.models;
  }

  const allModels: NormalizedModel[] = [];
  let offset = 0;
  let hasMore = true;
  let pageCount = 0;
  const maxPages = Math.ceil(MAX_TOTAL_MODELS / MAX_MODELS_PER_REQUEST);
  const limit = MAX_MODELS_PER_REQUEST;

  while (hasMore && offset < MAX_TOTAL_MODELS && pageCount < maxPages) {
    await waitForRateLimit(2000);
    
    const url = new URL(STRIPCHAT_ENDPOINT);
    params.forEach((value, key) => url.searchParams.set(key, value));
    url.searchParams.set('userId', PROVIDERS.stripchat.buildClickUrl('').split('userId=')[1]?.split('&')[0] || '');
    url.searchParams.set('offset', String(offset));
    url.searchParams.set('limit', String(limit));
    
    const response = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`
      }
    });
    
    if (!response.ok) {
      console.error(`StripChat API error at offset ${offset}: ${response.status}`);
      break;
    }
    
    const data = await response.json();
    const models = parseProviderModels(data)
      .map(m => createNormalizedModel(m, 'stripchat'))
      .filter((item): item is NormalizedModel => Boolean(item));
    
    if (models.length === 0 || models.length < limit) {
      hasMore = false;
    }
    
    allModels.push(...models);
    offset += limit;
    pageCount++;
    
    console.log(`StripChat: Fetched ${models.length} models at offset ${offset - limit}, total so far: ${allModels.length}`);
  }
  
  caches.set(cacheKey, { key: cacheKey, expiresAt: Date.now() + CACHE_TTL_MS, models: allModels, provider: 'stripchat' });
  return allModels;
};

// Dynamic loop for Chaturbate
const fetchChaturbateModelsDynamic = async (params: URLSearchParams): Promise<NormalizedModel[]> => {
  const cacheKey = `chaturbate:${params.toString()}`;
  const cached = caches.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.models;
  }

  const allModels: NormalizedModel[] = [];
  let offset = 0;
  let hasMore = true;
  let pageCount = 0;
  const maxPages = Math.ceil(MAX_TOTAL_MODELS / MAX_MODELS_PER_REQUEST);
  const limit = MAX_MODELS_PER_REQUEST;

  while (hasMore && offset < MAX_TOTAL_MODELS && pageCount < maxPages) {
    await waitForRateLimit(2000);
    
    const url = new URL(CHATURBATE_ENDPOINT);
    
    const tag = params.get('tag') || params.get('category');
    if (tag) {
      url.searchParams.set('tag', tag);
    }
    
    url.searchParams.set('limit', String(limit));
    url.searchParams.set('offset', String(offset));
    
    const response = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error(`Chaturbate API error at offset ${offset}: ${response.status}`);
      break;
    }
    
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
    
    if (models.length === 0 || models.length < limit) {
      hasMore = false;
    }
    
    allModels.push(...models);
    offset += limit;
    pageCount++;
    
    console.log(`Chaturbate: Fetched ${models.length} models at offset ${offset - limit}, total so far: ${allModels.length}`);
  }
  
  caches.set(cacheKey, { key: cacheKey, expiresAt: Date.now() + CACHE_TTL_MS, models: allModels, provider: 'chaturbate' });
  return allModels;
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
    
    // Pass through parameters to StripChat
    ['limit', 'offset', 'tag', 'category', 'country', 'search', 'modelsList', 'strict'].forEach(key => {
      const value = req.query[key];
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, String(v)));
      } else if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    });

    const promises: Promise<NormalizedModel[]>[] = [];
    
    // Fetch StripChat models dynamically
    if (apiKey) {
      promises.push(fetchStripchatModelsDynamic(apiKey, params));
    }
    
    // Fetch Chaturbate models dynamically
    if (enableChaturbate) {
      promises.push(fetchChaturbateModelsDynamic(params));
    }

    const results = await Promise.allSettled(promises);
    const allModels: NormalizedModel[] = [];

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allModels.push(...result.value);
      }
    });

    const filtered = filterModels(allModels, req);
    
    const limit = Math.min(Math.max(Number(req.query.limit) || 200, 1), 1000);
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    const total = allModels.length;

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    res.status(200).json({
      models: filtered,
      total,
      offset,
      hasMore: offset + filtered.length < total
    });
  } catch (error) {
    return apiError(res, error instanceof Error ? error.message : 'upstream error', 500);
  }
}
