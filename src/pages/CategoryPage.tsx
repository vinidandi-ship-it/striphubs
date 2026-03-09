import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import ModelGrid from '../components/ModelGrid';
import { getByCategory } from '../lib/models';
import { useSEO } from '../lib/seo';

export default function CategoryPage() {
  const params = useParams();
  const category = params.category || '';
  const titleCase = category.charAt(0).toUpperCase() + category.slice(1);

  useSEO(`${titleCase} Cams`, `Watch live ${titleCase} cam models now.`, `/cam/${category}`);

  const models = useMemo(() => getByCategory(category), [category]);

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Category', to: '/live' }, { label: titleCase }]} />
      <h1 className="mb-4 text-3xl font-bold">{titleCase} Live Cams</h1>
      <ModelGrid models={models} />
    </div>
  );
}
