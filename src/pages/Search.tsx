import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import ModelGrid from '../components/ModelGrid';
import SearchBar from '../components/SearchBar';
import { api } from '../lib/api';
import { Model } from '../lib/models';
import { generateDescription, generateTitle, useSEO } from '../lib/seo';

export default function Search() {
  const [params] = useSearchParams();
  const query = params.get('q') || '';

  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useSEO(generateTitle('search'), generateDescription('search'), '/search');

  useEffect(() => {
    setLoading(true);
    void api.getModels({ search: query, limit: query ? 1000 : 96 })
      .then((data) => setModels(data.models))
      .catch((err) => setError(err instanceof Error ? err.message : 'Search failed'))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Search' }]} />
      <h1 className="text-3xl font-bold text-white">Search</h1>
      <SearchBar initialValue={query} />
      <p className="text-sm text-zinc-400">{models.length} results for "{query || 'all'}"</p>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <ModelGrid models={models} loading={loading} listName="Search Results" />
    </div>
  );
}
