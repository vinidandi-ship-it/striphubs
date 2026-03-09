import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../lib/i18n';

type SearchBarProps = {
  compact?: boolean;
  initialValue?: string;
};

export default function SearchBar({ compact = false, initialValue = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const navigate = useNavigate();
  const { t } = useI18n();

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form onSubmit={onSubmit} className={`flex items-center gap-2 ${compact ? 'w-full md:w-80' : 'w-full'}`}>
      <input
        className="h-11 w-full rounded-full border border-border bg-zinc-900/80 px-4 text-sm text-white outline-none ring-accent focus:ring"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t('searchPlaceholder')}
        aria-label={t('searchButton')}
      />
      <button
        type="submit"
        className="h-11 rounded-full bg-accent px-5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(255,45,117,.35)]"
      >
        {t('searchButton')}
      </button>
    </form>
  );
}
