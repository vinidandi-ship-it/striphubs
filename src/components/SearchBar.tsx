import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n';
import { buildLocalizedPath } from '../i18n/routing';
import Icon from './Icon';

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
          placeholder={t('common.searchPlaceholder')}
          className="h-11 w-full min-w-0 rounded-xl border border-border-color bg-[#0d0d12] px-4 pl-10 text-sm text-[#ffffff] outline-none focus:ring-2 focus:ring-accent-secondary placeholder:text-[#6b6b7b] color-scheme-dark"
          style={{ colorScheme: 'dark' }}
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
          <Icon name="search" size={18} />
        </span>
      </div>
      <button className="h-11 shrink-0 sh-btn sh-btn-primary px-3 sm:px-5 flex items-center gap-2" type="submit">
        <Icon name="search" size={16} />
        <span className="text-sm">{t('common.search')}</span>
      </button>
    </form>
  );
}
