import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import ModelGrid from '../components/ModelGrid';
import SearchBar from '../components/SearchBar';
import StripchatWidget from '../components/StripchatWidget';
import { useI18n } from '../lib/i18n';
import { searchModels } from '../lib/models';
import { useSEO } from '../lib/seo';
import { isWidgetTagQuery, normalizeWidgetTag } from '../lib/widgetTags';

export default function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get('q') || '';
  const widgetTag = normalizeWidgetTag(query);
  const isDirectWidgetSearch = isWidgetTagQuery(query);
  const results = useMemo(() => searchModels(query), [query]);
  const { t } = useI18n();

  useSEO(t('searchPageTitle'), 'Search live cam models by name, tag, or category.', '/search');

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: t('navHome'), to: '/' }, { label: t('searchTitle') }]} />
      <h1 className="text-3xl font-bold">{t('searchTitle')}</h1>
      <SearchBar initialValue={query} />
      {isDirectWidgetSearch ? (
        <div className="space-y-2">
          <p className="text-sm text-zinc-400">{t('searchRealtime', { query })}</p>
          <div className="card-glow rounded-2xl border border-border bg-panel p-4">
            <StripchatWidget tag={widgetTag} limit={48} />
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-zinc-400">
            {t('searchFallback', { count: results.length, query: query || 'all' })}
          </p>
          <ModelGrid models={results} />
        </div>
      )}
    </div>
  );
}
