import { SupportedLocale, SUPPORTED_LOCALES } from './types';

export function extractLocaleFromPath(pathname: string): { locale: SupportedLocale; pathWithoutLocale: string } {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (firstSegment && SUPPORTED_LOCALES.includes(firstSegment as SupportedLocale)) {
    return {
      locale: firstSegment as SupportedLocale,
      pathWithoutLocale: '/' + segments.slice(1).join('/')
    };
  }
  
  return {
    locale: 'it',
    pathWithoutLocale: pathname
  };
}

export function isValidLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

export function addLocaleToPath(path: string, locale: SupportedLocale): string {
  if (locale === 'it') return path;
  return `/${locale}${path === '/' ? '' : path}`;
}

export function buildLocalizedPath(path: string, locale: SupportedLocale): string {
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
  
  for (const locale of SUPPORTED_LOCALES) {
    alternates.push({
      hreflang: locale,
      href: locale === 'it' ? `${baseUrl}${cleanPath}` : `${baseUrl}/${locale}${cleanPath}`
    });
  }
  
  return alternates;
}
