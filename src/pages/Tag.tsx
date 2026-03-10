import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import LoadMoreButton from '../components/LoadMoreButton';
import ModelGrid from '../components/ModelGrid';
import { api } from '../lib/api';
import { categories as categoryList, categoryName } from '../lib/categories';
import { Model } from '../lib/models';
import { featuredCategoryTagCombos } from '../lib/programmaticSeo';
import { generateDescription, generateTitle, useFaqJsonLd, useSEO } from '../lib/seo';
import { seoFaqForTag, seoTextForTag } from '../lib/seoText';
import { useInfiniteLoad } from '../lib/useInfiniteLoad';

export default function Tag() {
  const PAGE_SIZE = 180;
  const { tag = 'girls' } = useParams();
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const relatedCategories = categoryList.filter((category) =>
    featuredCategoryTagCombos.some((entry) => entry.category === category && entry.tag === tag)
  );
  const faq = seoFaqForTag(tag);

  useSEO(generateTitle('tag', { tag }), generateDescription('tag', { tag }), `/tag/${tag}`);
  useFaqJsonLd('faq-tag-jsonld', faq);

  useEffect(() => {
    setLoading(true);
    setOffset(0);
    setHasMore(false);
    void api.getModels({ tag, limit: PAGE_SIZE, offset: 0 })
      .then((data) => {
        setModels(data.models);
        setOffset(data.models.length);
        setHasMore(Boolean(data.hasMore));
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load tag'))
      .finally(() => setLoading(false));
  }, [tag]);

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    void api.getModels({ tag, limit: PAGE_SIZE, offset })
      .then((data) => {
        setModels((current) => [...current, ...data.models]);
        setOffset((current) => current + data.models.length);
        setHasMore(Boolean(data.hasMore));
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load more tag models'))
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
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Tag', to: '/live' }, { label: tag }]} />
      <h1 className="text-3xl font-bold text-white">#{tag}</h1>
      <p className="text-sm text-zinc-400">{seoTextForTag(tag)}</p>
      {relatedCategories.length ? (
        <section className="rounded-2xl border border-border bg-panel p-4">
          <h2 className="text-lg font-semibold text-white">Landing correlate per {tag}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {relatedCategories.map((category) => (
              <Link
                key={category}
                to={`/cam/${category}/${tag}`}
                className="rounded-full border border-border bg-zinc-900 px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-accent hover:text-white"
              >
                {categoryName(category)} + {tag}
              </Link>
            ))}
          </div>
        </section>
      ) : null}
      {!loading ? <p className="text-sm text-zinc-400">{models.length} modelle caricate{hasMore ? ' e altre disponibili' : ''}</p> : null}
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <ModelGrid models={models} loading={loading} listName={`Tag ${tag} Models`} />
      <section className="rounded-2xl border border-border bg-panel p-4 sm:p-5">
        <h2 className="text-lg font-semibold text-white">FAQ #{tag}</h2>
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
  );
}
