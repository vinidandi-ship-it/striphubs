import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import ModelGrid from '../components/ModelGrid';
import { api } from '../lib/api';
import { Model as LiveModel } from '../lib/models';
import { generateDescription, generateTitle, useSEO } from '../lib/seo';

export default function ModelPage() {
  const { username = '' } = useParams();
  const decodedName = decodeURIComponent(username);

  const [model, setModel] = useState<LiveModel | null>(null);
  const [related, setRelated] = useState<LiveModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useSEO(
    generateTitle('model', { username: decodedName }),
    generateDescription('model', { username: decodedName }),
    `/model/${encodeURIComponent(decodedName)}`
  );

  useEffect(() => {
    setLoading(true);
    void api.getModels({ modelsList: decodedName, strict: 1, limit: 120, tag: 'girls,couples,trans,men' })
      .then((data) => {
        const selected = data.models.find((item) => item.username.toLowerCase() === decodedName.toLowerCase()) || null;
        if (!selected) throw new Error('Model not found in current live feed');
        setModel(selected);
        setRelated(data.models.filter((item) => item.username.toLowerCase() !== decodedName.toLowerCase()).slice(0, 8));
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load model profile'))
      .finally(() => setLoading(false));
  }, [decodedName]);

  const breadcrumbs = useMemo(() => [
    { label: 'Home', to: '/' },
    { label: 'Live', to: '/live' },
    { label: decodedName }
  ], [decodedName]);

  if (error) return <div className="rounded-2xl border border-border bg-panel p-6 text-red-400">{error}</div>;
  if (!model) return <ModelGrid models={[]} loading={loading} listName="Model Loading" />;

  return (
    <div className="space-y-8">
      <Breadcrumbs items={breadcrumbs} />

      <section className="grid gap-6 rounded-2xl border border-border bg-panel p-5 md:grid-cols-[360px_1fr]">
        <img src={model.thumbnail} alt={`${model.username} profile`} className="h-[440px] w-full rounded-xl object-cover" loading="lazy" />
        <div>
          <h1 className="text-3xl font-bold text-white">{model.username}</h1>
          <p className="mt-2 text-zinc-300">{model.viewers.toLocaleString()} viewers watching now</p>
          <p className="mt-2 text-sm text-zinc-400">Country: {model.country}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {model.tags.map((tag) => <span key={tag} className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-200">#{tag}</span>)}
          </div>
          <a
            href={model.clickUrl || `https://stripchat.com/${encodeURIComponent(model.username)}?userId=d28a8a923e19b6fd3ed0c160238cdfed71b13f759191c9457b28797b81780881`}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="mt-6 inline-block rounded-full bg-accent px-6 py-3 font-semibold text-white"
          >
            Watch Live
          </a>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold text-white">Related Models</h2>
        <ModelGrid models={related} loading={loading} listName="Related Models" />
      </section>
    </div>
  );
}
