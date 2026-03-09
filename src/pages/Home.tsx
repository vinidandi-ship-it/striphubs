import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard';
import ModelGrid from '../components/ModelGrid';
import { api } from '../lib/api';
import { Model } from '../lib/models';
import { categorizeModels, categories as categoryList } from '../lib/categories';
import { tags } from '../lib/tags';
import { generateCombinationRoutes } from '../lib/combinations';
import { generateDescription, generateTitle, useSEO } from '../lib/seo';

export default function Home() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useSEO(generateTitle('home'), generateDescription('home'), '/');

  useEffect(() => {
    setLoading(true);
    void api.getModels({ limit: 120, tag: 'girls,couples,trans,men' })
      .then((data) => setModels(data.models.slice(0, 24)))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load models'))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => categorizeModels(models).slice(0, 6), [models]);
  const trending = useMemo(() => [...models].sort((a, b) => b.viewers - a.viewers).slice(0, 8), [models]);
  const combos = useMemo(
    () => generateCombinationRoutes().filter((item) => item.category && item.tag).slice(0, 8),
    []
  );

  return (
    <div className="space-y-12">
      <section className="rounded-3xl border border-border bg-gradient-to-br from-zinc-900 to-zinc-950 p-8">
        <p className="inline-flex rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-accent">Live now</p>
        <h1 className="mt-4 max-w-3xl text-3xl font-extrabold text-white sm:text-5xl">Find live cam models instantly with a custom high-speed directory.</h1>
        <p className="mt-4 max-w-2xl text-zinc-300">Explore top categories, trending performers, and live viewer activity from one responsive platform.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/live" className="rounded-full bg-accent px-6 py-3 font-semibold text-white">Explore Live</Link>
          <Link to="/cam/milf" className="rounded-full border border-border bg-zinc-900 px-6 py-3 font-semibold text-zinc-200">Browse Categories</Link>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold text-white">Live Models</h2>
        {error ? <p className="mb-3 text-sm text-red-400">{error}</p> : null}
        <ModelGrid models={models} loading={loading} listName="Home Live Models" />
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold text-white">Popular Categories</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.slug} slug={category.slug} name={category.name} count={category.count} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold text-white">Trending Models</h2>
        <ModelGrid models={trending} loading={loading} listName="Trending Models" />
      </section>

      <section className="space-y-6">
        <header className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Explore More</h2>
          <Link to="/live" className="text-sm font-semibold text-accent">Browse all live cams</Link>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-panel p-4">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-pink-400">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categoryList.map((category) => (
                <Link
                  key={category}
                  to={`/cam/${category}`}
                  className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-200 hover:border-pink-400 hover:text-pink-300"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-panel p-4">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-pink-400">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/tag/${tag}`}
                  className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-200 hover:border-pink-400 hover:text-pink-300"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-panel p-4">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-pink-400">Combo Picks</h3>
            <div className="flex flex-wrap gap-2">
              {combos.map((combo) => (
                <Link
                  key={combo.path}
                  to={combo.path}
                  className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-200 hover:border-pink-400 hover:text-pink-300"
                >
                  {combo.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
