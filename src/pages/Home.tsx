import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard';
import ModelGrid from '../components/ModelGrid';
import { api } from '../lib/api';
import { Model } from '../lib/models';
import { categorizeModels, categories as categoryList } from '../lib/categories';
import { featuredTagGroups } from '../lib/tags';
import { generateDescription, generateTitle, useSEO } from '../lib/seo';

const HOME_LIVE_LIMIT = 300;
const CATEGORY_PREVIEW_LIMIT = 8;

export default function Home() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useSEO(generateTitle('home'), generateDescription('home'), '/');

  useEffect(() => {
    setLoading(true);
    void api.getModels({ limit: HOME_LIVE_LIMIT })
      .then((data) => setModels(data.models))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load models'))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const fromHomeFeed = categorizeModels(models);
    return categoryList.map((slug) => {
      const existing = fromHomeFeed.find((item) => item.slug === slug);
      const previewCount = models.filter((model) => model.category === slug).length;
      return {
        slug,
        name: existing?.name ?? slug.charAt(0).toUpperCase() + slug.slice(1),
        count: Math.max(existing?.count ?? 0, previewCount)
      };
    });
  }, [models]);
  const categoryModels = useMemo(
    () =>
      Object.fromEntries(
        categoryList.map((category) => [
          category,
          models.filter((model) => model.category === category).slice(0, CATEGORY_PREVIEW_LIMIT)
        ])
      ) as Record<string, Model[]>,
    [models]
  );
  const topCategories = useMemo(
    () => categories.filter((category) => (categoryModels[category.slug]?.length ?? 0) > 0),
    [categories, categoryModels]
  );
  const tagSections = useMemo(
    () =>
      Object.entries(featuredTagGroups)
        .map(([group, groupTags]) => ({
          group,
          items: groupTags
            .map((tag) => ({
              tag,
              models: models.filter((model) => model.tags.some((item) => item.includes(tag))).slice(0, CATEGORY_PREVIEW_LIMIT)
            }))
            .filter((entry) => entry.models.length > 0)
        }))
        .filter((section) => section.items.length > 0),
    [models]
  );

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-border bg-gradient-to-br from-purple-900/50 via-zinc-900 to-zinc-950 p-8 md:p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-32 h-32 bg-accent/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-500/30 rounded-full blur-3xl"></div>
        </div>
        <div className="relative">
          <p className="inline-flex rounded-full bg-accent/20 px-4 py-2 text-sm font-semibold text-accent">
            🔴 Live Now - {models.length} camere attive
          </p>
          <h1 className="mt-4 max-w-4xl text-3xl font-extrabold text-white sm:text-5xl leading-tight">
            Scopri le modelle più hot in tempo reale
          </h1>
          <p className="mt-4 max-w-3xl text-zinc-300 text-lg">
            Cam show gratuiti 24/7. Milfs, teen, trans, couples - tutte le categorie in un unico posto. 
            Sfoglia le dirette live e trova la tua modella preferita.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/live" className="rounded-full bg-accent hover:bg-accent/80 px-8 py-4 font-semibold text-white text-lg transition-all transform hover:scale-105">
              🎥 Guarda le Live
            </Link>
            <Link to="/cam/milf" className="rounded-full border border-border bg-zinc-900 hover:bg-zinc-800 px-8 py-4 font-semibold text-zinc-200 text-lg transition-all">
              📂 Categorie
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">📺 Tutte le Camere Live</h2>
          <Link to="/live" className="text-sm font-semibold text-accent hover:text-accent/80">Vedi tutte →</Link>
        </div>
        {error ? <p className="mb-3 text-sm text-red-400">{error}</p> : null}
        <ModelGrid models={models} loading={loading} listName="Home Live Models" />
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold text-white">📂 Categorie Popolari</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.slug} slug={category.slug} name={category.name} count={category.count} />
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">🌟 Categorie per Te</h2>
          <Link to="/live" className="text-sm font-semibold text-accent hover:text-accent/80">Tutte le categorie →</Link>
        </div>

        {topCategories.slice(0, 6).map((category) => (
          <section key={category.slug} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">{category.name} <span className="text-sm font-normal text-zinc-400">• {category.count} live</span></h3>
              </div>
              <Link to={`/cam/${category.slug}`} className="text-sm font-semibold text-accent hover:text-accent/80">Vedi tutte →</Link>
            </div>
            <ModelGrid
              models={categoryModels[category.slug] || []}
              loading={loading}
              listName={`${category.slug} home preview`}
            />
          </section>
        ))}
      </section>

      {/* Tag sections removed for cleaner homepage */}
      <section className="py-8 text-center text-zinc-400">
        <p>StripHubs - Il miglior sito di cam live gratuito</p>
      </section>
    </div>
  );
}
