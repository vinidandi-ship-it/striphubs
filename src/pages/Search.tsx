import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import LoadMoreButton from '../components/LoadMoreButton';
import ModelGrid from '../components/ModelGrid';
import SearchBar from '../components/SearchBar';
import { api } from '../lib/api';
import { Model } from '../lib/models';
import { generateDescription, generateTitle, useSEO } from '../lib/seo';

export default function Search() {
  const PAGE_SIZE = 300;
  const [params] = useSearchParams();
  const query = params.get('q') || '';

  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  useSEO(generateTitle('search'), generateDescription('search'), '/search');

  useEffect(() => {
    setLoading(true);
    setOffset(0);
    setHasMore(false);
    void api.getModels({ search: query, limit: PAGE_SIZE, offset: 0 })
      .then((data) => {
        setModels(data.models);
        setOffset(data.models.length);
        setHasMore(Boolean(data.hasMore));
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Search failed'))
      .finally(() => setLoading(false));
  }, [query]);

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    void api.getModels({ search: query, limit: PAGE_SIZE, offset })
      .then((data) => {
        setModels((current) => [...current, ...data.models]);
        setOffset((current) => current + data.models.length);
        setHasMore(Boolean(data.hasMore));
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Search failed'))
      .finally(() => setLoadingMore(false));
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Search' }]} />
      <h1 className="text-3xl font-bold text-white">Search</h1>
      <SearchBar initialValue={query} />
      <p className="text-sm text-zinc-400">{models.length} risultati caricati per "{query || 'all'}"{hasMore ? ' con altri disponibili' : ''}</p>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <ModelGrid models={models} loading={loading} listName="Search Results" />
      {hasMore ? <LoadMoreButton onClick={loadMore} loading={loadingMore} /> : null}
    </div>
  );
}
