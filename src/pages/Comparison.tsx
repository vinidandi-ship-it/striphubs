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

const TAG_MAP: Record<string, string> = {
  teen: 'teen',
  milf: 'milf',
  asian: 'asian',
  latina: 'latin',
  blonde: 'blondes',
  brunette: 'brunettes',
  ebony: 'ebony',
  bbw: 'bbw',
  mature: 'milf'
};

export default function Comparison() {
  const { comparison = 'milf-vs-teen' } = useParams<{ comparison: string }>();
  const { language, t } = useI18n();
  const [models1, setModels1] = useState<Model[]>([]);
  const [models2, setModels2] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [votes1, setVotes1] = useState(0);
  const [votes2, setVotes2] = useState(0);
  const [voted, setVoted] = useState<string | null>(null);

  const parts = comparison.split('-vs-');
  const cat1 = parts[0] || 'milf';
  const cat2 = parts[1] || 'teen';
  const tag1 = TAG_MAP[cat1] || cat1;
  const tag2 = TAG_MAP[cat2] || cat2;

  useSEO(
    `${cat1.charAt(0).toUpperCase() + cat1.slice(1)} vs ${cat2.charAt(0).toUpperCase() + cat2.slice(1)} - Confronto Cam`,
    `Confronto tra ${cat1} e ${cat2} cam live. Vota la tua preferita.`,
    `/vs/${comparison}`,
    language
  );

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getModels({ tag: tag1, limit: 8, offset: 0 }),
      api.getModels({ tag: tag2, limit: 8, offset: 0 })
    ])
      .then(([d1, d2]) => {
        setModels1(d1.models);
        setModels2(d2.models);
      })
      .finally(() => setLoading(false));

    const storedVotes = localStorage.getItem(`vs-${comparison}`);
    if (storedVotes) {
      const { v1, v2, voted: v } = JSON.parse(storedVotes);
      setVotes1(v1);
      setVotes2(v2);
      setVoted(v);
    }
  }, [comparison, tag1, tag2]);

  const handleVote = (side: 'left' | 'right') => {
    if (voted) return;
    
    const newVotes1 = side === 'left' ? votes1 + 1 : votes1;
    const newVotes2 = side === 'right' ? votes2 + 1 : votes2;
    
    setVotes1(newVotes1);
    setVotes2(newVotes2);
    setVoted(side);
    
    localStorage.setItem(`vs-${comparison}`, JSON.stringify({
      v1: newVotes1,
      v2: newVotes2,
      voted: side
    }));
  };

  const totalVotes = votes1 + votes2;
  const percent1 = totalVotes > 0 ? Math.round((votes1 / totalVotes) * 100) : 50;
  const percent2 = totalVotes > 0 ? 100 - percent1 : 50;

  const breadcrumbs = useMemo(() => [
    { label: t('common.home'), to: '/' },
    { label: 'Confronti', to: '/vs' },
    { label: `${cat1} vs ${cat2}` }
  ], [cat1, cat2, t]);

  return (
    <div className="space-y-8">
      <Breadcrumbs items={breadcrumbs} />
      
      <header className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          {cat1.charAt(0).toUpperCase() + cat1.slice(1)} vs {cat2.charAt(0).toUpperCase() + cat2.slice(1)}
        </h1>
        <p className="text-zinc-400">Vota la tua preferita e guarda chi vince!</p>
        
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-lg font-bold text-white">{percent1}%</span>
            <div className="flex-1 h-4 bg-zinc-800 rounded-full overflow-hidden flex">
              <div 
                className="h-full bg-gradient-to-r from-accent-primary to-pink-500 transition-all duration-500"
                style={{ width: `${percent1}%` }}
              />
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${percent2}%` }}
              />
            </div>
            <span className="text-lg font-bold text-white">{percent2}%</span>
          </div>
          <p className="text-sm text-zinc-500">{totalVotes} voti totali</p>
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">{cat1.toUpperCase()}</h2>
            <button
              onClick={() => handleVote('left')}
              disabled={!!voted}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                voted === 'left' 
                  ? 'bg-accent-primary text-white' 
                  : voted 
                    ? 'bg-zinc-700 text-zinc-500'
                    : 'bg-accent-primary/20 text-accent-primary hover:bg-accent-primary hover:text-white'
              }`}
            >
              {voted === 'left' ? '✓ Votato' : 'Vota'}
            </button>
          </div>
          <ModelGrid models={models1} loading={loading} listName={cat1} />
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">{cat2.toUpperCase()}</h2>
            <button
              onClick={() => handleVote('right')}
              disabled={!!voted}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                voted === 'right' 
                  ? 'bg-blue-500 text-white' 
                  : voted 
                    ? 'bg-zinc-700 text-zinc-500'
                    : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white'
              }`}
            >
              {voted === 'right' ? '✓ Votato' : 'Vota'}
            </button>
          </div>
          <ModelGrid models={models2} loading={loading} listName={cat2} />
        </section>
      </div>

      <div className="space-y-1 my-2">
        <div className="flex justify-center">
          <Banner728x90 className="hidden md:block" />
          <Banner300x250 className="md:hidden" />
        </div>
        <CrackRevenueBanner />
      </div>

      <div className="space-y-1 my-2">
        <div className="flex justify-center">
          <Banner728x90Second className="hidden md:block" />
          <Banner300x250 className="md:hidden" />
        </div>
        <CrackRevenueBanner />
      </div>
    </div>
  );
}
