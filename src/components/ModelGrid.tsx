import { useEffect } from 'react';
import ModelCard from './ModelCard';
import { Model, SITE_URL } from '../lib/models';
import { removeJsonLd, upsertJsonLd } from '../lib/seo';

export default function ModelGrid({ models, listName, loading = false }: { models: Model[]; listName: string; loading?: boolean }) {
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

  if (loading) {
    return (
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-96 animate-pulse rounded-2xl border border-border bg-panel" />
        ))}
      </section>
    );
  }

  if (!models.length) {
    return <div className="rounded-2xl border border-border bg-panel p-6 text-zinc-400">No live models found.</div>;
  }

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {models.map((model) => <ModelCard key={model.username} model={model} />)}
    </section>
  );
}
