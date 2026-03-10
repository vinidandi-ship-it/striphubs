import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import LoadMoreButton from '../components/LoadMoreButton';
import ModelGrid from '../components/ModelGrid';
import { api } from '../lib/api';
import { findCountryBySlug } from '../lib/countries';
import { featuredCategoryTagCombos, priorityTagSlugs } from '../lib/programmaticSeo';
import type { Model } from '../lib/models';
import { generateDescription, generateTitle, useSEO } from '../lib/seo';
import { seoTextForCountry } from '../lib/seoText';
import { useInfiniteLoad } from '../lib/useInfiniteLoad';

export default function Country() {
  const PAGE_SIZE = 180;
  const { countrySlug = 'italian' } = useParams();
  const country = findCountryBySlug(countrySlug);
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useSEO(
    generateTitle('country', { country: country?.name || countrySlug }),
    generateDescription('country', { country: country?.name || countrySlug }),
    `/country/${countrySlug}`
  );

  useEffect(() => {
    if (!country) return;

    setLoading(true);
    setOffset(0);
    setHasMore(false);
    void api.getModels({ country: country.code, limit: PAGE_SIZE, offset: 0 })
      .then((data) => {
        setModels(data.models);
        setOffset(data.models.length);
        setHasMore(Boolean(data.hasMore));
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load country'))
      .finally(() => setLoading(false));
  }, [country]);

  const loadMore = () => {
    if (!country || loadingMore || !hasMore) return;
    setLoadingMore(true);
    void api.getModels({ country: country.code, limit: PAGE_SIZE, offset })
      .then((data) => {
        setModels((current) => [...current, ...data.models]);
        setOffset((current) => current + data.models.length);
        setHasMore(Boolean(data.hasMore));
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load more country models'))
      .finally(() => setLoadingMore(false));
  };

  useInfiniteLoad({
    targetRef: sentinelRef,
    enabled: hasMore && !loading,
    loading: loadingMore,
    onLoadMore: loadMore
  });

  const relatedCombos = useMemo(
    () => featuredCategoryTagCombos.filter((entry) => models.some((model) => model.category === entry.category)).slice(0, 6),
    [models]
  );

  if (!country) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Paesi', to: '/live' }, { label: countrySlug }]} />
        <div className="rounded-2xl border border-border bg-panel p-6 text-zinc-300">Paese non disponibile.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Paesi', to: '/live' }, { label: country.name }]} />

      <header className="space-y-3">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">{country.name} Cam Live</h1>
        <p className="max-w-3xl text-sm text-zinc-400">{seoTextForCountry(country.name)}</p>
      </header>

      <section className="rounded-2xl border border-border bg-panel p-4 sm:p-5">
        <h2 className="text-lg font-semibold text-white">Tag popolari per {country.name.toLowerCase()}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {priorityTagSlugs.slice(0, 10).map((tag) => (
            <Link
              key={tag}
              to={`/tag/${tag}`}
              className="rounded-full border border-border bg-zinc-900 px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-accent hover:text-white"
            >
              {tag}
            </Link>
          ))}
        </div>
      </section>

      {relatedCombos.length ? (
        <section className="rounded-2xl border border-border bg-panel p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-white">Combinazioni da spingere</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {relatedCombos.map((entry) => (
              <Link
                key={`${entry.category}-${entry.tag}`}
                to={`/cam/${entry.category}/${entry.tag}`}
                className="rounded-full border border-border bg-zinc-900 px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-accent hover:text-white"
              >
                {entry.category} + {entry.tag}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {!loading ? <p className="text-sm text-zinc-400">{models.length} modelle caricate{hasMore ? ' e altre disponibili' : ''}</p> : null}
      <ModelGrid models={models} loading={loading} listName={`${country.name} Live Models`} />
      {hasMore ? <div ref={sentinelRef} className="h-6" aria-hidden="true" /> : null}
      {hasMore ? <LoadMoreButton onClick={loadMore} loading={loadingMore} /> : null}
    </div>
  );
}
