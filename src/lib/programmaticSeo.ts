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
  { category: 'teen', tag: 'cosplay' },
  { category: 'teen', tag: 'lingerie' },
  { category: 'asian', tag: 'petite' },
  { category: 'asian', tag: 'lingerie' },
  { category: 'asian', tag: 'young' },
  { category: 'asian', tag: 'cosplay' },
  { category: 'latina', tag: 'big-boobs' },
  { category: 'latina', tag: 'young' },
  { category: 'latina', tag: 'lingerie' },
  { category: 'blonde', tag: 'young' },
  { category: 'blonde', tag: 'petite' },
  { category: 'blonde', tag: 'lingerie' },
  { category: 'brunette', tag: 'cosplay' },
  { category: 'brunette', tag: 'young' },
  { category: 'brunette', tag: 'college' },
  { category: 'milf', tag: 'lingerie' },
  { category: 'milf', tag: 'big-boobs' },
  { category: 'milf', tag: 'curvy' },
  { category: 'ebony', tag: 'big-boobs' },
  { category: 'ebony', tag: 'young' },
  { category: 'arab', tag: 'petite' },
  { category: 'indian', tag: 'young' },
  { category: 'japanese', tag: 'cosplay' }
] as const;

export const featuredCountryRoutes = featuredCountrySlugs.map((slug) => `/country/${slug}`);
