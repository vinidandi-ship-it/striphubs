import { Language, SUPPORTED_LANGUAGES } from './index';

export function extractLocaleFromPath(pathname: string): { locale: Language; pathWithoutLocale: string } {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (firstSegment && SUPPORTED_LANGUAGES.includes(firstSegment as Language)) {
    return {
      locale: firstSegment as Language,
      pathWithoutLocale: '/' + segments.slice(1).join('/')
    };
  }
  
  return {
    locale: 'it',
    pathWithoutLocale: pathname
  };
}

export function isValidLocale(locale: string): locale is Language {
  return SUPPORTED_LANGUAGES.includes(locale as Language);
}

export function addLocaleToPath(path: string, locale: Language): string {
  if (locale === 'it') return path;
  return `/${locale}${path === '/' ? '' : path}`;
}

export function buildLocalizedPath(path: string, locale: Language): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  if (locale === 'it') {
    return cleanPath === '/' ? '/' : cleanPath.replace(/\/$/, '');
  }
  
  const normalizedPath = cleanPath === '/' ? '' : cleanPath;
  return `/${locale}${normalizedPath}`;
}

export function getAlternateUrls(path: string, baseUrl: string): Array<{ hreflang: string; href: string }> {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  const alternates: Array<{ hreflang: string; href: string }> = [
    { hreflang: 'x-default', href: `${baseUrl}${cleanPath}` }
  ];
  
  for (const locale of SUPPORTED_LANGUAGES) {
    alternates.push({
      hreflang: locale,
      href: locale === 'it' ? `${baseUrl}${cleanPath}` : `${baseUrl}/${locale}${cleanPath}`
    });
  }
  
  return alternates;
}
