import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { useI18n } from '../lib/i18n';
import { getModelByName, getModelLink } from '../lib/models';
import { useSEO } from '../lib/seo';

export default function ModelPage() {
  const params = useParams();
  const name = params.name || '';
  const decodedName = decodeURIComponent(name);
  const model = useMemo(() => getModelByName(decodedName), [decodedName]);
  const { t } = useI18n();

  useSEO(
    `${decodedName} Live Cam`,
    `Watch ${decodedName} live now with direct affiliate access.`,
    `/model/${encodeURIComponent(decodedName)}`
  );

  if (!model) {
    return <div className="rounded-xl border border-border bg-panel p-6">{t('modelNotFound')}</div>;
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: t('navHome'), to: '/' },
          { label: t('navLive'), to: '/live' },
          { label: model.name }
        ]}
      />

      <section className="card-glow grid gap-6 rounded-2xl border border-border bg-panel p-5 md:grid-cols-[340px_1fr]">
        <img
          src={model.thumbnail}
          alt={model.name}
          className="h-[420px] w-full rounded-xl object-cover"
          loading="lazy"
        />
        <div>
          <h1 className="text-3xl font-bold">{model.name}</h1>
          <p className="mt-2 text-zinc-300">{t('modelViewersNow', { viewers: model.viewers.toLocaleString() })}</p>
          <p className="mt-4 text-sm text-zinc-400">{t('categoryLabel')}: {model.category}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {model.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-200">#{tag}</span>
            ))}
          </div>
          <a
            href={getModelLink(model.name)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="mt-6 inline-block rounded-full bg-accent px-6 py-3 font-bold text-white shadow-[0_0_20px_rgba(255,45,117,.35)]"
          >
            {t('watchModel', { name: model.name })}
          </a>
        </div>
      </section>
    </div>
  );
}
