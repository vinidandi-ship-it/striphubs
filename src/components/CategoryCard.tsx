import { Link } from 'react-router-dom';
import { slugify } from '../lib/models';
import { useI18n } from '../lib/i18n';

type CategoryCardProps = {
  name: string;
};

export default function CategoryCard({ name }: CategoryCardProps) {
  const { t } = useI18n();

  return (
    <Link
      to={`/cam/${slugify(name)}`}
      className="group card-glow rounded-2xl border border-border bg-panel/90 p-5 transition hover:-translate-y-1 hover:border-accent"
    >
      <p className="text-lg font-semibold text-zinc-100">{name}</p>
      <p className="mt-2 text-sm text-zinc-400 group-hover:text-zinc-300">
        {t('categoryBrowse', { category: name })}
      </p>
    </Link>
  );
}
