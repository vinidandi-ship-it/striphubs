import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard';
import ModelGrid from '../components/ModelGrid';
import { api } from '../lib/api';
import { Model } from '../lib/models';
import { categorizeModels, categories as categoryList } from '../lib/categories';
import { generateDescription, generateTitle, useSEO } from '../lib/seo';

const HOME_LIVE_LIMIT = 96;
const CATEGORY_PREVIEW_LIMIT = 8;

export default function Home() {
  const [models, setModels] = useState<Model[]>([]);
  const [categoryModels, setCategoryModels] = useState<Record<string, Model[]>>({});
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [error, setError] = useState('');

  useSEO(generateTitle('home'), generateDescription('home'), '/');

  useEffect(() => {
    setLoading(true);
    void api.getModels({ limit: HOME_LIVE_LIMIT })
      .then((data) => setModels(data.models))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load models'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setCategoryLoading(true);
    void Promise.all(
      categoryList.map(async (category) => {
        const data = await api.getModels({ category, limit: CATEGORY_PREVIEW_LIMIT });
        return [category, data.models] as const;
      })
    )
      .then((entries) => setCategoryModels(Object.fromEntries(entries)))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load category previews'))
      .finally(() => setCategoryLoading(false));
  }, []);

  const categories = useMemo(() => {
    const fromHomeFeed = categorizeModels(models);
    return categoryList.map((slug) => {
      const existing = fromHomeFeed.find((item) => item.slug === slug);
      const previewCount = categoryModels[slug]?.length ?? 0;
      return {
        slug,
        name: existing?.name ?? slug.charAt(0).toUpperCase() + slug.slice(1),
        count: Math.max(existing?.count ?? 0, previewCount)
      };
    });
  }, [models, categoryModels]);
  const topCategories = useMemo(
    () => categories.filter((category) => (categoryModels[category.slug]?.length ?? 0) > 0),
    [categories, categoryModels]
  );

  return (
    <div className="space-y-12">
      <section className="rounded-3xl border border-border bg-gradient-to-br from-zinc-900 to-zinc-950 p-8">
        <p className="inline-flex rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-accent">Live now</p>
        <h1 className="mt-4 max-w-4xl text-3xl font-extrabold text-white sm:text-5xl">All live cams in home, come una vera directory.</h1>
        <p className="mt-4 max-w-3xl text-zinc-300">Prima vedi subito la griglia completa delle live, poi sotto trovi tutte le categorie con le rispettive anteprime reali gia filtrate.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/live" className="rounded-full bg-accent px-6 py-3 font-semibold text-white">Explore Live</Link>
          <Link to="/cam/milf" className="rounded-full border border-border bg-zinc-900 px-6 py-3 font-semibold text-zinc-200">Browse Categories</Link>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">All Live Cams</h2>
          <Link to="/live" className="text-sm font-semibold text-accent">Apri solo la directory live</Link>
        </div>
        {error ? <p className="mb-3 text-sm text-red-400">{error}</p> : null}
        <ModelGrid models={models} loading={loading} listName="Home Live Models" />
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold text-white">Tutte le categorie</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.slug} slug={category.slug} name={category.name} count={category.count} />
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">All live cams per categoria</h2>
          <Link to="/live" className="text-sm font-semibold text-accent">Apri directory completa</Link>
        </div>

        {topCategories.map((category) => (
          <section key={category.slug} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">{category.name}</h3>
                <p className="text-sm text-zinc-400">Preview reali della categoria {category.slug} direttamente dal feed live.</p>
              </div>
              <Link to={`/cam/${category.slug}`} className="text-sm font-semibold text-accent">Vedi tutte</Link>
            </div>
            <ModelGrid
              models={categoryModels[category.slug] || []}
              loading={categoryLoading}
              listName={`${category.slug} home preview`}
            />
          </section>
        ))}
      </section>
    </div>
  );
}
