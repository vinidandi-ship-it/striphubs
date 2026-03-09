import Breadcrumbs from '../components/Breadcrumbs';
import ModelGrid from '../components/ModelGrid';
import { allModels } from '../lib/models';
import { useSEO } from '../lib/seo';

export default function LivePage() {
  useSEO('All Live Cams', 'Browse all currently live cam models on StripHubs.', '/live');
  const models = allModels();

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Live' }]} />
      <h1 className="mb-4 text-3xl font-bold">All Live Cams</h1>
      <ModelGrid models={models} />
    </div>
  );
}
