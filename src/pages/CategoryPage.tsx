import { useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import StripchatWidget from '../components/StripchatWidget';
import { useI18n } from '../lib/i18n';
import { useSEO } from '../lib/seo';
import { normalizeWidgetTag } from '../lib/widgetTags';

export default function CategoryPage() {
  const params = useParams();
  const category = params.category || '';
  const titleCase = category.charAt(0).toUpperCase() + category.slice(1);
  const widgetTag = normalizeWidgetTag(category);
  const { t } = useI18n();

  useSEO(t('categoryLive', { category: titleCase }), `Watch live ${titleCase} cam models now.`, `/cam/${category}`);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: t('navHome'), to: '/' }, { label: t('navCategories'), to: '/live' }, { label: titleCase }]} />
      <h1 className="mb-1 text-3xl font-bold">{t('categoryLive', { category: titleCase })}</h1>
      <p className="text-sm text-zinc-400">{t('categoryRealtime')}</p>
      <div className="card-glow rounded-2xl border border-border bg-panel p-4">
        <StripchatWidget tag={widgetTag} limit={48} />
      </div>
    </div>
  );
}
