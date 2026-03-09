import { Link } from 'react-router-dom';
import { Model, getModelLink } from '../lib/models';
import { useI18n } from '../lib/i18n';

type ModelCardProps = {
  model: Model;
};

export default function ModelCard({ model }: ModelCardProps) {
  const { t } = useI18n();

  return (
    <article className="card-glow fade-in overflow-hidden rounded-2xl border border-border bg-panel/90">
      <Link to={`/model/${encodeURIComponent(model.name)}`} className="block">
        <div className="relative">
          <img
            src={model.thumbnail}
            alt={model.name}
            className="h-64 w-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <span className="absolute left-3 top-3 rounded-full bg-accent px-2 py-1 text-xs font-bold text-white">{t('modelLive')}</span>
        </div>
      </Link>
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="truncate text-base font-semibold">{model.name}</h3>
          <span className="text-xs text-zinc-400">{model.viewers.toLocaleString()} {t('modelWatching')}</span>
        </div>
        <a
          href={getModelLink(model.name)}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="block rounded-full bg-accent px-3 py-2 text-center text-sm font-bold text-white transition hover:brightness-110"
        >
          {t('modelWatch')}
        </a>
      </div>
    </article>
  );
}
