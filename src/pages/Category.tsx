import { Link, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import LoadMoreButton from '../components/LoadMoreButton';
import ModelGrid from '../components/ModelGrid';
import Sidebar from '../components/Sidebar';
import { api } from '../lib/api';
import { countries } from '../lib/countries';
import { Model } from '../lib/models';
import { categoryName, categories as categoryList } from '../lib/categories';
import { featuredCategoryTagCombos } from '../lib/programmaticSeo';
import { generateDescription, generateTitle, useFaqJsonLd, useSEO } from '../lib/seo';
import { seoFaqForCategory, seoTextForCategory } from '../lib/seoText';
import { useInfiniteLoad } from '../lib/useInfiniteLoad';

export default function Category() {
  const PAGE_SIZE = 240;
  const { category = 'milf' } = useParams();
  const [models, setModels] = useState<Model[]>([]);
  const [categories, setCategories] = useState<{ slug: string; name: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const faq = seoFaqForCategory(categoryName(category));
  const relatedCombos = featuredCategoryTagCombos.filter((entry) => entry.category === category).slice(0, 8);

  useSEO(
    generateTitle('category', { category }),
    generateDescription('category', { category }),
    `/cam/${category}`
  );
  useFaqJsonLd('faq-category-jsonld', faq);

  useEffect(() => {
    setLoading(true);
    setOffset(0);
    setHasMore(false);
    void Promise.all([
      api.getModels({ category, limit: PAGE_SIZE, offset: 0 }),
      api.getCategories()
    ]).then(([modelsData, categoriesData]) => {
      setModels(modelsData.models);
      setOffset(modelsData.models.length);
      setHasMore(Boolean(modelsData.hasMore));
      setCategories(categoriesData.categories);
    }).catch((err) => setError(err instanceof Error ? err.message : 'Failed to load data'))
    .finally(() => setLoading(false));
  }, [category]);

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    void api.getModels({ category, limit: PAGE_SIZE, offset })
      .then((data) => {
        setModels((current) => [...current, ...data.models]);
        setOffset((current) => current + data.models.length);
        setHasMore(Boolean(data.hasMore));
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load more data'))
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
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Categorie', to: '/live' }, { label: categoryName(category) }]} />
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">{categoryName(category)} Live Cams</h1>
          <p className="mt-1 text-sm text-zinc-400">{seoTextForCategory(category)}</p>
        </div>
        {relatedCombos.length ? (
          <section className="rounded-2xl border border-border bg-panel p-4">
            <h2 className="text-lg font-semibold text-white">Landing correlate da {categoryName(category)}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {relatedCombos.map((entry) => (
                <Link
                  key={`${entry.category}-${entry.tag}`}
                  to={`/cam/${entry.category}/${entry.tag}`}
                  className="rounded-full border border-border bg-zinc-900 px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-accent hover:text-white"
                >
                  {categoryName(entry.category)} + {entry.tag}
                </Link>
              ))}
            </div>
          </section>
        ) : null}
        {!loading ? <p className="text-sm text-zinc-400">{models.length} modelle caricate{hasMore ? ' e altre disponibili' : ''}</p> : null}
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <ModelGrid models={models} loading={loading} listName={`${categoryName(category)} Models`} />
        <section className="rounded-2xl border border-border bg-panel p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-white">FAQ {categoryName(category)}</h2>
          <div className="mt-3 space-y-3 text-sm text-zinc-300">
            {faq.map((item) => (
              <div key={item.question}>
                <p className="font-semibold text-white">{item.question}</p>
                <p className="mt-1 text-zinc-400">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
        {hasMore ? <div ref={sentinelRef} className="h-6" aria-hidden="true" /> : null}
        {hasMore ? <LoadMoreButton onClick={loadMore} loading={loadingMore} /> : null}
      </div>
    </div>
  );
}
