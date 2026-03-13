import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import InfiniteLoader from '../components/InfiniteLoader';
import ModelGrid from '../components/ModelGrid';
import SearchBar from '../components/SearchBar';
import { api } from '../lib/api';
import { Model } from '../lib/models';
import { generateDescription, generateTitle, useAdvancedSEO } from '../lib/seo';
import { useInfiniteLoad } from '../lib/useInfiniteLoad';
import UniversalAds from '../components/UniversalAds';

export default function Search() {
  const PAGE_SIZE = 120;
  const [params] = useSearchParams();
  const query = params.get('q') || '';
  const { t } = useI18n();

  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useAdvancedSEO(generateTitle('search'), generateDescription('search'), '/search', { noindex: true });

  useEffect(() => {
    setLoading(true);
    setOffset(0);
    setHasMore(false);
    setError('');
    void Promise.allSettled([
      api.getModels({ search: query, limit: PAGE_SIZE, offset: 0, liveOnly: false }),
      query.trim() ? api.getModel(query.trim()) : Promise.reject(new Error('empty query'))
    ]).then(([searchResult, exactResult]) => {
      const searchModels = searchResult.status === 'fulfilled' ? searchResult.value.models : [];
      const exactModel = exactResult.status === 'fulfilled' ? exactResult.value : null;

      const merged = exactModel
        ? [exactModel, ...searchModels.filter((item) => item.username.toLowerCase() !== exactModel.username.toLowerCase())]
        : searchModels;

      setModels(merged);
      setOffset(searchModels.length);
      setHasMore(searchResult.status === 'fulfilled' ? Boolean(searchResult.value.hasMore) : false);
    })
      .catch((err) => setError(err instanceof Error ? err.message : 'Search failed'))
      .finally(() => setLoading(false));
  }, [query]);

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    void api.getModels({ search: query, limit: PAGE_SIZE, offset, liveOnly: false })
      .then((data) => {
        setModels((current) => [...current, ...data.models]);
        setOffset((current) => current + data.models.length);
        setHasMore(Boolean(data.hasMore));
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Search failed'))
      .finally(() => setLoadingMore(false));
  };

  useInfiniteLoad({
    targetRef: sentinelRef,
    enabled: hasMore && !loading,
    loading: loadingMore,
    onLoadMore: loadMore
  });

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: t('common.home'), to: '/' }, { label: t('search.searchTitle') }]} />
      <h1 className="text-3xl font-bold text-white">{t('search.searchTitle')}</h1>
      <SearchBar initialValue={query} />
      <p className="text-sm text-zinc-400">{models.length} {t('common.modelsLoaded')} {t('search.resultsFor')} "{query || 'all'}"{hasMore ? ` ${t('common.moreAvailable')}` : ''}</p>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <ModelGrid models={models} loading={loading} listName={t('search.title')} />
      <UniversalAds containerClass="my-4" />
      {hasMore ? <div ref={sentinelRef} className="h-6" aria-hidden="true" /> : null}
      <InfiniteLoader loading={loadingMore} hasMore={hasMore} />
    </div>
  );
}
