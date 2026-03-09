import { Link } from 'react-router-dom';

export default function CategoryCard({ slug, name, count }: { slug: string; name: string; count?: number }) {
  return (
    <Link
      to={`/cam/${slug}`}
      className="rounded-2xl border border-border bg-panel p-5 transition hover:-translate-y-0.5 hover:border-accent"
    >
      <p className="text-lg font-semibold text-zinc-100">{name}</p>
      <p className="mt-2 text-sm text-zinc-400">Browse live {name.toLowerCase()} models</p>
      {typeof count === 'number' ? <p className="mt-2 text-xs text-zinc-500">{count} live now</p> : null}
    </Link>
  );
}
