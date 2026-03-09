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
