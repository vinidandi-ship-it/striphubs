import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from './api';
import type { Model } from './models';

type UseModelsByProviderParams = {
  category?: string;
  country?: string;
  tag?: string;
  search?: string;
  pageSize: number;
  initialIncludeOffline?: boolean;
};

type ProviderModels = {
  stripchat: Model[];
  chaturbate: Model[];
};

type UseModelsByProviderReturn = {
  models: ProviderModels;
  total: { stripchat: number; chaturbate: number; total: number };
  loading: { stripchat: boolean; chaturbate: boolean };
  loadingMore: { stripchat: boolean; chaturbate: boolean };
  error: { stripchat: string; chaturbate: string };
  hasMore: { stripchat: boolean; chaturbate: boolean };
  includeOffline: boolean;
  toggleIncludeOffline: () => void;
  sentinelRef: React.RefObject<HTMLDivElement>;
  reload: () => void;
  loadMore: () => void;
};

export function useModelsByProvider({
  category,
  country,
  tag,
  search,
  pageSize,
  initialIncludeOffline = false
}: UseModelsByProviderParams): UseModelsByProviderReturn {
  const [stripchatModels, setStripchatModels] = useState<Model[]>([]);
  const [chaturbateModels, setChaturbateModels] = useState<Model[]>([]);
  const [total, setTotal] = useState({ stripchat: 0, chaturbate: 0, total: 0 });
  const [loading, setLoading] = useState({ stripchat: true, chaturbate: true });
  const [loadingMore, setLoadingMore] = useState({ stripchat: false, chaturbate: false });
  const [error, setError] = useState({ stripchat: '', chaturbate: '' });
  const [hasMore, setHasMore] = useState({ stripchat: false, chaturbate: false });
  const [offset, setOffset] = useState(0);
  const [includeOffline, setIncludeOffline] = useState(initialIncludeOffline);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadFromProvider = useCallback(async (
    provider: 'stripchat' | 'chaturbate',
    isLoadMore = false
  ) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      if (isLoadMore) {
        setLoadingMore(prev => ({ ...prev, [provider]: true }));
      } else {
        setLoading(prev => ({ ...prev, [provider]: true }));
        setError(prev => ({ ...prev, [provider]: '' }));
      }

      const data = await api.getModels({
        category,
        country,
        tag,
        search,
        limit: pageSize,
        offset: isLoadMore ? offset : 0,
        liveOnly: !includeOffline,
        provider
      });

      const newModels = (data.models || []).map(m => ({ ...m, provider }));
      
      if (isLoadMore) {
        if (provider === 'stripchat') {
          setStripchatModels(prev => [...prev, ...newModels]);
        } else {
          setChaturbateModels(prev => [...prev, ...newModels]);
        }
      } else {
        if (provider === 'stripchat') {
          setStripchatModels(newModels);
        } else {
          setChaturbateModels(newModels);
        }
      }

      setTotal(prev => ({
        ...prev,
        [provider]: data.total || newModels.length,
        total: (provider === 'stripchat' ? data.total || newModels.length : (prev.stripchat || 0)) + 
               (provider === 'chaturbate' ? data.total || newModels.length : (prev.chaturbate || 0))
      }));

      setHasMore(prev => ({
        ...prev,
        [provider]: data.hasMore !== false && newModels.length >= pageSize
      }));

      if (!isLoadMore) {
        setOffset(pageSize);
      } else {
        setOffset(prev => prev + pageSize);
      }

    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError(prev => ({ ...prev, [provider]: (err as Error).message }));
      }
    } finally {
      setLoading(prev => ({ ...prev, [provider]: false }));
      setLoadingMore(prev => ({ ...prev, [provider]: false }));
    }
  }, [category, country, tag, search, pageSize, offset, includeOffline]);

  useEffect(() => {
    loadFromProvider('stripchat');
    loadFromProvider('chaturbate');
  }, []);

  const reload = useCallback(() => {
    setOffset(0);
    loadFromProvider('stripchat', false);
    loadFromProvider('chaturbate', false);
  }, [loadFromProvider]);

  const loadMore = useCallback(() => {
    if (!loadingMore.stripchat && hasMore.stripchat) {
      loadFromProvider('stripchat', true);
    }
    if (!loadingMore.chaturbate && hasMore.chaturbate) {
      loadFromProvider('chaturbate', true);
    }
  }, [loadingMore, hasMore, loadFromProvider]);

  const toggleIncludeOffline = useCallback(() => {
    setIncludeOffline(prev => !prev);
    setOffset(0);
    loadFromProvider('stripchat', false);
    loadFromProvider('chaturbate', false);
  }, [loadFromProvider]);

  return {
    models: {
      stripchat: stripchatModels,
      chaturbate: chaturbateModels
    },
    total,
    loading,
    loadingMore,
    error,
    hasMore,
    includeOffline,
    toggleIncludeOffline,
    sentinelRef,
    reload,
    loadMore
  };
}
