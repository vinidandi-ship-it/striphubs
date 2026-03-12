import { useEffect, useMemo } from 'react';
import { SITE_NAME, SITE_URL } from './models';
import { categoryName } from './categories';
import { getAlternateUrls, getCanonicalUrl, type Language, DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from './i18n';

type PageType = 'home' | 'live' | 'category' | 'tag' | 'combination' | 'country' | 'model' | 'search';

interface SEOOptions {
  image?: string;
  keywords?: string[];
  type?: 'website' | 'video.other' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

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

export const generateDynamicOGImage = (
  title: string,
  subtitle?: string,
  thumbnail?: string
): string => {
  if (thumbnail && thumbnail.startsWith('http')) {
    return thumbnail;
  }
  const params = new URLSearchParams({
    title: title.slice(0, 60),
    subtitle: subtitle || SITE_NAME
  });
  return `${SITE_URL}/api/og?${params.toString()}`;
};

export const getRobotsContent = (noindex?: boolean, nofollow?: boolean): string => {
  const directives: string[] = [];
  directives.push(noindex ? 'noindex' : 'index');
  directives.push(nofollow ? 'nofollow' : 'follow');
  directives.push('max-snippet:-1');
  directives.push('max-image-preview:large');
  directives.push('max-video-preview:-1');
  return directives.join(', ');
};

export const generateTitle = (page: PageType, data?: Record<string, string>): string => {
  if (page === 'home') return 'StripHubs - Live Cam Gratis | Directory Modelle Online';
  if (page === 'live') return 'Cam Live Gratis - Tutte le Modelle Online | StripHubs';
  if (page === 'category') {
    const label = categoryName(data?.category || '');
    return `${label} Cam Live Gratis - ${label} Online 24/7`;
  }
  if (page === 'tag') {
    const tag = data?.tag || '';
    return `${tag.charAt(0).toUpperCase() + tag.slice(1)} Cam Live - Modelle Online`;
  }
  if (page === 'combination') {
    const cat = categoryName(data?.category || '');
    const tag = data?.tag || '';
    return `${cat} ${tag} Cam Live Gratis`;
  }
  if (page === 'country') return `Cam ${data?.country || 'Modelle'} Live Gratis - Modelle Online`;
  if (page === 'model') return `${data?.username || 'Model'} Live Cam - Diretta Streaming`;
  if (page === 'search') return 'Cerca Modelle Live Cam - Ricerca';
  return SITE_NAME;
};

export const generateDescription = (page: PageType, data?: Record<string, string>): string => {
  if (page === 'home') {
    return 'StripHubs: directory live cam gratis con migliaia di modelle online 24/7. Teen, milf, asiatiche, italiane. Chat porno gratis senza registrazione. Streaming HD.';
  }
  if (page === 'live') return 'Guarda tutte le cam live gratis. Migliaia di modelle online con filtri per categoria, paese e popolarità. Chat porno gratis senza registrazione.';
  if (page === 'category') return `${data?.category || ''} cam live gratis. Modelle ${data?.category || ''} online 24/7. Chat porno gratis, streaming HD, senza registrazione.`;
  if (page === 'tag') return `Modelle live con tag ${data?.tag || ''}. Webcam gratis online aggiornate in tempo reale. Chat senza registrazione, streaming HD.`;
  if (page === 'combination')
    return `${data?.category || ''} cam live con tag ${data?.tag || ''}. Modelle online 24/7. Chat porno gratis senza registrazione. Streaming HD.`;
  if (page === 'country') return `Cam ${data?.country || 'modelle'} live gratis. Modelle ${data?.country || ''} online con filtri per categoria. Chat senza registrazione.`;
  if (page === 'model') return `Guarda ${data?.username || 'questa modella'} live in streaming HD. Chat porno gratis, senza registrazione. Profilo e accesso diretto.`;
  if (page === 'search') return 'Cerca modelle live per username, tag, categoria o paese. Webcam gratis senza registrazione. Risultati in tempo reale.';
  return 'StripHubs - Directory live cam gratis con modelle online 24/7. Chat porno senza registrazione. Streaming HD.';
};

export const useSEO = (title: string, description: string, path: string, lang?: Language) => {
  useAdvancedSEO(title, description, path, { lang });
};

export const useAdvancedSEO = (
  title: string,
  description: string,
  path: string,
  options?: SEOOptions & { lang?: Language }
) => {
  const {
    lang = DEFAULT_LANGUAGE,
    image,
    keywords,
    type = 'website',
    author,
    publishedTime,
    modifiedTime,
    section,
    noindex,
    nofollow
  } = options || {};

  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    const url = `${SITE_URL}${path}`;
    const ogImage = image || `${SITE_URL}/icon-512.png`;
    const currentLang = lang || DEFAULT_LANGUAGE;

    document.title = fullTitle;
    
    ensureMeta('description').setAttribute('content', description);
    ensureMeta('robots').setAttribute('content', getRobotsContent(noindex, nofollow));
    ensureMeta('googlebot').setAttribute('content', getRobotsContent(noindex, nofollow));
    
    if (keywords && keywords.length > 0) {
      ensureMeta('keywords').setAttribute('content', keywords.join(', '));
    }
    
    if (author) {
      ensureMeta('author').setAttribute('content', author);
    }

    ensureMeta('twitter:card').setAttribute('content', 'summary_large_image');
    ensureMeta('twitter:site').setAttribute('content', '@striphubs');
    ensureMeta('twitter:title').setAttribute('content', fullTitle.slice(0, 70));
    ensureMeta('twitter:description').setAttribute('content', description.slice(0, 200));
    ensureMeta('twitter:image').setAttribute('content', ogImage);
    
    ensurePropertyMeta('og:title').setAttribute('content', fullTitle.slice(0, 60));
    ensurePropertyMeta('og:description').setAttribute('content', description.slice(0, 160));
    ensurePropertyMeta('og:url').setAttribute('content', url);
    ensurePropertyMeta('og:image').setAttribute('content', ogImage);
    ensurePropertyMeta('og:image:width').setAttribute('content', '1200');
    ensurePropertyMeta('og:image:height').setAttribute('content', '630');
    ensurePropertyMeta('og:type').setAttribute('content', type);
    ensurePropertyMeta('og:site_name').setAttribute('content', SITE_NAME);
    ensurePropertyMeta('og:locale').setAttribute('content', currentLang);
    
    SUPPORTED_LANGUAGES.filter(l => l !== currentLang).forEach(l => {
      ensurePropertyMeta(`og:locale:alternate`).setAttribute('content', l);
    });
    
    if (publishedTime) {
      ensurePropertyMeta('article:published_time').setAttribute('content', publishedTime);
    }
    if (modifiedTime) {
      ensurePropertyMeta('article:modified_time').setAttribute('content', modifiedTime);
    }
    if (section) {
      ensurePropertyMeta('article:section').setAttribute('content', section);
    }
    
    const canonicalUrl = getCanonicalUrl(path, SITE_URL, currentLang);
    ensureCanonical().setAttribute('href', canonicalUrl);
    
    removeAlternateLinks();
    const alternates = getAlternateUrls(path, SITE_URL);
    alternates.forEach(({ hreflang, href }) => {
      const link = ensureAlternateLink(hreflang);
      link.href = href;
    });
    
    const prevLink = document.querySelector('link[rel="prev"]') as HTMLLinkElement;
    const nextLink = document.querySelector('link[rel="next"]') as HTMLLinkElement;
    if (prevLink) prevLink.remove();
    if (nextLink) nextLink.remove();
    
  }, [title, description, path, lang, image, keywords, type, author, publishedTime, modifiedTime, section, noindex, nofollow]);
};

export const usePaginationSEO = (
  path: string,
  currentPage: number,
  totalPages: number
) => {
  useEffect(() => {
    const removeLink = (rel: string) => {
      const el = document.querySelector(`link[rel="${rel}"]`);
      if (el) el.remove();
    };
    
    const addLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement('link');
        el.rel = rel;
        document.head.appendChild(el);
      }
      el.href = href;
    };
    
    removeLink('prev');
    removeLink('next');
    
    if (currentPage > 1) {
      const prevPath = currentPage === 2 ? path : `${path}?page=${currentPage - 1}`;
      addLink('prev', `${SITE_URL}${prevPath}`);
    }
    
    if (currentPage < totalPages) {
      addLink('next', `${SITE_URL}${path}?page=${currentPage + 1}`);
    }
    
    return () => {
      removeLink('prev');
      removeLink('next');
    };
  }, [path, currentPage, totalPages]);
};

export const useModelSEO = (
  model: {
    username: string;
    thumbnail: string;
    viewers: number;
    tags: string[];
    country: string;
    category: string;
    isLive: boolean;
  },
  path: string,
  lang?: Language
) => {
  const title = `${model.username} Live Cam - ${categoryName(model.category)} - StripHubs`;
  const description = `Guarda ${model.username} in diretta streaming HD. ${model.viewers.toLocaleString()} spettatori online. Categoria: ${categoryName(model.category)}. Gratis, senza registrazione.`;
  
  useAdvancedSEO(title, description, path, {
    lang,
    image: model.thumbnail,
    keywords: [model.username, model.category, ...model.tags.slice(0, 5), 'live cam', 'streaming'],
    type: 'video.other',
    section: model.category
  });
};

export const useCategorySEO = (
  category: string,
  modelCount: number,
  path: string,
  lang?: Language
) => {
  const catName = categoryName(category);
  const title = `${catName} Cam Live Gratis - ${modelCount} Modelle Online - StripHubs`;
  const description = `Scopri ${modelCount} modelle ${catName} online in diretta streaming. Cam live gratis 24/7, filtra per età, paese e preferenze. Nessuna registrazione.`;
  
  useAdvancedSEO(title, description, path, {
    lang,
    keywords: [category, catName, 'live cam', 'streaming', 'gratis'],
    section: category
  });
};

export const useTagSEO = (
  tag: string,
  modelCount: number,
  path: string,
  lang?: Language
) => {
  const tagName = tag.charAt(0).toUpperCase() + tag.slice(1);
  const title = `${tagName} Cam Live Gratis - ${modelCount} Modelle Online - StripHubs`;
  const description = `Esplora ${modelCount} modelle con tag ${tagName} in diretta streaming. Le cam più hot con ${tagName} sono qui. Gratis, senza registrazione.`;
  
  useAdvancedSEO(title, description, path, {
    lang,
    keywords: [tag, tagName, 'live cam', 'streaming', 'tag'],
    section: tag
  });
};

export const useCountrySEO = (
  countryName: string,
  modelCount: number,
  path: string,
  lang?: Language
) => {
  const title = `Cam ${countryName} Live Gratis - ${modelCount} Modelle Online - StripHubs`;
  const description = `Guarda ${modelCount} cam ${countryName.toLowerCase()} in diretta streaming gratis. Modelle online 24/7, filtra per categoria e tag. Nessuna registrazione.`;
  
  useAdvancedSEO(title, description, path, {
    lang,
    keywords: [countryName, 'live cam', 'streaming', countryName.toLowerCase()],
    section: countryName
  });
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
