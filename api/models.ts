import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  AFFILIATE_ID,
  apiError,
  CATEGORY_DEFINITIONS,
  createNormalizedModel,
  extractProviderTotal,
  NormalizedModel,
  parseProviderModels,
  waitForRateLimit
} from './shared.js';

const CACHE_TTL_MS = 60_000;
const DEFAULT_ENDPOINT = process.env.STRIPCHAT_API_ENDPOINT || 'https://go.mavrtracktor.com/api/models';
const MAX_MODELS_PER_REQUEST = 500;
const MAX_TOTAL_MODELS = 50000; // Limite massimo per chiamare tutte le modelle

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
  const hasCountry = Boolean((req.query.country as string | undefined)?.trim());

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
  }

  if (!url.searchParams.has('limit')) {
    url.searchParams.set('limit', hasCountry ? '500' : '5000');
  }

  if (!url.searchParams.has('fields')) url.searchParams.set('fields', 'tags');
  return url.toString();
};

// Funzione per chiamare tutte le modelle in modo dinamico con parallelismo
async function fetchAllModels(apiKey: string, upstreamUrl: string, hasCountry: boolean): Promise<{ models: NormalizedModel[], total: number | null }> {
  const allModels: NormalizedModel[] = [];
  let offset = 0;
  let total: number | null = null;
  let hasMore = true;
  let pageCount = 0;
  const maxPages = Math.ceil(MAX_TOTAL_MODELS / MAX_MODELS_PER_REQUEST);
  
  // Chiamiamo 5 pagine in parallelo per ridurre il tempo
  const PARALLEL_BATCH = 5;
  
  // Se ha country, usa limit 500 per ogni pagina
  // Altrimenti usa limit 5000 per chiamare più modelle in una volta
  const limit = hasCountry ? MAX_MODELS_PER_REQUEST : 5000;

  while (hasMore && offset < MAX_TOTAL_MODELS && pageCount < maxPages) {
    // Rate limit tra i batch, non ogni singola chiamata
    if (pageCount % PARALLEL_BATCH === 0) {
      await waitForRateLimit(2000);
    }
    
    // Prepara le chiamate per questo batch
    const batchOffsets: number[] = [];
    for (let i = 0; i < PARALLEL_BATCH && offset + i * limit < MAX_TOTAL_MODELS; i++) {
      batchOffsets.push(offset + i * limit);
    }
    
    const batchPromises = batchOffsets.map(async (batchOffset) => {
      const url = new URL(upstreamUrl);
      url.searchParams.set('offset', String(batchOffset));
      url.searchParams.set('limit', String(limit));

      const response = await fetch(url.toString(), {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${apiKey}`
        }
      });

      if (!response.ok) {
        console.error(`API error at offset ${batchOffset}: ${response.status}`);
        return [];
      }

      const data = await response.json();
      const models = parseProviderModels(data)
        .map(createNormalizedModel)
        .filter((item): item is NormalizedModel => Boolean(item));

      if (total === null) {
        total = extractProviderTotal(data);
      }

      return models;
    });

    const batchResults = await Promise.all(batchPromises);
    
    batchResults.forEach(models => {
      if (models.length === 0 || models.length < limit) {
        hasMore = false;
      }
      allModels.push(...models);
    });
    
    offset += batchOffsets.length * limit;
    pageCount += batchOffsets.length;

    console.log(`Fetched ${batchResults.reduce((sum, m) => sum + m.length, 0)} models at offset ${offset - batchOffsets.length * limit}, total so far: ${allModels.length}`);
  }

  return { models: allModels, total };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return apiError(res, 'Method not allowed', 405);

  try {
    const apiKey = process.env.STRIPCASH_API_KEY;
    if (!apiKey) return apiError(res, 'Missing STRIPCASH_API_KEY environment variable.', 500);

    const hasCountry = Boolean((req.query.country as string | undefined)?.trim());
    const upstreamUrl = buildUpstreamUrl(req);

    let normalized: NormalizedModel[];
    let providerTotal: number | null = null;

    if (cache && cache.key === upstreamUrl && cache.expiresAt > Date.now()) {
      normalized = cache.models;
    } else {
      const result = await fetchAllModels(apiKey, upstreamUrl, hasCountry);
      normalized = result.models;
      providerTotal = result.total;

      cache = {
        key: upstreamUrl,
        expiresAt: Date.now() + CACHE_TTL_MS,
        models: normalized
      };
    }

    const liveOnly = req.query.liveOnly !== '0' && req.query.liveOnly !== 'false';
    const filtered = liveOnly ? normalized.filter((model) => model.isLive) : normalized;
    const models = filterModels(filtered, req);
    const limit = Math.min(Math.max(Number(req.query.limit) || 200, 1), 1000);
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    const total = providerTotal ?? offset + models.length + (models.length === limit ? 1 : 0);
    
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    res.status(200).json({
      models,
      total,
      offset,
      hasMore: providerTotal ? offset + models.length < providerTotal : models.length === limit
    });
  } catch (error) {
    return apiError(res, error instanceof Error ? error.message : 'upstream error', 500);
  }
}
