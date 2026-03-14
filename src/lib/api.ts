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

type ChaturbateRoom = {
  room: string;
  viewers: number;
  gender: string;
  tags: string[];
  language: string;
  image_url: string;
};

const requestChaturbateModels = async (endpoint: string, params: {
  category?: string;
  tag?: string;
  country?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<ModelsResponse> => {
  const query = new URLSearchParams();
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.offset) query.set('offset', String(params.offset));
  
  const suffix = query.toString() ? `&${query}` : '';
  const url = `${endpoint}${suffix}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Chaturbate API error ${response.status}`);
  }
  
  const data = await response.json();
  
  const rooms: ChaturbateRoom[] = data.rooms || [];
  
  const models: Model[] = rooms.map((room: any) => ({
    username: room.room || room.username,
    thumbnail: room.image_url || room.preview_url || '',
    viewers: room.viewers || 0,
    tags: room.tags || [],
    country: room.country || '',
    category: room.gender || 'female',
    isLive: true,
    provider: 'chaturbate' as const,
    languages: room.language ? [room.language] : []
  }));
  
  return {
    models,
    total: models.length,
    hasMore: models.length >= (params.limit || 50)
  };
};

const request = async <T>(path: string): Promise<T> => {
  const isDev = import.meta.env.DEV;

  if (isDev) {
    if (path === '/api/models' || path.startsWith('/api/models?') || path === '/api/models-multi' || path.startsWith('/api/models-multi?')) {
      return fetch(path).then(r => r.json()) as Promise<T>;
    }
    if (path.startsWith('/api/categories')) {
      return fetch('/api/categories').then(r => r.json()) as Promise<T>;
    }
    if (path.startsWith('/api/model')) {
      const url = new URL(path, window.location.origin);
      const name = url.searchParams.get('name') || 'model1';
      return fetch(`/api/models-multi?limit=1&search=${name}`).then(r => r.json().then(d => d.models?.[0] || { username: name })) as Promise<T>;
    }
    return fetch(path).then(r => r.json()) as Promise<T>;
  }

  const baseUrl = import.meta.env.VITE_API_URL || '';
  let url = path;
  
  if (baseUrl) {
    if ((path === '/api/models' || path.startsWith('/api/models?')) && baseUrl.endsWith('/api/models')) {
      url = baseUrl + path.replace('/api/models', '');
    } else if ((path === '/api/models-multi' || path.startsWith('/api/models-multi?')) && baseUrl.endsWith('/api/models')) {
      const modelsMultiBase = `${baseUrl.replace(/\/api\/models$/, '')}/api/models-multi`;
      url = modelsMultiBase + path.replace('/api/models-multi', '');
    } else {
      url = `${baseUrl}${path}`;
    }
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: { 
      Accept: 'application/json',
      'X-API-Key': import.meta.env.STRIPCASH_API_KEY || ''
    }
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
    provider?: 'stripchat' | 'chaturbate';
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

    let endpoint: string;
    
    if (params?.provider === 'chaturbate') {
      const baseEndpoint = import.meta.env.CHATURBATE_API_URL || 'https://it.chaturbate.com/api/public/affiliates/onlinerooms/';
      endpoint = `${baseEndpoint}?client_ip=request_ip&wm=fxmnz`;
      return requestChaturbateModels(endpoint, params);
    } else {
      endpoint = import.meta.env.VITE_MODELS_ENDPOINT || import.meta.env.STRIPCHAT_API_ENDPOINT || '/api/models-multi';
      return request<ModelsResponse>(`${endpoint}${suffix}`).catch(() => request<ModelsResponse>(`/api/models${suffix}`));
    }
  },

  getModel: (name: string) => request<Model>(`/api/model?name=${encodeURIComponent(name)}`),

  getCategories: () => request<CategoryResponse>('/api/categories')
};
