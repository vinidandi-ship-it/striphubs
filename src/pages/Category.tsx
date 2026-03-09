import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import ModelGrid from '../components/ModelGrid';
import { api } from '../lib/api';
import { Model } from '../lib/models';
import { categoryName } from '../lib/categories';
import { generateDescription, generateTitle, useSEO } from '../lib/seo';
import { seoTextForCategory } from '../lib/seoText';

export default function Category() {
  const { category = 'milf' } = useParams();
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useSEO(
    generateTitle('category', { category }),
    generateDescription('category', { category }),
    `/cam/${category}`
  );

  useEffect(() => {
    setLoading(true);
    void api.getModels({ category, limit: 96 })
      .then((data) => setModels(data.models))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load category'))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Category', to: '/live' }, { label: categoryName(category) }]} />
      <h1 className="text-3xl font-bold text-white">{categoryName(category)} Live Cams</h1>
      <p className="text-sm text-zinc-400">{seoTextForCategory(category)}</p>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <ModelGrid models={models} loading={loading} listName={`${categoryName(category)} Models`} />
    </div>
  );
}
