export const countries = [
  { slug: 'italian', name: 'Italiane', code: 'IT' },
  { slug: 'german', name: 'Tedesche', code: 'DE' },
  { slug: 'french', name: 'Francesi', code: 'FR' },
  { slug: 'spanish', name: 'Spagnole', code: 'ES' },
  { slug: 'british', name: 'Britanniche', code: 'GB' },
  { slug: 'american', name: 'Americane', code: 'US' },
  { slug: 'canadian', name: 'Canadesi', code: 'CA' },
  { slug: 'australian', name: 'Australiane', code: 'AU' },
  { slug: 'russian', name: 'Russe', code: 'RU' },
  { slug: 'polish', name: 'Polacche', code: 'PL' },
  { slug: 'dutch', name: 'Olandesi', code: 'NL' },
  { slug: 'swedish', name: 'Svedesi', code: 'SE' },
  { slug: 'norwegian', name: 'Norvegesi', code: 'NO' },
  { slug: 'danish', name: 'Danesi', code: 'DK' },
  { slug: 'finnish', name: 'Finlandesi', code: 'FI' },
  { slug: 'portuguese', name: 'Portoghesi', code: 'PT' },
  { slug: 'greek', name: 'Greche', code: 'GR' },
  { slug: 'turkish', name: 'Turche', code: 'TR' },
  { slug: 'indian', name: 'Indiane', code: 'IN' },
  { slug: 'chinese', name: 'Cinesi', code: 'CN' },
  { slug: 'japanese', name: 'Giapponesi', code: 'JP' },
  { slug: 'korean', name: 'Coreane', code: 'KR' }
] as const;

export type CountrySlug = (typeof countries)[number]['slug'];

export const featuredCountrySlugs = ['italian', 'american', 'british', 'german', 'spanish', 'french'] as const;

export const findCountryBySlug = (slug: string) => countries.find((country) => country.slug === slug);
