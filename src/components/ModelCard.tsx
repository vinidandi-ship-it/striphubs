import { Link } from 'react-router-dom';
import { Model, watchLiveUrl } from '../lib/models';

export default function ModelCard({ model }: { model: Model }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-panel shadow-lg">
      <Link to={`/model/${encodeURIComponent(model.username)}`} className="block focus:outline-none focus:ring-2 focus:ring-accent" aria-label={`Open ${model.username} profile`}>
        <div className="relative">
          <img
            src={model.thumbnail}
            alt={`${model.username} live preview`}
            loading="lazy"
            decoding="async"
            className="h-64 w-full object-cover"
          />
          <span className="absolute left-3 top-3 rounded-full bg-accent px-2 py-1 text-[11px] font-bold text-white">LIVE</span>
        </div>
      </Link>
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="truncate text-base font-semibold text-white">{model.username}</h3>
          <span className="text-xs text-zinc-400">{model.viewers.toLocaleString()} viewers</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {model.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-zinc-800 px-2 py-1 text-[11px] text-zinc-300">#{tag}</span>
          ))}
        </div>
        <a
          href={model.clickUrl || watchLiveUrl(model.username)}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="block rounded-full bg-accent px-3 py-2 text-center text-sm font-bold text-white"
          aria-label={`Watch ${model.username} live`}
        >
          Watch Live
        </a>
      </div>
    </article>
  );
}
