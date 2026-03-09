import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import ModelGrid from '../components/ModelGrid';
import { getByTag } from '../lib/models';
import { useSEO } from '../lib/seo';

export default function TagPage() {
  const params = useParams();
  const tag = params.tag || '';

  useSEO(`${tag} Cams`, `Browse live cam models tagged with ${tag}.`, `/tag/${tag}`);
  const models = useMemo(() => getByTag(tag), [tag]);

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Tag', to: '/live' }, { label: tag }]} />
      <h1 className="mb-4 text-3xl font-bold">#{tag}</h1>
      <ModelGrid models={models} />
    </div>
  );
}
