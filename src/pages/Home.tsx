import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import BannerAd from '../components/BannerAd';
import CategoryCard from '../components/CategoryCard';
import ModelGrid from '../components/ModelGrid';
import { api } from '../lib/api';
import { Model } from '../lib/models';
import { deriveCategories } from '../lib/categories';
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

  const categories = useMemo(() => deriveCategories(models).slice(0, 6), [models]);
  const trending = useMemo(() => [...models].sort((a, b) => b.viewers - a.viewers).slice(0, 8), [models]);

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

      <BannerAd />

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
    </div>
  );
}
