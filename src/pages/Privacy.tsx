import Breadcrumbs from '../components/Breadcrumbs';
import { useSEO } from '../lib/seo';
import { useI18n } from '../i18n';

export default function Privacy() {
  const { t, language } = useI18n();
  
  useSEO(
    t('legal.privacyTitle') || 'Privacy Policy', 
    t('legal.privacyDesc') || 'Read the StripHubs privacy policy.', 
    '/privacy',
    language
  );

  return (
    <article className="prose prose-invert max-w-3xl">
      <Breadcrumbs items={[{ label: t('common.home'), to: '/' }, { label: t('footer.privacy') }]} />
      <h1>{t('legal.privacyTitle')}</h1>
      <p>{t('legal.privacyContent1')}</p>
      <p>{t('legal.privacyContent2')}</p>
      <p>{t('legal.privacyContent3')}</p>
    </article>
  );
}
