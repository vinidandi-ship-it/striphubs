import { 
  Banner728x90, 
  Banner300x250, 
  Banner728x90Second,
  RecommendationWidget,
  NativeAd,
  MultiformatAd,
  MultiformatV2,
  InstantMessage
} from '../components/BannerAds';
import CrackRevenueBanner from '../components/CrackRevenueBanner';
import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import ModelGrid from '../components/ModelGrid';
import { useI18n } from '../i18n';
import { api } from '../lib/api';
import { Model } from '../lib/models';
import { useSEO } from '../lib/seo';

const TIMEFRAMES: Record<string, { label: string; description: string }> = {
  today: { label: 'Oggi', description: 'Le più viste nelle ultime 24 ore' },
  week: { label: 'Questa Settimana', description: 'Top della settimana' },
  month: { label: 'Questo Mese', description: 'Le migliori del mese' },
  year: { label: 'Quest\'Anno', description: 'Le regine dell\'anno' }
};

const CATEGORIES: Record<string, string> = {
  teen: 'teen',
  milf: 'milf',
  asian: 'asian',
  latina: 'latin',
  blonde: 'blondes',
  brunette: 'brunettes',
  ebony: 'ebony',
  couple: 'couples',
  trans: 'trans',
  gay: 'gay',
  bbw: 'bbw',
  mature: 'milf'
};

export default function BestOf() {
  const { timeframe = 'today', category = 'teen' } = useParams<{ timeframe: string; category: string }>();
  const { language, t } = useI18n();
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  const tf = TIMEFRAMES[timeframe] || TIMEFRAMES.today;
  const cat = CATEGORIES[category] || 'teen';

  useSEO(
    `Migliori ${category} ${tf.label} - StripHubs`,
    `Top ${category} cam ${tf.label.toLowerCase()}. Classifica aggiornata delle modelle più viste.`,
    `/best/${timeframe}/${category}`,
    language
  );

  useEffect(() => {
    setLoading(true);
    api.getModels({ tag: cat, limit: 48, offset: 0 })
      .then(data => setModels(data.models))
      .finally(() => setLoading(false));
  }, [cat]);

  const breadcrumbs = useMemo(() => [
    { label: t('common.home'), to: '/' },
    { label: 'Best Of', to: '/best/today/teen' },
    { label: `${tf.label} - ${category}` }
  ], [tf.label, category, t]);

  return (
    <div className="space-y-8">
      <Breadcrumbs items={breadcrumbs} />
      
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🏆</span>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Top {category.charAt(0).toUpperCase() + category.slice(1)} {tf.label}
            </h1>
            <p className="text-zinc-400">{tf.description}</p>
          </div>
        </div>
      </header>

      <nav className="flex flex-wrap gap-2">
        {Object.entries(TIMEFRAMES).map(([key, value]) => (
          <Link
            key={key}
            to={`/best/${key}/${category}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              key === timeframe 
                ? 'bg-accent text-white' 
                : 'bg-panel text-zinc-400 hover:text-white'
            }`}
          >
            {value.label}
          </Link>
        ))}
      </nav>

      <nav className="flex flex-wrap gap-2">
        {Object.keys(CATEGORIES).slice(0, 8).map(cat => (
          <Link
            key={cat}
            to={`/best/${timeframe}/${cat}`}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              cat === category 
                ? 'bg-accent-primary text-white' 
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </Link>
        ))}
      </nav>

      <section>
        <ModelGrid models={models} loading={loading} listName={`Best ${category} ${tf.label}`} />
      </section>

      <div className="space-y-2 my-4">
        <div className="flex justify-center">
          <Banner728x90 className="hidden md:block" />
          <Banner300x250 className="md:hidden" />
        </div>
        <CrackRevenueBanner />
      </div>
    </div>
  );
}
