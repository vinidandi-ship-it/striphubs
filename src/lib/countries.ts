import { SupportedLocale } from '../i18n/types';

export const countries = [
  { slug: 'italian', name: 'Italiane', nameKey: 'italian', code: 'IT', tags: ['italian', 'italia', 'roma', 'milano'] },
  { slug: 'german', name: 'Tedesche', nameKey: 'german', code: 'DE', tags: ['german', 'germany', 'berlin'] },
  { slug: 'french', name: 'Francesi', nameKey: 'french', code: 'FR', tags: ['french', 'france', 'paris'] },
  { slug: 'spanish', name: 'Spagnole', nameKey: 'spanish', code: 'ES', tags: ['spanish', 'spain', 'madrid'] },
  { slug: 'british', name: 'Britanniche', nameKey: 'british', code: 'GB', tags: ['british', 'uk', 'london'] },
  { slug: 'american', name: 'Americane', nameKey: 'american', code: 'US', tags: ['american', 'usa', 'new york'] },
  { slug: 'ukrainian', name: 'Ucraine', nameKey: 'ukrainian', code: 'UA', tags: ['ukrainian', 'ukraine', 'kyiv', 'kiev'] },
  { slug: 'russian', name: 'Russe', nameKey: 'russian', code: 'RU', tags: ['russian', 'russia', 'moscow'] },
  { slug: 'brazilian', name: 'Brasiliane', nameKey: 'brazilian', code: 'BR', tags: ['brazilian', 'brazil', 'brasil'] },
  { slug: 'colombian', name: 'Colombiane', nameKey: 'colombian', code: 'CO', tags: ['colombian', 'colombia'] },
  { slug: 'canadian', name: 'Canadesi', nameKey: 'canadian', code: 'CA', tags: ['canadian', 'canada', 'toronto'] },
  { slug: 'australian', name: 'Australiane', nameKey: 'australian', code: 'AU', tags: ['australian', 'australia', 'sydney'] },
  { slug: 'polish', name: 'Polacche', nameKey: 'polish', code: 'PL', tags: ['polish', 'poland', 'warsaw'] },
  { slug: 'dutch', name: 'Olandesi', nameKey: 'dutch', code: 'NL', tags: ['dutch', 'netherlands', 'amsterdam'] },
  { slug: 'swedish', name: 'Svedesi', nameKey: 'swedish', code: 'SE', tags: ['swedish', 'sweden', 'stockholm'] },
  { slug: 'norwegian', name: 'Norvegesi', nameKey: 'norwegian', code: 'NO', tags: ['norwegian', 'norway'] },
  { slug: 'danish', name: 'Danesi', nameKey: 'danish', code: 'DK', tags: ['danish', 'denmark'] },
  { slug: 'finnish', name: 'Finlandesi', nameKey: 'finnish', code: 'FI', tags: ['finnish', 'finland'] },
  { slug: 'portuguese', name: 'Portoghesi', nameKey: 'portuguese', code: 'PT', tags: ['portuguese', 'portugal'] },
  { slug: 'greek', name: 'Greche', nameKey: 'greek', code: 'GR', tags: ['greek', 'greece'] },
  { slug: 'turkish', name: 'Turche', nameKey: 'turkish', code: 'TR', tags: ['turkish', 'turkey'] },
  { slug: 'indian', name: 'Indiane', nameKey: 'indian', code: 'IN', tags: ['indian', 'india'] },
  { slug: 'chinese', name: 'Cinesi', nameKey: 'chinese', code: 'CN', tags: ['chinese', 'china'] },
  { slug: 'japanese', name: 'Giapponesi', nameKey: 'japanese', code: 'JP', tags: ['japanese', 'japan'] },
  { slug: 'korean', name: 'Coreane', nameKey: 'korean', code: 'KR', tags: ['korean', 'korea'] },
  { slug: 'mexican', name: 'Messicane', nameKey: 'mexican', code: 'MX', tags: ['mexican', 'mexico'] },
  { slug: 'philippine', name: 'Filippine', nameKey: 'philippine', code: 'PH', tags: ['philippine', 'philippines'] },
  { slug: 'thai', name: 'Thailandesi', nameKey: 'thai', code: 'TH', tags: ['thai', 'thailand'] },
  { slug: 'vietnamese', name: 'Vietnamite', nameKey: 'vietnamese', code: 'VN', tags: ['vietnamese', 'vietnam'] }
] as const;

export type CountrySlug = (typeof countries)[number]['slug'];

export const featuredCountrySlugs = ['italian', 'american', 'british', 'german', 'spanish', 'french'] as const;

export const findCountryBySlug = (slug: string) => countries.find((country) => country.slug === slug);

export const getCountryName = (slug: string, t: (key: string) => string): string => {
  const country = findCountryBySlug(slug);
  return country ? t(`countries.${country.nameKey}`) : slug;
};
