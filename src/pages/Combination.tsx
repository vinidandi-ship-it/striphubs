import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import LoadMoreButton from '../components/LoadMoreButton';
import ModelGrid from '../components/ModelGrid';
import { api } from '../lib/api';
import { Model } from '../lib/models';
import { categoryName } from '../lib/categories';
import { generateDescription, generateTitle, useSEO } from '../lib/seo';
import { seoTextForCombination } from '../lib/seoText';

export default function CombinationPage() {
  const PAGE_SIZE = 180;
  const { category = 'milf', tag = 'tattoo' } = useParams();
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  useSEO(
    generateTitle('combination', { category, tag }),
    generateDescription('combination', { category, tag }),
    `/cam/${category}/${tag}`
  );

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

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Live', to: '/live' },
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

      {!loading ? <p className="text-sm text-zinc-400">{models.length} modelle caricate{hasMore ? ' e altre disponibili' : ''}</p> : null}
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <ModelGrid models={models} loading={loading} listName={`${categoryName(category)} ${tag} Models`} />
      {hasMore ? <LoadMoreButton onClick={loadMore} loading={loadingMore} /> : null}
    </div>
  );
}
