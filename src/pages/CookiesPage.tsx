import Breadcrumbs from '../components/Breadcrumbs';
import { useI18n } from '../lib/i18n';
import { useSEO } from '../lib/seo';

export default function CookiesPage() {
  const { t } = useI18n();
  useSEO(t('cookiesTitle'), 'Read the StripHubs cookie policy.', '/cookies');

  return (
    <article className="prose prose-invert max-w-3xl">
      <Breadcrumbs items={[{ label: t('navHome'), to: '/' }, { label: t('footerCookies') }]} />
      <h1 className="text-3xl font-bold">{t('cookiesTitle')}</h1>
      <p>We use cookies for core functionality, analytics placeholders, and affiliate performance attribution.</p>
      <p>You can manage cookie preferences in your browser settings at any time.</p>
      <p>Continuing to use this site indicates consent to cookies as described in this policy.</p>
    </article>
  );
}
