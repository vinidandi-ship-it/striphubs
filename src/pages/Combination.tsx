import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import FAQSection from '../components/FAQSection';
import InfiniteLoader from '../components/InfiniteLoader';
import InternalLinks from '../components/InternalLinks';
import ModelGrid from '../components/ModelGrid';
import { api } from '../lib/api';
import { Model } from '../lib/models';
import { categoryName, CategorySlug } from '../lib/categories';
import { featuredCategoryTagCombos } from '../lib/programmaticSeo';
import { generateCombinationMeta } from '../lib/metaTags';
import { useSEO } from '../lib/seo';
import { seoTextForCombination } from '../lib/seoText';
import { useInfiniteLoad } from '../lib/useInfiniteLoad';

export default function CombinationPage() {
  const PAGE_SIZE = 96;
  const { category = 'milf', tag = 'tattoo' } = useParams();
  const { language, t } = useI18n();
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const relatedCombos = featuredCategoryTagCombos.filter(
    (entry) => entry.category === category || entry.tag === tag
  ).slice(0, 8);

  const meta = generateCombinationMeta(category as CategorySlug, tag, language, models.length || 50);
  useSEO(meta.title, meta.description, `/cam/${category}/${tag}`, language);

  useEffect(() => {
    setLoading(true);
    setOffset(0);
    setHasMore(false);
    void api.getModels({ category, tag, limit: PAGE_SIZE, offset: 0 })
      .then((data) => {
        setModels(data.models);
        setOffset(data.models.length);
        setHasMore(Boolean(data.hasMore));
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load combination'))
      .finally(() => setLoading(false));
  }, [category, tag]);

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    void api.getModels({ category, tag, limit: PAGE_SIZE, offset })
      .then((data) => {
        setModels((current) => [...current, ...data.models]);
        setOffset((current) => current + data.models.length);
        setHasMore(Boolean(data.hasMore));
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load more combination models'))
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
      <Breadcrumbs
        items={[
          { label: t('common.home'), to: '/' },
          { label: t('common.live'), to: '/live' },
          { label: categoryName(category), to: `/cam/${category}` },
          { label: tag, to: `/tag/${tag}` },
          { label: `${category} + ${tag}` }
        ]}
      />

      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-white">
          {categoryName(category)} + {tag} Live Cams
        </h1>
        <p className="text-sm text-zinc-400">{seoTextForCombination(category, tag)}</p>
      </header>

      {relatedCombos.length ? (
        <section className="rounded-2xl border border-border bg-panel p-4">
          <h2 className="text-lg font-semibold text-white">{t('combinationPage.altreLanding')}</h2>
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

      {!loading ? <p className="text-sm text-zinc-400">{models.length} {t('common.modelsLoaded')}{hasMore ? ` ${t('common.moreAvailable')}` : ''}</p> : null}
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <ModelGrid models={models} loading={loading} listName={`${categoryName(category)} ${tag} Models`} />
        {hasMore ? <div ref={sentinelRef} className="h-6" aria-hidden="true" /> : null}
      <InfiniteLoader loading={loadingMore} hasMore={hasMore} />
    </div>
  );
}
