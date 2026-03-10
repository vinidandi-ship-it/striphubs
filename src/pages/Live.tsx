import { useEffect, useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import ModelGrid from '../components/ModelGrid';
import Sidebar from '../components/Sidebar';
import { api } from '../lib/api';
import { Model } from '../lib/models';
import { categoryName, categories as categoryList } from '../lib/categories';
import { generateDescription, generateTitle, useSEO } from '../lib/seo';

// Paesi supportati (da mantenere sincronizzato con api/shared.ts)
const COUNTRIES = [
  { slug: 'italy', name: '🇮🇹 Italia' },
  { slug: 'germany', name: '🇩🇪 Germania' },
  { slug: 'france', name: '🇫🇷 Francia' },
  { slug: 'spain', name: '🇪🇸 Spagna' },
  { slug: 'uk', name: '🇬🇧 Regno Unito' },
  { slug: 'usa', name: '🇺🇸 USA' },
  { slug: 'canada', name: '🇨🇦 Canada' },
  { slug: 'australia', name: '🇦🇺 Australia' },
  { slug: 'russia', name: '🇷🇺 Russia' },
  { slug: 'poland', name: '🇵🇱 Polonia' },
  { slug: 'netherlands', name: '🇳🇱 Paesi Bassi' },
  { slug: 'sweden', name: '🇸🇪 Svezia' },
  { slug: 'norway', name: '🇳🇴 Norvegia' },
  { slug: 'denmark', name: '🇩🇰 Danimarca' },
  { slug: 'finland', name: '🇫🇮 Finlandia' },
  { slug: 'portugal', name: '🇵🇹 Portogallo' },
  { slug: 'greece', name: '🇬🇷 Grecia' },
  { slug: 'turkey', name: '🇹🇷 Turchia' },
  { slug: 'india', name: '🇮🇳 India' },
  { slug: 'china', name: '🇨🇳 Cina' },
  { slug: 'japan', name: '🇯🇵 Giappone' },
  { slug: 'korea', name: '🇰🇷 Corea' }
];

export default function Live() {
  const [models, setModels] = useState<Model[]>([]);
  const [categories, setCategories] = useState<{ slug: string; name: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useSEO(generateTitle('live'), generateDescription('live'), '/live');

  useEffect(() => {
    setLoading(true);
    void Promise.all([
      api.getModels({ limit: 96 }),
      api.getCategories()
    ]).then(([modelsData, categoriesData]) => {
      setModels(modelsData.models);
      setCategories(categoriesData.categories);
    }).catch((err) => setError(err instanceof Error ? err.message : 'Failed to load live models'))
    .finally(() => setLoading(false));
  }, []);

  // Prepara le categorie per la sidebar
  const sidebarCategories = categoryList.map(slug => {
    const catData = categories.find(c => c.slug === slug);
    return {
      slug,
      name: categoryName(slug),
      count: catData?.count || 0
    };
  });

  // Prepara i paesi per la sidebar
  const sidebarCountries = COUNTRIES.map(country => {
    const catData = categories.find(c => c.slug === country.slug);
    return {
      slug: country.slug,
      name: country.name,
      count: catData?.count || 0
    };
  });

  return (
    <div className="flex gap-8">
      {/* Sidebar */}
      <Sidebar categories={sidebarCategories} countries={sidebarCountries} />
      
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Live' }]} />
        <h1 className="text-3xl font-bold text-white">📺 Tutte le Camere Live</h1>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <ModelGrid models={models} loading={loading} listName="All Live Cams" />
      </div>
    </div>
  );
}
