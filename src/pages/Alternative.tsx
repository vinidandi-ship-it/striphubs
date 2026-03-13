import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import ModelGrid from '../components/ModelGrid';
import { api } from '../lib/api';
import { Model } from '../lib/models';
import { useSEO } from '../lib/seo';

const ALTERNATIVES: Record<string, { name: string; description: string; tag: string }> = {
  chaturbate: { 
    name: 'Chaturbate Alternative', 
    description: 'Le migliori alternative a Chaturbate. Guarda cam live gratis senza registrazione.',
    tag: 'girls,couples,trans,men'
  },
  stripchat: { 
    name: 'Stripchat Alternative', 
    description: 'Alternative a Stripchat con modelle live HD. Accesso diretto, gratis.',
    tag: 'girls,couples,trans,men'
  },
  xhamsterlive: { 
    name: 'xHamsterLive Alternative', 
    description: 'Simile a xHamsterLive ma meglio. Cam gratis in alta qualità.',
    tag: 'girls,couples'
  },
  livejasmin: { 
    name: 'LiveJasmin Alternative', 
    description: 'Alternative premium a LiveJasmin. Modelle eleganti e professioniste.',
    tag: 'girls'
  },
  bongacams: { 
    name: 'BongaCams Alternative', 
    description: 'Alternative a BongaCams con più modelle italiane.',
    tag: 'girls,couples'
  },
  cam4: { 
    name: 'Cam4 Alternative', 
    description: 'Migliore di Cam4. Cam amatoriali dal vivo.',
    tag: 'girls,couples,men'
  },
  jerkmate: { 
    name: 'Jerkmate Alternative', 
    description: 'Alternative a Jerkmate. Trova la modella perfetta per te.',
    tag: 'girls'
  },
  camsoda: { 
    name: 'CamSoda Alternative', 
    description: 'Più di CamSoda. Cam interattive con toys.',
    tag: 'girls,couples'
  },
  myfreecams: { 
    name: 'MyFreeCams Alternative', 
    description: 'Alternative moderna a MyFreeCams. Community attiva.',
    tag: 'girls'
  },
  onlyfans: { 
    name: 'OnlyFans Live Alternative', 
    description: 'Meglio di OnlyFans: cam live gratis invece di contenuti a pagamento.',
    tag: 'girls,couples'
  }
};

export default function Alternative() {
  const { name = '' } = useParams<{ name: string }>();
  const { language, t } = useI18n();
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  const alt = ALTERNATIVES[name.toLowerCase()] || ALTERNATIVES.chaturbate;

  useSEO(
    `${alt.name} - StripHubs | Cam Live Gratis`,
    alt.description,
    `/alternative/${name}`,
    language
  );

  useEffect(() => {
    setLoading(true);
    api.getModels({ tag: alt.tag, limit: 48, offset: 0 })
      .then(data => setModels(data.models))
      .finally(() => setLoading(false));
  }, [alt.tag]);

  const breadcrumbs = useMemo(() => [
    { label: t('common.home'), to: '/' },
    { label: 'Alternative', to: '/alternative' },
    { label: alt.name }
  ], [alt.name, t]);

  return (
    <div className="space-y-8">
      <Breadcrumbs items={breadcrumbs} />
      
      <header className="space-y-4">
        <h1 className="text-3xl font-bold text-white">{alt.name}</h1>
        <p className="text-zinc-400 max-w-2xl">{alt.description}</p>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
            ✓ Gratis per sempre
          </span>
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
            ✓ Nessuna registrazione
          </span>
          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
            ✓ HD Quality
          </span>
        </div>
      </header>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-white">
          {models.length} Modelle Live Ora
        </h2>
        <ModelGrid models={models} loading={loading} listName={alt.name} />
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(ALTERNATIVES)
          .filter(([key]) => key !== name.toLowerCase())
          .slice(0, 6)
          .map(([key, value]) => (
            <Link
              key={key}
              to={`/alternative/${key}`}
              className="p-4 rounded-xl border border-border bg-panel hover:border-accent transition-colors"
            >
              <h3 className="font-semibold text-white">{value.name}</h3>
              <p className="text-sm text-zinc-500 mt-1 line-clamp-2">{value.description}</p>
            </Link>
          ))}
      </section>
    </div>
  );
}
