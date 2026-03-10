import { useEffect, useRef, useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import LoadMoreButton from '../components/LoadMoreButton';
import ModelGrid from '../components/ModelGrid';
import Sidebar from '../components/Sidebar';
import { api } from '../lib/api';
import { countries } from '../lib/countries';
import { Model } from '../lib/models';
import { categoryName, categories as categoryList } from '../lib/categories';
import { generateDescription, generateTitle, useSEO } from '../lib/seo';
import { useInfiniteLoad } from '../lib/useInfiniteLoad';

export default function Live() {
  const PAGE_SIZE = 300;
  const [models, setModels] = useState<Model[]>([]);
  const [categories, setCategories] = useState<{ slug: string; name: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useSEO(generateTitle('live'), generateDescription('live'), '/live');

  useEffect(() => {
    setLoading(true);
    setOffset(0);
    setHasMore(false);
    void Promise.all([
      api.getModels({ limit: PAGE_SIZE, offset: 0 }),
      api.getCategories()
    ]).then(([modelsData, categoriesData]) => {
      setModels(modelsData.models);
      setOffset(modelsData.models.length);
      setHasMore(Boolean(modelsData.hasMore));
      setCategories(categoriesData.categories);
    }).catch((err) => setError(err instanceof Error ? err.message : 'Failed to load live models'))
    .finally(() => setLoading(false));
  }, []);

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    void api.getModels({ limit: PAGE_SIZE, offset })
      .then((data) => {
        setModels((current) => {
          const seen = new Set(current.map((item) => item.username.toLowerCase()));
          const merged = [...current];
          data.models.forEach((item) => {
            if (!seen.has(item.username.toLowerCase())) {
              seen.add(item.username.toLowerCase());
              merged.push(item);
            }
          });
          return merged;
        });
        setOffset((current) => current + data.models.length);
        setHasMore(Boolean(data.hasMore));
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load more models'))
      .finally(() => setLoadingMore(false));
  };

  useInfiniteLoad({
    targetRef: sentinelRef,
    enabled: hasMore && !loading,
    loading: loadingMore,
    onLoadMore: loadMore
  });

  // Prepara le categorie per la sidebar
  const sidebarCategories = categoryList.map(slug => {
    const catData = categories.find(c => c.slug === slug);
    return {
      slug,
      name: categoryName(slug),
      count: catData?.count || 0
    };
  });

  // Prepara i paesi per la sidebar
  const sidebarCountries = countries.map(country => {
    const count = models.filter((model) => model.country === country.code).length;
    return {
      slug: country.slug,
      name: country.name,
      count
    };
  });

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      {/* Sidebar */}
      <Sidebar categories={sidebarCategories} countries={sidebarCountries} />
      
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Live' }]} />
        <h1 className="text-2xl font-bold text-white sm:text-3xl">📺 Tutte le Camere Live</h1>
        {!loading ? <p className="text-sm text-zinc-400">{models.length} modelle caricate{hasMore ? ' e altre disponibili' : ''}</p> : null}
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <ModelGrid models={models} loading={loading} listName="All Live Cams" />
        {hasMore ? <div ref={sentinelRef} className="h-6" aria-hidden="true" /> : null}
        {hasMore ? <LoadMoreButton onClick={loadMore} loading={loadingMore} /> : null}
      </div>
    </div>
  );
}
