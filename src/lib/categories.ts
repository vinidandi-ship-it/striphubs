import type { Model } from './models';
import { CATEGORIES } from './models';

export type DerivedCategory = {
  name: string;
  slug: string;
  count: number;
};

const CATEGORY_PATTERNS: Record<string, RegExp> = {
  milf: /(milf|milfs|mature)/i,
  blonde: /blonde/i,
  asian: /asian/i,
  brunette: /brunette/i,
  latina: /(latina|latin)/i,
  couple: /(couple|couples)/i,
  trans: /trans/i,
  teen: /teen/i,
  ebony: /(ebony|black)/i
};

export const deriveCategories = (models: Model[]): DerivedCategory[] => {
  const counts = new Map<string, number>();

  for (const slug of CATEGORIES) counts.set(slug, 0);

  for (const model of models) {
    for (const tag of model.tags) {
      for (const slug of CATEGORIES) {
        const pattern = CATEGORY_PATTERNS[slug];
        if (pattern && pattern.test(tag)) {
          counts.set(slug, (counts.get(slug) || 0) + 1);
        }
      }
    }
  }

  return CATEGORIES.map((slug) => ({
    slug,
    name: slug.charAt(0).toUpperCase() + slug.slice(1),
    count: counts.get(slug) || 0
  }));
};
