import { featuredCountrySlugs } from './countries';
import { categories } from './categories';

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
  'cosplay',
  'curvy',
  'feet',
  'squirt',
  'anal',
  'bdsm',
  'fetish',
  'hairy',
  'shaven',
  'piercing',
  'tattoo',
  'pregnant',
  'milk',
  'smoke'
] as const;

export const featuredCategoryTagCombos = [
  { category: 'teen', tag: 'petite' },
  { category: 'teen', tag: 'blondes' },
  { category: 'teen', tag: 'brunettes' },
  { category: 'teen', tag: 'college' },
  { category: 'teen', tag: 'cosplay' },
  { category: 'teen', tag: 'lingerie' },
  { category: 'teen', tag: 'asian' },
  { category: 'teen', tag: 'latin' },
  { category: 'asian', tag: 'petite' },
  { category: 'asian', tag: 'lingerie' },
  { category: 'asian', tag: 'young' },
  { category: 'asian', tag: 'cosplay' },
  { category: 'asian', tag: 'big-boobs' },
  { category: 'asian', tag: 'college' },
  { category: 'latina', tag: 'big-boobs' },
  { category: 'latina', tag: 'young' },
  { category: 'latina', tag: 'lingerie' },
  { category: 'latina', tag: 'curvy' },
  { category: 'latina', tag: 'milf' },
  { category: 'blonde', tag: 'young' },
  { category: 'blonde', tag: 'petite' },
  { category: 'blonde', tag: 'lingerie' },
  { category: 'blonde', tag: 'big-boobs' },
  { category: 'blonde', tag: 'college' },
  { category: 'brunette', tag: 'cosplay' },
  { category: 'brunette', tag: 'young' },
  { category: 'brunette', tag: 'college' },
  { category: 'brunette', tag: 'petite' },
  { category: 'brunette', tag: 'lingerie' },
  { category: 'milf', tag: 'lingerie' },
  { category: 'milf', tag: 'big-boobs' },
  { category: 'milf', tag: 'curvy' },
  { category: 'milf', tag: 'blondes' },
  { category: 'milf', tag: 'brunettes' },
  { category: 'ebony', tag: 'big-boobs' },
  { category: 'ebony', tag: 'young' },
  { category: 'ebony', tag: 'curvy' },
  { category: 'ebony', tag: 'anal' },
  { category: 'arab', tag: 'petite' },
  { category: 'arab', tag: 'milf' },
  { category: 'arab', tag: 'big-boobs' },
  { category: 'indian', tag: 'young' },
  { category: 'indian', tag: 'milf' },
  { category: 'indian', tag: 'big-boobs' },
  { category: 'japanese', tag: 'cosplay' },
  { category: 'japanese', tag: 'petite' },
  { category: 'japanese', tag: 'college' },
  { category: 'bbw', tag: 'big-boobs' },
  { category: 'bbw', tag: 'curvy' },
  { category: 'bbw', tag: 'milf' },
  { category: 'couple', tag: 'young' },
  { category: 'couple', tag: 'anal' },
  { category: 'trans', tag: 'young' },
  { category: 'trans', tag: 'asian' },
  { category: 'brazilian', tag: 'big-boobs' },
  { category: 'brazilian', tag: 'curvy' },
  { category: 'brazilian', tag: 'latin' }
] as const;

export const featuredCountryRoutes = featuredCountrySlugs.map((slug) => `/country/${slug}`);

export const countryCategoryCombos = featuredCountrySlugs.flatMap(country =>
  categories.slice(0, 12).map(category => ({
    country,
    category,
    path: `/country/${country}/cam/${category}`
  }))
);

export const countryTagCombos = featuredCountrySlugs.flatMap(country =>
  priorityTagSlugs.slice(0, 15).map(tag => ({
    country,
    tag,
    path: `/country/${country}/tag/${tag}`
  }))
);
