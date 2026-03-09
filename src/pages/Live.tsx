import { useEffect, useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import ModelGrid from '../components/ModelGrid';
import { api } from '../lib/api';
import { Model } from '../lib/models';
import { useSEO } from '../lib/seo';

export default function Live() {
  const [models, setModels] = useState<Model[]>([]);
  const [error, setError] = useState('');

  useSEO('All Live Cams', 'Browse all live cam models currently online.', '/live');

  useEffect(() => {
    void api.getModels({ limit: 96 })
      .then((data) => setModels(data.models))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load live models'));
  }, []);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Live' }]} />
      <h1 className="text-3xl font-bold text-white">All Live Cams</h1>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <ModelGrid models={models} listName="All Live Cams" />
    </div>
  );
}
