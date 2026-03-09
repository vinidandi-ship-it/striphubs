import Breadcrumbs from '../components/Breadcrumbs';
import { useI18n } from '../lib/i18n';
import { useSEO } from '../lib/seo';

export default function PrivacyPage() {
  const { t } = useI18n();
  useSEO(t('privacyTitle'), 'Read the StripHubs privacy policy.', '/privacy');

  return (
    <article className="prose prose-invert max-w-3xl">
      <Breadcrumbs items={[{ label: t('navHome'), to: '/' }, { label: t('footerPrivacy') }]} />
      <h1 className="text-3xl font-bold">{t('privacyTitle')}</h1>
      <p>StripHubs collects limited technical data such as browser information and anonymous usage metrics.</p>
      <p>Third-party affiliate providers may set their own cookies and tracking technologies when you click outbound links.</p>
      <p>By using this site, you agree to this policy and applicable legal requirements in your jurisdiction.</p>
    </article>
  );
}
