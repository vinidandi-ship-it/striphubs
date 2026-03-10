import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_URL } from '../lib/models';
import { getAlternateUrls, getCanonicalUrl, DEFAULT_LANGUAGE, type Language } from '../lib/i18n';

const ensureLink = (rel: string, hreflang?: string): HTMLLinkElement => {
  const selector = hreflang 
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]`;
  let el = document.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    if (hreflang) el.hreflang = hreflang;
    document.head.appendChild(el);
  }
  return el;
};

const removeLink = (rel: string, hreflang?: string) => {
  const selector = hreflang 
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]`;
  const el = document.querySelector(selector);
  if (el) el.remove();
};

interface HreflangTagsProps {
  lang?: Language;
}

export default function HreflangTags({ lang = DEFAULT_LANGUAGE }: HreflangTagsProps) {
  const location = useLocation();
  
  useEffect(() => {
    const path = location.pathname;
    const alternates = getAlternateUrls(path, SITE_URL);
    const canonical = getCanonicalUrl(path, SITE_URL, lang);
    
    const existingHreflangs = new Set(
      Array.from(document.querySelectorAll('link[rel="alternate"][hreflang]'))
        .map((el) => (el as HTMLLinkElement).hreflang)
    );
    
    alternates.forEach(({ hreflang, href }) => {
      const link = ensureLink('alternate', hreflang);
      link.href = href;
      existingHreflangs.delete(hreflang);
    });
    
    existingHreflangs.forEach((hreflang) => {
      if (hreflang !== 'x-default') {
        removeLink('alternate', hreflang);
      }
    });
    
    const canonicalLink = ensureLink('canonical');
    canonicalLink.href = canonical;
    
    return () => {
      alternates.forEach(({ hreflang }) => {
        removeLink('alternate', hreflang);
      });
    };
  }, [location.pathname, lang]);

  return null;
}
