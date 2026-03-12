import type { VercelResponse } from '@vercel/node';

export const STRIPCHAT_AFFILIATE_ID = 'd28a8a923e19b6fd3ed0c160238cdfed71b13f759191c9457b28797b81780881';
export const CHATURBATE_CAMPAIGN = 'fxmnz';

export type ProviderId = 'stripchat' | 'chaturbate';

export type ProviderConfig = {
  id: ProviderId;
  name: string;
  weight: number;
  buildClickUrl: (username: string) => string;
};

export const PROVIDERS: Record<ProviderId, ProviderConfig> = {
  stripchat: {
    id: 'stripchat',
    name: 'Stripchat',
    weight: 85,
    buildClickUrl: (username: string) =>
      `https://go.mavrtracktor.com?userId=${STRIPCHAT_AFFILIATE_ID}&model=${encodeURIComponent(username)}`
  },
  chaturbate: {
    id: 'chaturbate',
    name: 'Chaturbate',
    weight: 15,
    buildClickUrl: (username: string) =>
      `https://chaturbate.com/in/?tour=LQps&campaign=${CHATURBATE_CAMPAIGN}&track=default&room=${encodeURIComponent(username)}`
  }
};

export const selectProviderByWeight = (): ProviderId => {
  const random = Math.random() * 100;
  return random < 85 ? 'stripchat' : 'chaturbate';
};

export const CATEGORY_DEFINITIONS = [
  { slug: 'milf', name: 'MILF', match: /(girls\/milfs|milf|milfs|mature)/i, tag: 'girls/milfs' },
  { slug: 'teen', name: 'Teen', match: /(girls\/teens|teen)/i, tag: 'girls/teens' },
  { slug: 'ebony', name: 'Ebony', match: /(girls\/ebony|ebony|black)/i, tag: 'girls/ebony' },
  { slug: 'asian', name: 'Asian', match: /(girls\/asian|asian)/i, tag: 'girls/asian' },
  { slug: 'latina', name: 'Latina', match: /(girls\/latin|latina|latin)/i, tag: 'girls/latin' },
  { slug: 'blonde', name: 'Blonde', match: /(girls\/blondes|blonde)/i, tag: 'girls/blondes' },
  { slug: 'brunette', name: 'Brunette', match: /(girls\/brunettes|brunette)/i, tag: 'girls/brunettes' },
  { slug: 'bbw', name: 'BBW', match: /(girls\/bbw|bbw)/i, tag: 'girls/bbw' },
  { slug: 'arab', name: 'Arab', match: /(girls\/arab|arab)/i, tag: 'girls/arab' },
  { slug: 'indian', name: 'Indian', match: /(girls\/indian|indian)/i, tag: 'girls/indian' },
  { slug: 'brazilian', name: 'Brazilian', match: /(girls\/brazilian|brazilian)/i, tag: 'girls/brazilian' },
  { slug: 'japanese', name: 'Japanese', match: /(girls\/japanese|japanese)/i, tag: 'girls/japanese' },
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
  provider: ProviderId;
};

const COUNTRY_HINTS: Array<{ match: RegExp; code: string }> = [
  { match: /(girls\/american|couples\/american|american|usa|united-states|united states)/i, code: 'US' },
  { match: /(girls\/british|couples\/british|british|united kingdom|uk|england)/i, code: 'GB' },
  { match: /(girls\/italian|couples\/italian|italian|italy|italia)/i, code: 'IT' },
  { match: /(girls\/german|couples\/german|german|germany|germania)/i, code: 'DE' },
  { match: /(girls\/french|couples\/french|french|france|francia)/i, code: 'FR' },
  { match: /(girls\/spanish|couples\/spanish|spanish|spain|spagna|espana)/i, code: 'ES' },
  { match: /(girls\/canadian|couples\/canadian|canadian|canada)/i, code: 'CA' },
  { match: /(girls\/australian|couples\/australian|australian|australia)/i, code: 'AU' },
  { match: /(girls\/russian|couples\/russian|russian|russia)/i, code: 'RU' },
  { match: /(girls\/polish|couples\/polish|polish|poland|polonia)/i, code: 'PL' },
  { match: /(girls\/dutch|couples\/dutch|dutch|netherlands|holland)/i, code: 'NL' },
  { match: /(girls\/swedish|couples\/swedish|swedish|sweden)/i, code: 'SE' },
  { match: /(girls\/norwegian|couples\/norwegian|norwegian|norway)/i, code: 'NO' },
  { match: /(girls\/danish|couples\/danish|danish|denmark)/i, code: 'DK' },
  { match: /(girls\/finnish|couples\/finnish|finnish|finland)/i, code: 'FI' },
  { match: /(girls\/portuguese|couples\/portuguese|portuguese|portugal)/i, code: 'PT' },
  { match: /(girls\/greek|couples\/greek|greek|greece|grecia)/i, code: 'GR' },
  { match: /(girls\/turkish|couples\/turkish|turkish|turkey|turquia)/i, code: 'TR' },
  { match: /(girls\/indian|couples\/indian|indian|india|hindi)/i, code: 'IN' },
  { match: /(girls\/chinese|couples\/chinese|chinese|china)/i, code: 'CN' },
  { match: /(girls\/japanese|couples\/japanese|japanese|japan|japon)/i, code: 'JP' },
  { match: /(girls\/korean|couples\/korean|korean|korea|corea)/i, code: 'KR' },
  { match: /(girls\/ukrainian|couples\/ukrainian|ukrainian|ukraine)/i, code: 'UA' },
  { match: /(girls\/colombian|couples\/colombian|colombian|colombia)/i, code: 'CO' },
  { match: /(girls\/brazilian|couples\/brazilian|brazilian|brazil)/i, code: 'BR' }
];

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

const normalizeCountryCode = (value: string): string => {
  const upper = value.toUpperCase();
  if (/^[A-Z]{2}$/.test(upper)) return upper;

  const compact = value.toLowerCase();
  for (const hint of COUNTRY_HINTS) {
    if (hint.match.test(compact)) return hint.code;
  }

  return '';
};

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

export const extractProviderTotal = (payload: unknown): number | null => {
  if (!payload || typeof payload !== 'object') return null;
  const raw = payload as Record<string, unknown>;

  const direct = Number(raw.total ?? raw.totalCount ?? raw.count);
  if (Number.isFinite(direct) && direct > 0) return direct;

  if (raw.data && typeof raw.data === 'object') {
    const nested = raw.data as Record<string, unknown>;
    const value = Number(nested.total ?? nested.totalCount ?? nested.count);
    if (Number.isFinite(value) && value > 0) return value;
  }

  return null;
};

export const detectCategoryFromTags = (tags: string[], country?: string): string => {
  const joined = tags.join(' ');
  for (const category of CATEGORY_DEFINITIONS) {
    if (category.match.test(joined)) return category.slug;
  }
  return 'general';
};

const detectCountryFromTags = (tags: string[]): string => {
  const joined = tags.join(' ');
  for (const hint of COUNTRY_HINTS) {
    if (hint.match.test(joined)) return hint.code;
  }
  return '';
};

export const createNormalizedModel = (model: Record<string, unknown>, provider: ProviderId = 'stripchat'): NormalizedModel | null => {
  const username = toString(model.username || model.user || model.model_name || model.nick || model.display_name);
  if (!username) return null;

  const tags = normalizeTags(model.tags);
  const explicitClickUrl =
    toString(model.clickUrl || model.click_url || model.chat_room_url_revshare || model.chat_room_url || model.affiliate_url || model.url);
  const rawCountry = toString(model.modelsCountry || model.country || model.country_code || model.countryCode || model.location);
  const country = normalizeCountryCode(rawCountry) || detectCountryFromTags(tags) || 'N/A';
  const category = detectCategoryFromTags(tags, country);
  const isLive =
    ['public', 'groupShow', 'p2p', 'private'].includes(toString(model.status)) ||
    Boolean(model.isLive ?? model.is_live ?? model.current_show ?? true);

  return {
    username,
    thumbnail:
      toString(model.snapshotUrl) ||
      toString(model.popularSnapshotUrl) ||
      toString(model.previewUrlThumbSmall) ||
      toString(model.thumbnail) ||
      toString(model.image_url) ||
      `https://picsum.photos/seed/${encodeURIComponent(username)}/640/800`,
    viewers: toNumber(model.viewersCount ?? model.viewers ?? model.users_count ?? model.num_users),
    tags,
    country,
    category,
    isLive,
    clickUrl: explicitClickUrl || PROVIDERS[provider].buildClickUrl(username),
    provider
  };
};

export const deriveCategoriesFromModels = (models: NormalizedModel[]) =>
  CATEGORY_DEFINITIONS.map((category) => ({
    slug: category.slug,
    name: category.name,
    count: models.reduce((acc, model) => (
      model.tags.some((tag) => category.match.test(tag)) || category.match.test(model.country) ? acc + 1 : acc
    ), 0)
  }));

export const sanitizeTagForRoute = (raw: string): string => {
  const cleaned = raw
    .toLowerCase()
    .replace(/^girls\//, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const aliases: Record<string, string> = {
    teens: 'teen',
    blonde: 'blondes',
    brunette: 'brunettes',
    tattoos: 'tattoo',
    piercings: 'piercing'
  };

  return aliases[cleaned] || cleaned;
};
