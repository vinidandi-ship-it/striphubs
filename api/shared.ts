import type { VercelResponse } from '@vercel/node';

export const AFFILIATE_ID = 'd28a8a923e19b6fd3ed0c160238cdfed71b13f759191c9457b28797b81780881';

export const CATEGORY_DEFINITIONS = [
  { slug: 'milf', name: 'MILF', match: /(girls\/milfs|milf|milfs|mature)/i, tag: 'girls/milfs' },
  { slug: 'teen', name: 'Teen', match: /(girls\/teens|teen)/i, tag: 'girls/teens' },
  { slug: 'ebony', name: 'Ebony', match: /(girls\/ebony|ebony|black)/i, tag: 'girls/ebony' },
  { slug: 'asian', name: 'Asian', match: /(girls\/asian|asian)/i, tag: 'girls/asian' },
  { slug: 'latina', name: 'Latina', match: /(girls\/latin|latina|latin)/i, tag: 'girls/latin' },
  { slug: 'blonde', name: 'Blonde', match: /(girls\/blondes|blonde)/i, tag: 'girls/blondes' },
  { slug: 'brunette', name: 'Brunette', match: /(girls\/brunettes|brunette)/i, tag: 'girls/brunettes' },
  { slug: 'bbw', name: 'BBW', match: /(girls\/bbw|bbw)/i, tag: 'girls/bbw' },
  { slug: 'couple', name: 'Couple', match: /(couples|couple|couples)/i, tag: 'couples' },
  { slug: 'gay', name: 'Gay', match: /(gay)/i, tag: 'gay' },
  { slug: 'lesbian', name: 'Lesbian', match: /(girls\/lesbian|lesbian)/i, tag: 'girls/lesbian' },
  { slug: 'men', name: 'Men', match: /(men|male)/i, tag: 'men' },
  { slug: 'trans', name: 'Trans', match: /(trans)/i, tag: 'trans' },
  { slug: 'vr', name: 'VR', match: /(vr)/i, tag: 'vr' }
] as const;

export const STATIC_TAGS = [
  'tattoo',
  'big-boobs',
  'petite',
  'teen',
  'ebony',
  'redhead',
  'curvy',
  'college',
  'cosplay',
  'piercing',
  'feet',
  'lingerie'
] as const;

export type CategoryDefinition = (typeof CATEGORY_DEFINITIONS)[number];

export type NormalizedModel = {
  username: string;
  thumbnail: string;
  viewers: number;
  tags: string[];
  country: string;
  category: string;
  isLive: boolean;
  clickUrl: string;
};

let nextAllowedAt = 0;
let queue: Promise<void> = Promise.resolve();

export const waitForRateLimit = (intervalMs = 5000): Promise<void> => {
  queue = queue.then(async () => {
    const now = Date.now();
    const waitMs = Math.max(0, nextAllowedAt - now);
    if (waitMs > 0) await new Promise((resolve) => setTimeout(resolve, waitMs));
    nextAllowedAt = Date.now() + intervalMs;
  });
  return queue;
};

export const apiError = (res: VercelResponse, message: string, providerStatus = 500) =>
  res.status(providerStatus >= 400 && providerStatus < 600 ? providerStatus : 500).json({
    error: true,
    message,
    providerStatus
  });

export const toString = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

export const toNumber = (value: unknown): number => {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
};

export const normalizeTags = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((tag) => String(tag ?? '').toLowerCase().trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((tag) => tag.toLowerCase().trim())
      .filter(Boolean);
  }
  return [];
};

export const parseProviderModels = (payload: unknown): Record<string, unknown>[] => {
  if (Array.isArray(payload)) return payload as Record<string, unknown>[];
  if (!payload || typeof payload !== 'object') return [];
  const raw = payload as Record<string, unknown>;
  if (Array.isArray(raw.models)) return raw.models as Record<string, unknown>[];
  if (raw.data && typeof raw.data === 'object' && Array.isArray((raw.data as Record<string, unknown>).models)) {
    return (raw.data as Record<string, unknown>).models as Record<string, unknown>[];
  }
  return [];
};

const buildClickUrl = (username: string): string =>
  `https://stripchat.com/${encodeURIComponent(username)}?userId=${AFFILIATE_ID}`;

export const detectCategoryFromTags = (tags: string[]): string => {
  const joined = tags.join(' ');
  for (const category of CATEGORY_DEFINITIONS) {
    if (category.match.test(joined)) return category.slug;
  }
  return 'general';
};

export const createNormalizedModel = (model: Record<string, unknown>): NormalizedModel | null => {
  const username = toString(model.username || model.user || model.model_name || model.nick);
  if (!username) return null;

  const tags = normalizeTags(model.tags);
  const category = detectCategoryFromTags(tags);
  const isLive =
    ['public', 'groupShow', 'p2p', 'private'].includes(toString(model.status)) ||
    Boolean(model.isLive ?? model.is_live ?? true);

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
    category,
    isLive,
    clickUrl: buildClickUrl(username)
  };
};

export const deriveCategoriesFromModels = (models: NormalizedModel[]) =>
  CATEGORY_DEFINITIONS.map((category) => ({
    slug: category.slug,
    name: category.name,
    count: models.reduce((acc, model) => (model.tags.some((tag) => category.match.test(tag)) ? acc + 1 : acc), 0)
  }));

export const sanitizeTagForRoute = (raw: string): string => {
  return raw
    .toLowerCase()
    .replace(/^girls\//, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};
