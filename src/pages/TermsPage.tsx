import Breadcrumbs from '../components/Breadcrumbs';
import { useI18n } from '../lib/i18n';
import { useSEO } from '../lib/seo';

export default function TermsPage() {
  const { t } = useI18n();
  useSEO(t('termsTitle'), 'Read the StripHubs terms of service.', '/terms');

  return (
    <article className="prose prose-invert max-w-3xl">
      <Breadcrumbs items={[{ label: t('navHome'), to: '/' }, { label: t('footerTerms') }]} />
      <h1 className="text-3xl font-bold">{t('termsTitle')}</h1>
      <p>This site is for adults 18+ only. Do not use this service if prohibited by local law.</p>
      <p>StripHubs is an affiliate directory and does not host live streams directly.</p>
      <p>All third-party content belongs to its respective owners and platforms.</p>
    </article>
  );
}
