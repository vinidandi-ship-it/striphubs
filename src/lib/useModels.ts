import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from './api';
import type { Model } from './models';
import { useInfiniteLoad } from './useInfiniteLoad';

type UseModelsParams = {
  category?: string;
  country?: string;
  tag?: string;
  search?: string;
  pageSize: number;
  initialIncludeOffline?: boolean;
};

type UseModelsReturn = {
  models: Model[];
  total: number;
  loading: boolean;
  loadingMore: boolean;
  error: string;
  hasMore: boolean;
  includeOffline: boolean;
  toggleIncludeOffline: () => void;
  sentinelRef: React.RefObject<HTMLDivElement>;
  reload: () => void;
};

export function useModels({
  category,
  country,
  tag,
  search,
  pageSize,
  initialIncludeOffline = false
}: UseModelsParams): UseModelsReturn {
  const [models, setModels] = useState<Model[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [includeOffline, setIncludeOffline] = useState(initialIncludeOffline);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadModels = useCallback(async (reset = false) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    if (reset) {
      setLoading(true);
      setOffset(0);
      setHasMore(false);
      setError('');
    }

    try {
      const data = await api.getModels({
        category,
        country,
        tag,
        search,
        limit: pageSize,
        offset: reset ? 0 : offset,
        liveOnly: !includeOffline
      });

      if (reset) {
        setModels(data.models);
        setTotal(data.total || data.models.length);
      } else {
        setModels((current) => {
          const seen = new Set(current.map((item) => item.username.toLowerCase()));
          const merged = [...current];
          for (const item of data.models) {
            if (!seen.has(item.username.toLowerCase())) {
              seen.add(item.username.toLowerCase());
              merged.push(item);
            }
          }
          return merged;
        });
      }
      setOffset((current) => (reset ? data.models.length : current + data.models.length));
      setHasMore(Boolean(data.hasMore));
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Failed to load models');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [category, country, tag, search, pageSize, offset, includeOffline]);

  useEffect(() => {
    loadModels(true);
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [category, country, tag, search, includeOffline]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    loadModels(false);
  }, [loadingMore, hasMore, loadModels]);

  useInfiniteLoad({
    targetRef: sentinelRef,
    enabled: hasMore && !loading,
    loading: loadingMore,
    onLoadMore: loadMore
  });

  const toggleIncludeOffline = useCallback(() => {
    setIncludeOffline((current) => !current);
  }, []);

  const reload = useCallback(() => {
    loadModels(true);
  }, [loadModels]);

  return {
    models,
    total,
    loading,
    loadingMore,
    error,
    hasMore,
    includeOffline,
    toggleIncludeOffline,
    sentinelRef,
    reload
  };
}
