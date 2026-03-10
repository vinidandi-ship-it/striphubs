import { useEffect, useRef, useState } from 'react';
import ModelCard from './ModelCard';
import { Model, SITE_URL } from '../lib/models';
import { removeJsonLd, upsertJsonLd } from '../lib/seo';
import { useInfiniteLoad } from '../lib/useInfiniteLoad';

const INITIAL_RENDER_COUNT = 120;
const RENDER_BATCH_SIZE = 120;

export default function ModelGrid({ models, listName, loading = false }: { models: Model[]; listName: string; loading?: boolean }) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_RENDER_COUNT);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    upsertJsonLd('itemlist-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: listName,
      itemListElement: models.slice(0, 20).map((model, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}/model/${encodeURIComponent(model.username)}`,
        name: model.username
      }))
    });
    return () => removeJsonLd('itemlist-jsonld');
  }, [models, listName]);

  useEffect(() => {
    setVisibleCount((current) => {
      if (models.length <= INITIAL_RENDER_COUNT) return models.length;
      if (models.length < current) return models.length;
      return current;
    });
  }, [models.length]);

  const renderedModels = models.slice(0, visibleCount);
  const canRenderMore = visibleCount < models.length;

  useInfiniteLoad({
    targetRef: sentinelRef,
    enabled: canRenderMore && !loading,
    loading: false, // Questo parametro nell'hook è per il caricamento dati, non per il rendering locale
    onLoadMore: () => {
      setVisibleCount((current) => Math.min(current + RENDER_BATCH_SIZE, models.length));
    }
  });

  if (loading) {
    return (
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-72 animate-pulse rounded-2xl border border-border bg-panel sm:h-96" />
        ))}
      </section>
    );
  }

  if (!models.length) {
    return <div className="rounded-2xl border border-border bg-panel p-6 text-zinc-400">No live models found.</div>;
  }

  return (
    <div className="space-y-4">
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {renderedModels.map((model) => <ModelCard key={model.username} model={model} />)}
      </section>
      {canRenderMore ? (
        <div className="space-y-3">
          <div ref={sentinelRef} className="h-6" aria-hidden="true" />
          <p className="text-center text-xs text-zinc-500">
            Rendering {renderedModels.length} di {models.length} modelle caricate
          </p>
        </div>
      ) : null}
    </div>
  );
}
