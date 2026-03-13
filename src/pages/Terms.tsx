import Breadcrumbs from '../components/Breadcrumbs';
import { useSEO } from '../lib/seo';
import { useI18n } from '../i18n';

export default function Terms() {
  const { t, language } = useI18n();
  
  useSEO(
    t('legal.termsTitle') || 'Terms of Service', 
    t('legal.termsDesc') || 'Read the StripHubs terms of service.', 
    '/terms',
    language
  );

  return (
    <article className="prose prose-invert max-w-3xl">
      <Breadcrumbs items={[{ label: t('common.home'), to: '/' }, { label: t('footer.terms') }]} />
      <h1>{t('legal.termsTitle')}</h1>
      <p>{t('legal.termsContent1')}</p>
      <p>{t('legal.termsContent2')}</p>
      <p>{t('legal.termsContent3')}</p>
    </article>
  );
}
