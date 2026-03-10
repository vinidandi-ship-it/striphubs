import type { Model } from './models';

type ModelsResponse = {
  models: Model[];
  total?: number;
  offset?: number;
  hasMore?: boolean;
};

type CategoryResponse = {
  categories: { slug: string; name: string; count: number }[];
};

// Mock data for local development - increased to 200 models for better testing
const mockModels: Model[] = Array.from({ length: 200 }, (_, i) => ({
  username: `model${i + 1}`,
  thumbnail: `https://picsum.photos/seed/model${i + 1}/640/800`,
  viewers: Math.floor(Math.random() * 500) + 10,
  tags: ['girl', 'live', 'cam', ['curvy', 'petite', 'blonde'][Math.floor(Math.random() * 3)]],
  country: ['US', 'GB', 'DE', 'IT', 'ES', 'FR'][Math.floor(Math.random() * 6)],
  category: ['milf', 'teen', 'blonde', 'brunette', 'asian'][Math.floor(Math.random() * 5)],
  isLive: true,
  clickUrl: `https://stripchat.com/model${i + 1}?userId=affiliate`
}));

const mockCategories = [
  { slug: 'milf', name: 'MILF', count: 5 },
  { slug: 'teen', name: 'Teen', count: 5 },
  { slug: 'blonde', name: 'Blonde', count: 4 },
  { slug: 'brunette', name: 'Brunette', count: 5 },
  { slug: 'asian', name: 'Asian', count: 5 }
];

const request = async <T>(path: string): Promise<T> => {
  const isDev = import.meta.env.DEV;

  if (isDev) {
    if (path.startsWith('/api/models')) {
      const url = new URL(path, window.location.origin);
      const limit = Number(url.searchParams.get('limit')) || 120;
      const offset = Number(url.searchParams.get('offset')) || 0;
      const slicedModels = mockModels.slice(offset, offset + limit);
      return Promise.resolve({ 
        models: slicedModels,
        hasMore: offset + limit < mockModels.length
      } as T);
    }
    if (path.startsWith('/api/categories')) {
      return Promise.resolve({ categories: mockCategories } as T);
    }
    if (path.startsWith('/api/model')) {
      const url = new URL(path, window.location.origin);
      const name = url.searchParams.get('name') || 'model1';
      return Promise.resolve(mockModels[0] as T);
    }
    return Promise.resolve({ models: mockModels } as T);
  }

  // Production: call real API
  const baseUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_STRIPCHAT_API_ENDPOINT || '';
  let url = path;
  if (baseUrl) {
    // If baseUrl ends with '/api/models' and path starts with '/api/models', strip the path prefix
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
