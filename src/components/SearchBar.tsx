import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n';
import { buildLocalizedPath } from '../i18n/routing';

export default function SearchBar({ initialValue = '', compact = false }: { initialValue?: string; compact?: boolean }) {
  const [query, setQuery] = useState(initialValue);
  const navigate = useNavigate();
  const { t, locale } = useI18n();

  useEffect(() => setQuery(initialValue), [initialValue]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(`${buildLocalizedPath('/search', locale)}?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form onSubmit={submit} className={`flex w-full items-center gap-2 ${compact ? '' : ''}`}>
      <div className="relative flex-1">
        <input
          aria-label="Search models"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`🔍 ${t('common.searchPlaceholder')}`}
          className="h-11 w-full min-w-0 rounded-xl border border-border bg-zinc-900/80 px-4 pl-10 text-sm text-white outline-none focus:ring-2 focus:ring-accent placeholder:text-zinc-500"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">🔍</span>
      </div>
      <button className="h-11 shrink-0 rounded-xl bg-gradient-to-r from-accent to-pink-500 px-4 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-accent/30 sm:px-5" type="submit">
        {t('common.search')}
      </button>
    </form>
  );
}
