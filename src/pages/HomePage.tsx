import { Link } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard';
import ModelGrid from '../components/ModelGrid';
import StripchatWidget from '../components/StripchatWidget';
import { CATEGORIES } from '../lib/constants';
import { getTrendingModels } from '../lib/models';
import { useSEO } from '../lib/seo';

export default function HomePage() {
  useSEO('Live Cam Directory', 'Discover trending live cams, categories and real-time streams.', '/');
  const trending = getTrendingModels(8);

  return (
    <div className="space-y-12">
      <section className="rounded-2xl border border-border bg-gradient-to-br from-zinc-900 to-zinc-950 p-8">
        <p className="mb-3 inline-flex rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-accent">Live now</p>
        <h1 className="max-w-2xl text-3xl font-extrabold leading-tight sm:text-5xl">
          Discover top live cam models and start watching instantly.
        </h1>
        <p className="mt-4 max-w-xl text-zinc-300">
          StripHubs helps you find live models by category and tag with direct one-click access.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/live" className="rounded-lg bg-accent px-5 py-3 font-semibold text-white">Explore Live Cams</Link>
          <Link to="/cam/milf" className="rounded-lg border border-border px-5 py-3 font-semibold text-zinc-200">Browse Categories</Link>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Live Cam Widget</h2>
        <div className="rounded-2xl border border-border bg-panel p-4">
          <StripchatWidget tag="girls" limit={24} />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Categories</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category} name={category} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Trending Models</h2>
        <ModelGrid models={trending} />
      </section>
    </div>
  );
}
