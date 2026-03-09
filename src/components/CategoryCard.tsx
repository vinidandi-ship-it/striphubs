import { Link } from 'react-router-dom';
import { slugify } from '../lib/models';

type CategoryCardProps = {
  name: string;
};

export default function CategoryCard({ name }: CategoryCardProps) {
  return (
    <Link
      to={`/cam/${slugify(name)}`}
      className="group rounded-xl border border-border bg-panel p-5 transition hover:border-accent"
    >
      <p className="text-lg font-semibold text-zinc-100">{name}</p>
      <p className="mt-2 text-sm text-zinc-400 group-hover:text-zinc-300">Browse live {name} models</p>
    </Link>
  );
}
