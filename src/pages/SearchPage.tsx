import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import ModelGrid from '../components/ModelGrid';
import SearchBar from '../components/SearchBar';
import { searchModels } from '../lib/models';
import { useSEO } from '../lib/seo';

export default function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get('q') || '';
  const results = useMemo(() => searchModels(query), [query]);

  useSEO('Search Cams', 'Search live cam models by name, tag, or category.', '/search');

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Search' }]} />
      <h1 className="text-3xl font-bold">Search</h1>
      <SearchBar initialValue={query} />
      <p className="text-sm text-zinc-400">{results.length} results for "{query || 'all'}"</p>
      <ModelGrid models={results} />
    </div>
  );
}
