import Breadcrumbs from '../components/Breadcrumbs';
import { useSEO } from '../lib/seo';
import { useI18n } from '../i18n';
import { 
  Banner728x90, 
  Banner300x250, 
  Banner728x90Second
} from '../components/BannerAds';
import CrackRevenueBanner from '../components/CrackRevenueBanner';

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
      
      <div className="space-y-1 my-2">
        <div className="flex justify-center">
          <Banner728x90 className="hidden md:block" />
          <Banner300x250 className="md:hidden" />
        </div>
        <CrackRevenueBanner />
      </div>
      
      <h1>{t('legal.termsTitle')}</h1>
      <p>{t('legal.termsContent1')}</p>
      <p>{t('legal.termsContent2')}</p>
      <p>{t('legal.termsContent3')}</p>
      
      <div className="space-y-1 my-2">
        <div className="flex justify-center">
          <Banner728x90Second className="hidden md:block" />
          <Banner300x250 className="md:hidden" />
        </div>
        <CrackRevenueBanner />
      </div>
    </article>
  );
}
