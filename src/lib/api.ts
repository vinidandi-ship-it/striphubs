import type { Model } from './models';

type ModelsResponse = {
  count?: number;
  models: Model[];
};

type CategoryResponse = {
  categories: { slug: string; name: string; count: number }[];
};

const request = async <T>(path: string): Promise<T> => {
  const response = await fetch(path, {
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
    search?: string;
    limit?: number;
    modelsList?: string;
    strict?: 0 | 1;
  }) => {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.tag) query.set('tag', params.tag);
    if (params?.search) query.set('search', params.search);
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.modelsList) query.set('modelsList', params.modelsList);
    if (typeof params?.strict === 'number') query.set('strict', String(params.strict));

    const suffix = query.toString() ? `?${query}` : '';
    return request<ModelsResponse>(`/api/models${suffix}`);
  },

  getModel: (name: string) => request<Model>(`/api/model?name=${encodeURIComponent(name)}`),

  getCategories: () => request<CategoryResponse>('/api/categories')
};
