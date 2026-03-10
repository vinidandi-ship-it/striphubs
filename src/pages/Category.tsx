import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import InfiniteLoader from '../components/InfiniteLoader';
import ModelGrid from '../components/ModelGrid';
import Sidebar from '../components/Sidebar';
import { api } from '../lib/api';
import { countries } from '../lib/countries';
import { categoryName, categories as categoryList } from '../lib/categories';
import { generateDescription, generateTitle, useSEO } from '../lib/seo';
import { seoTextForCategory } from '../lib/seoText';
import { useModels } from '../lib/useModels';
import { PAGE_SIZES } from '../lib/constants';

export default function Category() {
  const { category = 'milf' } = useParams();
  const [categories, setCategories] = useState<{ slug: string; name: string; count: number }[]>([]);

  const {
    models,
    loading,
    loadingMore,
    error,
    hasMore,
    includeOffline,
    toggleIncludeOffline,
    sentinelRef
  } = useModels({
    category,
    pageSize: PAGE_SIZES.CATEGORY,
    initialIncludeOffline: false
  });

  useSEO(
    generateTitle('category', { category }),
    generateDescription('category', { category }),
    `/cam/${category}`
  );

  useEffect(() => {
    api.getCategories().then((data) => setCategories(data.categories));
  }, []);

  const sidebarCategories = categoryList.map((slug) => {
    const catData = categories.find((c) => c.slug === slug);
    return {
      slug,
      name: categoryName(slug),
      count: catData?.count || 0
    };
  });

  const sidebarCountries = countries.map((country) => ({
    slug: country.slug,
    name: country.name,
    count: models.filter((model) => model.country === country.code).length
  }));

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      <Sidebar categories={sidebarCategories} countries={sidebarCountries} />

      <div className="flex-1 space-y-6">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Categorie', to: '/live' }, { label: categoryName(category) }]} />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">{categoryName(category)} Live Cams</h1>
            <p className="mt-1 text-sm text-zinc-400">{seoTextForCategory(category)}</p>
          </div>
          <button
            type="button"
            onClick={toggleIncludeOffline}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
              includeOffline ? 'border-accent bg-accent/10 text-accent' : 'border-border text-zinc-300 hover:border-accent hover:text-white'
            }`}
          >
            {includeOffline ? 'Mostra solo live' : 'Includi anche offline'}
          </button>
        </div>
        {!loading ? <p className="text-sm text-zinc-400">{models.length} modelle caricate{hasMore ? ' e altre disponibili' : ''}</p> : null}
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <ModelGrid models={models} loading={loading} listName={`${categoryName(category)} Models`} />
        {hasMore ? <div ref={sentinelRef} className="h-6" aria-hidden="true" /> : null}
        <InfiniteLoader loading={loadingMore} hasMore={hasMore} />
      </div>
    </div>
  );
}
