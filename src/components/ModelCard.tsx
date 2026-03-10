import { Link } from 'react-router-dom';
import { Model, watchLiveUrl } from '../lib/models';
import Icon from './Icon';

export default function ModelCard({ model }: { model: Model }) {
  return (
    <article className="content-visibility-card group relative overflow-hidden sh-card transition-all hover:-translate-y-1">
      <Link to={`/model/${encodeURIComponent(model.username)}`} className="block focus:outline-none focus:ring-2 focus:ring-accent-primary" aria-label={`Open ${model.username} profile`}>
        <div className="relative">
          <div className="aspect-[3/4] w-full overflow-hidden rounded-t-2xl">
            <img
              src={model.thumbnail}
              alt={`${model.username} live preview`}
              loading="lazy"
              decoding="async"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span
            className={`absolute left-2 top-2 flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold sm:left-3 sm:top-3 sm:text-[11px] sh-badge ${
              model.isLive ? 'sh-badge-live' : 'bg-bg-tertiary text-text-secondary'
            }`}
          >
            {model.isLive ? <Icon name="live" size={10} /> : null}
            {model.isLive ? 'LIVE' : 'OFFLINE'}
          </span>
          <div className="absolute bottom-2 left-2 right-2 transition-opacity group-hover:opacity-100 sm:bottom-3 sm:left-3 sm:right-3 sm:opacity-0">
            <span className="rounded-full bg-black/50 px-2 py-1 text-[10px] text-white sm:text-xs">
              {model.viewers.toLocaleString()} spettatori
            </span>
          </div>
        </div>
      </Link>
      <div className="space-y-2 p-3 sm:space-y-3 sm:p-4">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <h3 className="truncate text-sm font-semibold text-white transition-colors group-hover:text-accent-primary sm:text-base">{model.username}</h3>
          <span className="flex shrink-0 items-center gap-1 text-[11px] text-text-secondary sm:text-xs">
            <Icon name="eye" size={12} />
            {model.viewers.toLocaleString()}
          </span>
        </div>
        {model.country && model.country !== 'N/A' && (
          <p className="flex items-center gap-1 text-[11px] text-text-muted sm:text-xs">
            <Icon name="search" size={12} /> {model.country}
          </p>
        )}
        <div className="flex flex-wrap gap-1">
          {model.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="sh-badge sh-badge-category">
              #{tag.replace('girls/', '').replace('couples/', '')}
            </span>
          ))}
        </div>
        <a
          href={model.clickUrl || watchLiveUrl(model.username)}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="block w-full sh-btn sh-btn-primary text-center text-xs sm:text-sm"
          aria-label={`Guarda ${model.username} live`}
        >
          <Icon name="play" size={14} />
          Guarda Live
        </a>
      </div>
    </article>
  );
}
