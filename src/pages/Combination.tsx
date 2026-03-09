import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import ModelGrid from '../components/ModelGrid';
import { api } from '../lib/api';
import { Model } from '../lib/models';
import { categoryName } from '../lib/categories';
import { generateDescription, generateTitle, useSEO } from '../lib/seo';
import { seoTextForCombination } from '../lib/seoText';

export default function CombinationPage() {
  const { category = 'milf', tag = 'tattoo' } = useParams();
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useSEO(
    generateTitle('combination', { category, tag }),
    generateDescription('combination', { category, tag }),
    `/cam/${category}/${tag}`
  );

  useEffect(() => {
    setLoading(true);
    void api.getModels({ category, tag, limit: 96 })
      .then((data) => setModels(data.models))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load combination'))
      .finally(() => setLoading(false));
  }, [category, tag]);

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

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <ModelGrid models={models} loading={loading} listName={`${categoryName(category)} ${tag} Models`} />
    </div>
  );
}
