export const countries = [
  { slug: 'italian', name: 'Italiane', code: 'IT', tags: ['italian', 'italia', 'roma', 'milano'] },
  { slug: 'german', name: 'Tedesche', code: 'DE', tags: ['german', 'germany', 'berlin'] },
  { slug: 'french', name: 'Francesi', code: 'FR', tags: ['french', 'france', 'paris'] },
  { slug: 'spanish', name: 'Spagnole', code: 'ES', tags: ['spanish', 'spain', 'madrid'] },
  { slug: 'british', name: 'Britanniche', code: 'GB', tags: ['british', 'uk', 'london'] },
  { slug: 'american', name: 'Americane', code: 'US', tags: ['american', 'usa', 'new york'] },
  { slug: 'canadian', name: 'Canadesi', code: 'CA', tags: ['canadian', 'canada', 'toronto'] },
  { slug: 'australian', name: 'Australiane', code: 'AU', tags: ['australian', 'australia', 'sydney'] },
  { slug: 'russian', name: 'Russe', code: 'RU', tags: ['russian', 'russia', 'moscow'] },
  { slug: 'polish', name: 'Polacche', code: 'PL', tags: ['polish', 'poland', 'warsaw'] },
  { slug: 'dutch', name: 'Olandesi', code: 'NL', tags: ['dutch', 'netherlands', 'amsterdam'] },
  { slug: 'swedish', name: 'Svedesi', code: 'SE', tags: ['swedish', 'sweden', 'stockholm'] },
  { slug: 'norwegian', name: 'Norvegesi', code: 'NO', tags: ['norwegian', 'norway'] },
  { slug: 'danish', name: 'Danesi', code: 'DK', tags: ['danish', 'denmark'] },
  { slug: 'finnish', name: 'Finlandesi', code: 'FI', tags: ['finnish', 'finland'] },
  { slug: 'portuguese', name: 'Portoghesi', code: 'PT', tags: ['portuguese', 'portugal'] },
  { slug: 'greek', name: 'Greche', code: 'GR', tags: ['greek', 'greece'] },
  { slug: 'turkish', name: 'Turche', code: 'TR', tags: ['turkish', 'turkey'] },
  { slug: 'indian', name: 'Indiane', code: 'IN', tags: ['indian', 'india'] },
  { slug: 'chinese', name: 'Cinesi', code: 'CN', tags: ['chinese', 'china'] },
  { slug: 'japanese', name: 'Giapponesi', code: 'JP', tags: ['japanese', 'japan'] },
  { slug: 'korean', name: 'Coreane', code: 'KR', tags: ['korean', 'korea'] }
] as const;

export type CountrySlug = (typeof countries)[number]['slug'];

export const featuredCountrySlugs = ['italian', 'american', 'british', 'german', 'spanish', 'french'] as const;

export const findCountryBySlug = (slug: string) => countries.find((country) => country.slug === slug);
