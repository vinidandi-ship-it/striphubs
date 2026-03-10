import { useEffect } from 'react';
import { SITE_NAME, SITE_URL } from './models';
import { categoryName } from './categories';

type PageType = 'home' | 'live' | 'category' | 'tag' | 'combination' | 'model' | 'search';

const ensureMeta = (name: string): HTMLMetaElement => {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.name = name;
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

export const generateTitle = (page: PageType, data?: Record<string, string>): string => {
  if (page === 'home') return 'Live Cam Gratis con Modelle Online e Dirette 24/7';
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
  if (page === 'model') return `${data?.username || 'Model'} Live Cam e Profilo`;
  if (page === 'search') return 'Cerca Modelle Live, Tag e Cam Online';
  return SITE_NAME;
};

export const generateDescription = (page: PageType, data?: Record<string, string>): string => {
  if (page === 'home') {
    return 'Scopri live cam gratuite con modelle online 24/7, categorie popolari, profili aggiornati in tempo reale e accesso rapido alle dirette più viste.';
  }
  if (page === 'live') return 'Guarda tutte le modelle live online adesso con elenco aggiornato, filtri rapidi e accesso diretto alle camere più viste.';
  if (page === 'category') return `Guarda ${data?.category || ''} cam live gratis con modelle online, profili aggiornati e accesso immediato alle dirette attive.`;
  if (page === 'tag') return `Esplora modelle live con tag ${data?.tag || ''}, camere online adesso e nuove dirette aggiornate in tempo reale.`;
  if (page === 'combination')
    return `Scopri ${data?.category || ''} cam live con tag ${data?.tag || ''}, modelle online e accesso veloce alle dirette attive.`;
  if (page === 'model') return `Guarda ${data?.username || 'questa modella'} live, apri il profilo e accedi subito alla sua cam online.`;
  if (page === 'search') return 'Cerca modelle live per username, tag, categoria e paese con risultati aggiornati in tempo reale.';
  return 'Directory di live cam gratuite con modelle online 24/7.';
};

export const useSEO = (title: string, description: string, path: string) => {
  useEffect(() => {
    document.title = `${title} | ${SITE_NAME}`;
    ensureMeta('description').setAttribute('content', description);
    ensureCanonical().setAttribute('href', `${SITE_URL}${path}`);
  }, [title, description, path]);
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
