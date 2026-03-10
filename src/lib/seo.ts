import { useEffect } from 'react';
import { SITE_NAME, SITE_URL } from './models';
import { categoryName } from './categories';
import { getAlternateUrls, getCanonicalUrl, type Language, DEFAULT_LANGUAGE } from './i18n';

type PageType = 'home' | 'live' | 'category' | 'tag' | 'combination' | 'country' | 'model' | 'search';

const ensureMeta = (name: string): HTMLMetaElement => {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.name = name;
    document.head.appendChild(el);
  }
  return el;
};

const ensurePropertyMeta = (property: string): HTMLMetaElement => {
  let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  return el;
};

const ensureCanonical = (): HTMLLinkElement => {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  return el;
};

const ensureAlternateLink = (hreflang: string): HTMLLinkElement => {
  let el = document.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = 'alternate';
    el.hreflang = hreflang;
    document.head.appendChild(el);
  }
  return el;
};

const removeAlternateLinks = () => {
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
};

export const generateTitle = (page: PageType, data?: Record<string, string>): string => {
  if (page === 'home') return 'Live Cam Giovani e Link Stripchat';
  if (page === 'live') return 'Cam Live Gratis Online Ora';
  if (page === 'category') {
    const label = categoryName(data?.category || '');
    return `${label} Cam Live Gratis Online`;
  }
  if (page === 'tag') {
    const tag = data?.tag || '';
    return `${tag.charAt(0).toUpperCase() + tag.slice(1)} Cam Live e Modelle Online`;
  }
  if (page === 'combination') {
    const cat = categoryName(data?.category || '');
    const tag = data?.tag || '';
    return `${cat} ${tag} Cam Live Gratis`;
  }
  if (page === 'country') return `${data?.country || 'Modelle'} Cam Live Gratis`;
  if (page === 'model') return `${data?.username || 'Model'} Live Cam e Profilo`;
  if (page === 'search') return 'Cerca Modelle Live, Tag e Cam Online';
  return SITE_NAME;
};

export const generateDescription = (page: PageType, data?: Record<string, string>): string => {
  if (page === 'home') {
    return 'StripHubs è la directory italiana delle live cam gratis con centinaia di modelle online, filtri per teen, milf e paesi e link immediati alle dirette Stripchat.';
  }
  if (page === 'live') return 'Guarda tutte le modelle live online adesso con elenco aggiornato, filtri rapidi e accesso diretto alle camere più viste.';
  if (page === 'category') return `Guarda ${data?.category || ''} cam live gratis con modelle online, profili aggiornati e accesso immediato alle dirette attive.`;
  if (page === 'tag') return `Esplora modelle live con tag ${data?.tag || ''}, camere online adesso e nuove dirette aggiornate in tempo reale.`;
  if (page === 'combination')
    return `Scopri ${data?.category || ''} cam live con tag ${data?.tag || ''}, modelle online e accesso veloce alle dirette attive.`;
  if (page === 'country') return `Guarda ${data?.country || 'modelle'} live online con profili attivi, categorie popolari e accesso rapido alle camere più viste.`;
  if (page === 'model') return `Guarda ${data?.username || 'questa modella'} live, apri il profilo e accedi subito alla sua cam online.`;
  if (page === 'search') return 'Cerca modelle live per username, tag, categoria e paese con risultati aggiornati in tempo reale.';
  return 'Directory di live cam gratuite con modelle online 24/7.';
};

export const useSEO = (title: string, description: string, path: string, lang?: Language) => {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    const url = `${SITE_URL}${path}`;
    const image = `${SITE_URL}/icon-512.png`;
    const currentLang = lang || DEFAULT_LANGUAGE;

    document.title = fullTitle;
    ensureMeta('description').setAttribute('content', description);
    ensureMeta('twitter:title').setAttribute('content', fullTitle);
    ensureMeta('twitter:description').setAttribute('content', description);
    ensureMeta('twitter:image').setAttribute('content', image);
    ensurePropertyMeta('og:title').setAttribute('content', fullTitle);
    ensurePropertyMeta('og:description').setAttribute('content', description);
    ensurePropertyMeta('og:url').setAttribute('content', url);
    ensurePropertyMeta('og:image').setAttribute('content', image);
    ensurePropertyMeta('og:locale').setAttribute('content', currentLang);
    
    const canonicalUrl = getCanonicalUrl(path, SITE_URL, currentLang);
    ensureCanonical().setAttribute('href', canonicalUrl);
    
    removeAlternateLinks();
    const alternates = getAlternateUrls(path, SITE_URL);
    alternates.forEach(({ hreflang, href }) => {
      const link = ensureAlternateLink(hreflang);
      link.href = href;
    });
  }, [title, description, path, lang]);
};

export const upsertJsonLd = (id: string, payload: Record<string, unknown>) => {
  let node = document.getElementById(id) as HTMLScriptElement | null;
  if (!node) {
    node = document.createElement('script');
    node.id = id;
    node.type = 'application/ld+json';
    document.head.appendChild(node);
  }
  node.text = JSON.stringify(payload);
};

export const removeJsonLd = (id: string) => {
  const node = document.getElementById(id);
  if (node) node.remove();
};

export const upsertVideoJsonLd = (id: string, model: { username: string; thumbnail: string; isLive: boolean }) => {
  let node = document.getElementById(id) as HTMLScriptElement | null;
  if (!node) {
    node = document.createElement('script');
    node.id = id;
    node.type = 'application/ld+json';
    document.head.appendChild(node);
  }
  
  const payload = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: `${model.username} Live Cam`,
    description: `Guarda ${model.username} live in diretta streaming.`,
    thumbnailUrl: model.thumbnail,
    uploadDate: new Date().toISOString(),
    expires: model.isLive ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : undefined,
    contentUrl: `${SITE_URL}/model/${encodeURIComponent(model.username)}`,
    embedUrl: `${SITE_URL}/model/${encodeURIComponent(model.username)}`,
    interactionCount: 1 // Placeholder per visualizzazioni
  };
  
  node.text = JSON.stringify(payload);
};

export const useFaqJsonLd = (
  id: string,
  items: Array<{ question: string; answer: string }>
) => {
  useEffect(() => {
    if (!items.length) return;

    upsertJsonLd(id, {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer
        }
      }))
    });

    return () => removeJsonLd(id);
  }, [id, items]);
};
