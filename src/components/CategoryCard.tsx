import { Link } from 'react-router-dom';

export default function CategoryCard({ slug, name, count }: { slug: string; name: string; count?: number }) {
  return (
    <Link
      to={`/cam/${slug}`}
      className="rounded-2xl border border-border bg-panel p-5 transition-all hover:-translate-y-1 hover:border-accent hover:shadow-lg hover:shadow-accent/20 group"
    >
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold text-zinc-100 group-hover:text-accent transition-colors">{name}</p>
        {typeof count === 'number' ? (
          <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded-full">{count}</span>
        ) : null}
      </div>
      <p className="mt-2 text-sm text-zinc-500 group-hover:text-zinc-400">Live {name.toLowerCase()} cam</p>
    </Link>
  );
}
