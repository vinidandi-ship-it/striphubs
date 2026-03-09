import type { Model } from './models';

export type DerivedCategory = {
  name: string;
  slug: string;
  count: number;
};

const FALLBACK_ORDER = ['milf', 'blonde', 'asian', 'brunette', 'couple', 'trans'];

const normalizeTag = (tag: string): string => tag.toLowerCase().replace(/^girls\//, '').trim();

const toSlug = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

export const deriveCategories = (models: Model[]): DerivedCategory[] => {
  const map = new Map<string, number>();

  for (const model of models) {
    const tags = model.tags.length ? model.tags : [model.category || 'general'];

    for (const raw of tags) {
      const normalized = normalizeTag(raw);
      const slug = toSlug(normalized);
      if (!slug) continue;
      map.set(slug, (map.get(slug) || 0) + 1);
    }
  }

  for (const base of FALLBACK_ORDER) {
    if (!map.has(base)) map.set(base, 0);
  }

  return [...map.entries()]
    .map(([slug, count]) => ({ slug, name: slug.charAt(0).toUpperCase() + slug.slice(1), count }))
    .sort((a, b) => {
      const ai = FALLBACK_ORDER.indexOf(a.slug);
      const bi = FALLBACK_ORDER.indexOf(b.slug);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      return b.count - a.count;
    });
};
