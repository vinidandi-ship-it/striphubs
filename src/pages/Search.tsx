import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import ModelGrid from '../components/ModelGrid';
import SearchBar from '../components/SearchBar';
import { api } from '../lib/api';
import { Model } from '../lib/models';
import { useSEO } from '../lib/seo';

export default function Search() {
  const [params] = useSearchParams();
  const query = params.get('q') || '';

  const [models, setModels] = useState<Model[]>([]);
  const [error, setError] = useState('');

  useSEO('Search Models', 'Search live cam models by username, tags, or country.', '/search');

  useEffect(() => {
    void api.getModels({ search: query, limit: 96 })
      .then((data) => setModels(data.models))
      .catch((err) => setError(err instanceof Error ? err.message : 'Search failed'));
  }, [query]);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Search' }]} />
      <h1 className="text-3xl font-bold text-white">Search</h1>
      <SearchBar initialValue={query} />
      <p className="text-sm text-zinc-400">{models.length} results for "{query || 'all'}"</p>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <ModelGrid models={models} listName="Search Results" />
    </div>
  );
}
