import { useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import StripchatWidget from '../components/StripchatWidget';
import { useI18n } from '../lib/i18n';
import { useSEO } from '../lib/seo';
import { normalizeWidgetTag } from '../lib/widgetTags';

export default function TagPage() {
  const params = useParams();
  const tag = params.tag || '';
  const widgetTag = normalizeWidgetTag(tag);
  const { t } = useI18n();

  useSEO(`${tag} Cams`, `Browse live cam models tagged with ${tag}.`, `/tag/${tag}`);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: t('navHome'), to: '/' }, { label: t('navTags'), to: '/live' }, { label: tag }]} />
      <h1 className="mb-1 text-3xl font-bold">#{tag}</h1>
      <p className="text-sm text-zinc-400">{t('tagRealtime')}</p>
      <div className="card-glow rounded-2xl border border-border bg-panel p-4">
        <StripchatWidget tag={widgetTag} limit={48} />
      </div>
    </div>
  );
}
