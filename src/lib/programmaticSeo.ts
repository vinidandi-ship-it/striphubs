import { featuredCountrySlugs } from './countries';

export const priorityTagSlugs = [
  'teen',
  'young',
  'petite',
  'blondes',
  'brunettes',
  'asian',
  'latin',
  'milf',
  'big-boobs',
  'lingerie',
  'college',
  'cosplay'
] as const;

export const featuredCategoryTagCombos = [
  { category: 'teen', tag: 'petite' },
  { category: 'teen', tag: 'blondes' },
  { category: 'teen', tag: 'college' },
  { category: 'asian', tag: 'petite' },
  { category: 'asian', tag: 'lingerie' },
  { category: 'latina', tag: 'big-boobs' },
  { category: 'blonde', tag: 'young' },
  { category: 'brunette', tag: 'cosplay' },
  { category: 'milf', tag: 'lingerie' },
  { category: 'milf', tag: 'big-boobs' }
] as const;

export const featuredCountryRoutes = featuredCountrySlugs.map((slug) => `/country/${slug}`);
