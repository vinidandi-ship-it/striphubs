export const categories = [
  'milf',
  'teen',
  'ebony',
  'asian',
  'latina',
  'blonde',
  'brunette',
  'bbw',
  'arab',
  'indian',
  'brazilian',
  'japanese',
  'couple',
  'gay',
  'lesbian',
  'men',
  'trans',
  'vr'
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
  milf: /(girls\/milfs|milf|milfs|mature)/i,
  teen: /(girls\/teens|teen)/i,
  ebony: /(girls\/ebony|ebony|black)/i,
  asian: /(girls\/asian|asian)/i,
  latina: /(girls\/latin|latina|latin)/i,
  blonde: /(girls\/blondes|blonde)/i,
  brunette: /(girls\/brunettes|brunette)/i,
  bbw: /(girls\/bbw|bbw)/i,
  arab: /(girls\/arab|arab)/i,
  indian: /(girls\/indian|indian)/i,
  brazilian: /(girls\/brazilian|brazilian)/i,
  japanese: /(girls\/japanese|japanese)/i,
  couple: /(couples|couple|couples)/i,
  gay: /(gay)/i,
  lesbian: /(girls\/lesbian|lesbian)/i,
  men: /(men|male)/i,
  trans: /(trans)/i,
  vr: /(vr)/i
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
