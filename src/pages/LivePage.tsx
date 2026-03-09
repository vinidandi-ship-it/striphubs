import Breadcrumbs from '../components/Breadcrumbs';
import StripchatWidget from '../components/StripchatWidget';
import { useI18n } from '../lib/i18n';
import { useSEO } from '../lib/seo';

export default function LivePage() {
  const { t } = useI18n();
  useSEO(t('livePageTitle'), 'Browse all currently live cam models on StripHubs.', '/live');

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: t('navHome'), to: '/' }, { label: t('navLive') }]} />
      <h1 className="mb-1 text-3xl font-bold">{t('allLive')}</h1>
      <p className="text-sm text-zinc-400">{t('realtimeFeed')}</p>
      <div className="card-glow rounded-2xl border border-border bg-panel p-4">
        <StripchatWidget tag="girls" limit={60} />
      </div>
    </div>
  );
}
