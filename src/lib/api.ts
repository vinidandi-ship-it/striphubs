import type { Model } from './models';

type ModelsResponse = {
  models: Model[];
  total?: number;
  offset?: number;
  hasMore?: boolean;
  providers?: { stripchat: number; chaturbate: number };
};

type CategoryResponse = {
  categories: { slug: string; name: string; count: number }[];
};

const request = async <T>(path: string): Promise<T> => {
  const isDev = import.meta.env.DEV;

  if (isDev) {
    if (path.startsWith('/api/models')) {
      return fetch(path).then(r => r.json()) as Promise<T>;
    }
    if (path.startsWith('/api/categories')) {
      return fetch('/api/categories').then(r => r.json()) as Promise<T>;
    }
    if (path.startsWith('/api/model')) {
      const url = new URL(path, window.location.origin);
      const name = url.searchParams.get('name') || 'model1';
      return fetch(`/api/models?limit=1&search=${name}`).then(r => r.json().then(d => d.models?.[0] || { username: name })) as Promise<T>;
    }
    return fetch(path).then(r => r.json()) as Promise<T>;
  }

  const baseUrl = import.meta.env.VITE_API_URL || '';
  let url = path;
  
  if (baseUrl) {
    if (path.startsWith('/api/models') && baseUrl.endsWith('/api/models')) {
      url = baseUrl + path.replace('/api/models', '');
    } else {
      url = `${baseUrl}${path}`;
    }
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' }
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`API error ${response.status}: ${detail}`);
  }

  return (await response.json()) as T;
};

export const api = {
  getModels: (params?: {
    category?: string;
    tag?: string;
    country?: string;
    search?: string;
    limit?: number;
    offset?: number;
    modelsList?: string;
    strict?: 0 | 1;
    liveOnly?: boolean;
  }) => {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.tag) query.set('tag', params.tag);
    if (params?.country) query.set('country', params.country);
    if (params?.search) query.set('search', params.search);
    if (params?.limit) query.set('limit', String(params.limit));
    if (typeof params?.offset === 'number') query.set('offset', String(params.offset));
    if (params?.modelsList) query.set('modelsList', params.modelsList);
    if (typeof params?.strict === 'number') query.set('strict', String(params.strict));
    if (typeof params?.liveOnly === 'boolean') query.set('liveOnly', params.liveOnly ? '1' : '0');

    const suffix = query.toString() ? `?${query}` : '';
    return request<ModelsResponse>(`/api/models${suffix}`);
  },

  getModel: (name: string) => request<Model>(`/api/model?name=${encodeURIComponent(name)}`),

  getCategories: () => request<CategoryResponse>('/api/categories')
};
