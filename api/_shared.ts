import type { VercelResponse } from '@vercel/node';

export const AFFILIATE_ID = 'd28a8a923e19b6fd3ed0c160238cdfed71b13f759191c9457b28797b81780881';

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

export const detectCategory = (tags: string[]): string => {
  const joined = tags.join(',').toLowerCase();
  if (/milf|milfs|mature/.test(joined)) return 'milf';
  if (/blonde/.test(joined)) return 'blonde';
  if (/asian/.test(joined)) return 'asian';
  if (/brunette/.test(joined)) return 'brunette';
  if (/couple|couples/.test(joined)) return 'couple';
  if (/trans/.test(joined)) return 'trans';
  return 'general';
};

export const deriveCategories = (models: Array<{ tags: string[]; category?: string }>) => {
  const order = ['milf', 'blonde', 'asian', 'brunette', 'couple', 'trans'];
  const map = new Map<string, number>();

  for (const model of models) {
    const source = model.tags.length ? model.tags : [model.category || 'general'];
    for (const tag of source) {
      const slug = tag.toLowerCase().replace(/^girls\//, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      if (!slug) continue;
      map.set(slug, (map.get(slug) || 0) + 1);
    }
  }

  for (const base of order) if (!map.has(base)) map.set(base, 0);

  return [...map.entries()]
    .map(([slug, count]) => ({ slug, name: slug.charAt(0).toUpperCase() + slug.slice(1), count }))
    .sort((a, b) => {
      const ai = order.indexOf(a.slug);
      const bi = order.indexOf(b.slug);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      return b.count - a.count;
    });
};
