import { Link } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard';
import StripchatWidget from '../components/StripchatWidget';
import { CATEGORIES } from '../lib/constants';
import { useI18n } from '../lib/i18n';
import { useSEO } from '../lib/seo';

export default function HomePage() {
  const { t } = useI18n();
  useSEO(t('homePageTitle'), 'Discover trending live cams, categories and real-time streams.', '/');

  return (
    <div className="space-y-12">
      <section className="card-glow rounded-3xl border border-border glass p-8 sm:p-10">
        <p className="mb-3 inline-flex rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-accent">{t('heroBadge')}</p>
        <h1 className="max-w-3xl text-3xl font-extrabold leading-tight sm:text-5xl">{t('heroTitle')}</h1>
        <p className="mt-4 max-w-2xl text-zinc-300">{t('heroText')}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/live" className="rounded-full bg-accent px-6 py-3 font-semibold text-white shadow-[0_0_20px_rgba(255,45,117,.35)]">{t('heroExplore')}</Link>
          <Link to="/cam/milf" className="rounded-full border border-border bg-zinc-900/70 px-6 py-3 font-semibold text-zinc-200">{t('heroBrowse')}</Link>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">{t('liveFeed')}</h2>
        <div className="card-glow rounded-2xl border border-border bg-panel p-4">
          <StripchatWidget tag="girls" limit={24} />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">{t('categories')}</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category} name={category} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">{t('trendingLive')}</h2>
        <div className="card-glow rounded-2xl border border-border bg-panel p-4">
          <StripchatWidget tag="girls" limit={24} />
        </div>
      </section>
    </div>
  );
}
