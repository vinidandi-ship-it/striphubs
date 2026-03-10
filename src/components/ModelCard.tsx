import { Link } from 'react-router-dom';
import { Model, watchLiveUrl } from '../lib/models';

export default function ModelCard({ model }: { model: Model }) {
  return (
    <article className="content-visibility-card group relative overflow-hidden rounded-2xl border border-border bg-panel shadow-lg transition-all hover:shadow-2xl hover:shadow-accent/10 hover:-translate-y-1">
      <Link to={`/model/${encodeURIComponent(model.username)}`} className="block focus:outline-none focus:ring-2 focus:ring-accent" aria-label={`Open ${model.username} profile`}>
        <div className="relative">
          <div className="aspect-[3/4] w-full overflow-hidden rounded-t-2xl">
            <img
              src={model.thumbnail}
              alt={`${model.username} live preview`}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-red-500 px-2 py-1 text-[10px] font-bold text-white sm:left-3 sm:top-3 sm:text-[11px]">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            LIVE
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
          <h3 className="truncate text-sm font-semibold text-white transition-colors group-hover:text-accent sm:text-base">{model.username}</h3>
          <span className="flex shrink-0 items-center gap-1 text-[11px] text-zinc-400 sm:text-xs">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/></svg>
            {model.viewers.toLocaleString()}
          </span>
        </div>
        {model.country && model.country !== 'N/A' && (
          <p className="flex items-center gap-1 text-[11px] text-zinc-500 sm:text-xs">
            <span>📍</span> {model.country}
          </p>
        )}
        <div className="flex flex-wrap gap-1">
          {model.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="rounded-full bg-zinc-800/50 px-2 py-1 text-[10px] text-zinc-400">
              #{tag.replace('girls/', '').replace('couples/', '')}
            </span>
          ))}
        </div>
        <a
          href={model.clickUrl || watchLiveUrl(model.username)}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="block w-full rounded-full bg-gradient-to-r from-accent to-pink-500 px-3 py-2 text-center text-xs font-bold text-white transition-all hover:shadow-lg hover:shadow-accent/30 sm:px-4 sm:py-2.5 sm:text-sm"
          aria-label={`Guarda ${model.username} live`}
        >
          Guarda Live
        </a>
      </div>
    </article>
  );
}
