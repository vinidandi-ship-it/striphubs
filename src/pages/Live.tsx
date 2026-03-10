import { useEffect, useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import ModelGrid from '../components/ModelGrid';
import Sidebar from '../components/Sidebar';
import { api } from '../lib/api';
import { countries } from '../lib/countries';
import { Model } from '../lib/models';
import { categoryName, categories as categoryList } from '../lib/categories';
import { generateDescription, generateTitle, useSEO } from '../lib/seo';

export default function Live() {
  const [models, setModels] = useState<Model[]>([]);
  const [categories, setCategories] = useState<{ slug: string; name: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useSEO(generateTitle('live'), generateDescription('live'), '/live');

  useEffect(() => {
    setLoading(true);
      void Promise.all([
      api.getModels({ limit: 300 }),
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
  const sidebarCountries = countries.map(country => {
    const count = models.filter((model) => model.country === country.code).length;
    return {
      slug: country.slug,
      name: country.name,
      count
    };
  });

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      {/* Sidebar */}
      <Sidebar categories={sidebarCategories} countries={sidebarCountries} />
      
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Live' }]} />
        <h1 className="text-2xl font-bold text-white sm:text-3xl">📺 Tutte le Camere Live</h1>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <ModelGrid models={models} loading={loading} listName="All Live Cams" />
      </div>
    </div>
  );
}
