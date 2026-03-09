import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import ModelGrid from '../components/ModelGrid';
import { api } from '../lib/api';
import { Model } from '../lib/models';
import { generateDescription, generateTitle, useSEO } from '../lib/seo';
import { seoTextForTag } from '../lib/seoText';

export default function Tag() {
  const { tag = 'girls' } = useParams();
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useSEO(generateTitle('tag', { tag }), generateDescription('tag', { tag }), `/tag/${tag}`);

  useEffect(() => {
    setLoading(true);
    void api.getModels({ tag, limit: 96 })
      .then((data) => setModels(data.models))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load tag'))
      .finally(() => setLoading(false));
  }, [tag]);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Tag', to: '/live' }, { label: tag }]} />
      <h1 className="text-3xl font-bold text-white">#{tag}</h1>
      <p className="text-sm text-zinc-400">{seoTextForTag(tag)}</p>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <ModelGrid models={models} loading={loading} listName={`Tag ${tag} Models`} />
    </div>
  );
}
