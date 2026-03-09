import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard';
import ModelGrid from '../components/ModelGrid';
import { api } from '../lib/api';
import { CATEGORIES, Model, categoryName } from '../lib/models';
import { useSEO } from '../lib/seo';

export default function Home() {
  const [models, setModels] = useState<Model[]>([]);
  const [categories, setCategories] = useState<{ slug: string; name: string; count: number }[]>([]);
  const [error, setError] = useState('');

  useSEO('Live Cam Directory', 'Live cam directory with trending models and categories.', '/');

  useEffect(() => {
    void api.getModels({ limit: 120, tag: 'girls,couples,trans,men' })
      .then((data) => {
        setModels(data.models.slice(0, 24));

        const computed = CATEGORIES.map((slug) => ({ slug, name: categoryName(slug), count: undefined as number | undefined }));
        setCategories(computed);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load models');
        setCategories(CATEGORIES.map((slug) => ({ slug, name: categoryName(slug), count: 0 })));
      });
  }, []);

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

      <section>
        <h2 className="mb-4 text-2xl font-bold text-white">Live Models</h2>
        {error ? <p className="mb-3 text-sm text-red-400">{error}</p> : null}
        <ModelGrid models={models} listName="Home Live Models" />
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
        <ModelGrid models={trending} listName="Trending Models" />
      </section>
    </div>
  );
}
