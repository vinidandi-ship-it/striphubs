import type { VercelRequest, VercelResponse } from '@vercel/node';

const AFFILIATE_ID = 'd28a8a923e19b6fd3ed0c160238cdfed71b13f759191c9457b28797b81780881';
const CACHE_TTL_MS = 30_000;
const MIN_UPSTREAM_INTERVAL_MS = 5_000;
const DEFAULT_ENDPOINT = 'https://go.mavrtracktor.com/api/models';

type LiveModel = {
  username: string;
  thumbnail: string;
  viewers: number;
  tags: string[];
  country: string;
  isLive: boolean;
  clickUrl?: string;
};

let cache: { key: string; data: LiveModel[]; expiresAt: number } | null = null;
let lastUpstreamRequestAt = 0;

const CATEGORY_MAP: Record<string, string[]> = {
  milf: ['milf', 'milfs', 'mature'],
  blonde: ['blonde'],
  asian: ['asian'],
  brunette: ['brunette'],
  couple: ['couple', 'couples'],
  trans: ['trans', 'transgender']
};

const TAG_BY_CATEGORY: Record<string, string | undefined> = {
  milf: 'girls/milfs',
  blonde: 'girls/blonde',
  asian: 'girls/asian',
  brunette: 'girls/brunette',
  couple: 'couples',
  trans: 'trans'
};

const PASS_THROUGH_PARAMS = new Set([
  'modelsList',
  'excludeModelsList',
  'tag',
  'mlBoost',
  'limit',
  'isNew',
  'broadcastHD',
  'broadcastVR',
  'broadcastMobile',
  'goalEnabled',
  'isMlAnal',
  'isMlBlowjob',
  'profileInterestedIn',
  'profileBodyType',
  'profileSpecifics',
  'profileEthnicity',
  'profileHairColor',
  'profileEyesColor',
  'profileSubculture',
  'modelsLanguage',
  'modelsCountry',
  'aspectRatio',
  'streamOrientation',
  'strict'
]);

const toNumber = (value: unknown): number => {
  const num = Number(value ?? 0);
  return Number.isFinite(num) ? num : 0;
};

const toString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' && value.trim() ? value.trim() : fallback;

const extractArray = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];

  const obj = payload as Record<string, unknown>;
  const candidates = [obj.models, obj.data, obj.results, obj.items];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
    if (candidate && typeof candidate === 'object' && Array.isArray((candidate as Record<string, unknown>).models)) {
      return (candidate as Record<string, unknown>).models as unknown[];
    }
  }
  return [];
};

const normalizeModel = (item: unknown): LiveModel | null => {
  if (!item || typeof item !== 'object') return null;
  const raw = item as Record<string, unknown>;

  const username = toString(raw.username || raw.user || raw.model_name || raw.nick);
  if (!username) return null;

  const thumb =
    toString(raw.snapshotUrl) ||
    toString(raw.popularSnapshotUrl) ||
    toString(raw.previewUrlThumbSmall) ||
    toString(raw.thumbnail) ||
    toString(raw.image_url) ||
    toString(raw.preview) ||
    toString(raw.avatar_url) ||
    `https://picsum.photos/seed/${encodeURIComponent(username)}/600/760`;

  const rawTags = Array.isArray(raw.tags)
    ? raw.tags
    : typeof raw.tags === 'string'
      ? raw.tags.split(',')
      : [];

  return {
    username,
    thumbnail: thumb,
    viewers: toNumber(raw.viewersCount ?? raw.viewers ?? raw.users_count ?? raw.members_count ?? raw.numUsers),
    tags: rawTags.map((tag) => String(tag).trim().toLowerCase()).filter(Boolean),
    country: toString(raw.modelsCountry || raw.country || raw.country_code || raw.location || 'N/A').toUpperCase(),
    isLive: ['public', 'groupShow', 'p2p', 'private'].includes(toString(raw.status)) || Boolean(raw.isLive ?? raw.is_live ?? true),
    clickUrl: toString(raw.clickUrl)
  };
};

const applyFilters = (models: LiveModel[], req: VercelRequest): LiveModel[] => {
  const category = toString(req.query.category).toLowerCase();
  const search = toString(req.query.search).toLowerCase();
  const limit = Math.min(Math.max(toNumber(req.query.limit) || 48, 1), 120);

  let filtered = models;

  if (search) {
    filtered = filtered.filter((model) =>
      model.username.toLowerCase().includes(search) ||
      model.country.toLowerCase().includes(search) ||
      model.tags.some((tag) => tag.includes(search))
    );
  }

  return filtered.sort((a, b) => b.viewers - a.viewers).slice(0, limit);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const endpoint = process.env.STRIPCHAT_API_ENDPOINT || DEFAULT_ENDPOINT;
    const upstream = new URL(endpoint);
    upstream.searchParams.set('userId', AFFILIATE_ID);

    const category = toString(req.query.category).toLowerCase();
    const tagFromCategory = category ? TAG_BY_CATEGORY[category] : undefined;
    const hasTag = typeof req.query.tag === 'string' && req.query.tag.trim().length > 0;

    for (const [key, value] of Object.entries(req.query)) {
      if (!PASS_THROUGH_PARAMS.has(key)) continue;
      if (Array.isArray(value)) {
        for (const item of value) upstream.searchParams.append(key, String(item));
      } else if (value !== undefined && value !== null && String(value).trim().length > 0) {
        upstream.searchParams.set(key, String(value));
      }
    }

    if (!hasTag) {
      upstream.searchParams.set('tag', tagFromCategory || 'girls');
    }
    if (!upstream.searchParams.has('strict')) {
      upstream.searchParams.set('strict', '1');
    }

    const apiKey = process.env.STRIPCASH_API_KEY;
    if (!apiKey) throw new Error('Missing STRIPCASH_API_KEY environment variable.');

    const upstreamKey = upstream.toString();
    let models: LiveModel[];
    if (cache && cache.key === upstreamKey && cache.expiresAt > Date.now()) {
      models = cache.data;
    } else {
      const delta = Date.now() - lastUpstreamRequestAt;
      if (delta < MIN_UPSTREAM_INTERVAL_MS) {
        await new Promise((resolve) => setTimeout(resolve, MIN_UPSTREAM_INTERVAL_MS - delta));
      }

      const response = await fetch(upstreamKey, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${apiKey}`
        }
      });
      lastUpstreamRequestAt = Date.now();
      if (!response.ok) throw new Error(`Provider API failed with status ${response.status}`);

      const payload = (await response.json()) as unknown;
      models = extractArray(payload)
        .map(normalizeModel)
        .filter((model): model is LiveModel => Boolean(model))
        .filter((model) => model.isLive);

      cache = { key: upstreamKey, data: models, expiresAt: Date.now() + CACHE_TTL_MS };
    }

    const output = applyFilters(models, req);

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    res.status(200).json({
      source: 'proxy',
      count: output.length,
      models: output
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch live models',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
