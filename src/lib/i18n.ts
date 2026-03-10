export const SUPPORTED_LANGUAGES = ['it', 'en', 'de', 'fr', 'es', 'pt'] as const;
export const DEFAULT_LANGUAGE = 'it';

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_NAMES: Record<Language, string> = {
  it: 'Italiano',
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  pt: 'Português'
};

export const LANGUAGE_X_DEFAULT: Language = 'it';

export const isValidLanguage = (lang: string): lang is Language =>
  SUPPORTED_LANGUAGES.includes(lang as Language);

export type HreflangAlternate = { hreflang: Language | 'x-default'; href: string };

export const getAlternateUrls = (path: string, baseUrl: string): HreflangAlternate[] => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  const alternates: HreflangAlternate[] = SUPPORTED_LANGUAGES.map((lang) => ({
    hreflang: lang,
    href: lang === DEFAULT_LANGUAGE 
      ? `${baseUrl}${cleanPath}`
      : `${baseUrl}/${lang}${cleanPath}`
  }));

  alternates.push({
    hreflang: 'x-default',
    href: `${baseUrl}${cleanPath}`
  });

  return alternates;
};

export const getCanonicalUrl = (path: string, baseUrl: string, lang?: Language): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  if (!lang || lang === DEFAULT_LANGUAGE) {
    return `${baseUrl}${cleanPath}`;
  }
  
  return `${baseUrl}/${lang}${cleanPath}`;
};
