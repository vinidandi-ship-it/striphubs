import Breadcrumbs from '../components/Breadcrumbs';
import { useSEO } from '../lib/seo';
import { useI18n } from '../i18n';
import { 
  Banner728x90, 
  Banner300x250, 
  Banner728x90Second
} from '../components/BannerAds';
import CrackRevenueBanner from '../components/CrackRevenueBanner';

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
      
      <div className="space-y-1 my-2">
        <div className="flex justify-center">
          <Banner728x90 className="hidden md:block" />
          <Banner300x250 className="md:hidden" />
        </div>
        <CrackRevenueBanner />
      </div>
      
      <h1>{t('legal.privacyTitle')}</h1>
      <p>{t('legal.privacyContent1')}</p>
      <p>{t('legal.privacyContent2')}</p>
      <p>{t('legal.privacyContent3')}</p>
      
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
