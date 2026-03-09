export const categories = [
  'milf',
  'blonde',
  'asian',
  'brunette',
  'latina',
  'couple',
  'trans'
] as const;

export type CategorySlug = (typeof categories)[number];

export const categoryName = (slug: string) =>
  slug.charAt(0).toUpperCase() + slug.slice(1);

export type DerivedCategory = {
  name: string;
  slug: string;
  count: number;
};

const CATEGORY_PATTERNS: Record<CategorySlug, RegExp> = {
  milf: /(milf|milfs|mature)/i,
  blonde: /blonde/i,
  asian: /asian/i,
  brunette: /brunette/i,
  latina: /(latina|latin)/i,
  couple: /(couple|couples)/i,
  trans: /trans/i
};

export const categorizeModels = (models: Array<{ tags: string[] }>): DerivedCategory[] => {
  const counts = new Map<CategorySlug, number>();
  categories.forEach((slug) => counts.set(slug, 0));

  models.forEach((model) => {
    model.tags.forEach((tag) => {
      categories.forEach((slug) => {
        if (CATEGORY_PATTERNS[slug].test(tag)) {
          counts.set(slug, (counts.get(slug) || 0) + 1);
        }
      });
    });
  });

  return categories.map((slug) => ({
    slug,
    name: categoryName(slug),
    count: counts.get(slug) ?? 0
  }));
};
