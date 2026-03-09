import { useEffect } from 'react';
import { SITE_URL, SITE_NAME } from './constants';

const ensureMeta = (name: string): HTMLMetaElement => {
  let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('name', name);
    document.head.appendChild(element);
  }
  return element;
};

const ensureCanonical = (): HTMLLinkElement => {
  let element = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  return element;
};

export const injectJsonLd = (id: string, data: Record<string, unknown>): void => {
  const existing = document.getElementById(id);
  if (existing) {
    existing.textContent = JSON.stringify(data);
    return;
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = id;
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};

export const removeJsonLd = (id: string): void => {
  const element = document.getElementById(id);
  if (element) element.remove();
};

export const useSEO = (title: string, description: string, canonicalPath: string): void => {
  useEffect(() => {
    document.title = `${title} | ${SITE_NAME}`;
    ensureMeta('description').setAttribute('content', description);
    ensureCanonical().setAttribute('href', `${SITE_URL}${canonicalPath}`);
  }, [title, description, canonicalPath]);
};
