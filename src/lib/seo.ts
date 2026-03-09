import { useEffect } from 'react';
import { SITE_NAME, SITE_URL } from './models';

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

export const generateTitle = (page: string, data?: Record<string, string>): string => {
  if (page === 'home') return 'Live Cam Models - Free Webcam Shows';
  if (page === 'live') return 'All Live Cam Models';
  if (page === 'category') return `Watch Live ${(data?.category || '').toUpperCase()} Cam Models`;
  if (page === 'model') return `Watch ${data?.username || 'Model'} Live Cam Show`;
  if (page === 'search') return 'Search Live Cam Models';
  if (page === 'tag') return `Live Cam Tag: ${data?.tag || ''}`;
  return SITE_NAME;
};

export const generateDescription = (page: string, data?: Record<string, string>): string => {
  if (page === 'home') return 'Discover live cam models with fast filters and real-time listings.';
  if (page === 'live') return 'Browse all currently online live cam performers.';
  if (page === 'category') return `Explore live ${data?.category || ''} cam models.`;
  if (page === 'model') return `Watch ${data?.username || 'this model'} with one-click access.`;
  if (page === 'search') return 'Search cam models by username, tags, and country.';
  if (page === 'tag') return `Browse live models for tag ${data?.tag || ''}.`;
  return 'Live cam directory.';
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
