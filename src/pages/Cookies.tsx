import Breadcrumbs from '../components/Breadcrumbs';
import { useSEO } from '../lib/seo';
import { useI18n } from '../i18n';
import { 
  Banner728x90, 
  Banner300x250, 
  Banner728x90Second
} from '../components/BannerAds';
import CrackRevenueBanner from '../components/CrackRevenueBanner';

export default function Cookies() {
  const { t, language } = useI18n();
  
  useSEO(
    t('legal.cookiesTitle') || 'Cookie Policy', 
    t('legal.cookiesDesc') || 'Read the StripHubs cookie policy.', 
    '/cookies',
    language
  );

  return (
    <article className="prose prose-invert max-w-3xl">
      <Breadcrumbs items={[{ label: t('common.home'), to: '/' }, { label: t('footer.cookies') }]} />
      
      <div className="space-y-2 my-4">
        <div className="flex justify-center">
          <Banner728x90 className="hidden md:block" />
          <Banner300x250 className="md:hidden" />
        </div>
        <CrackRevenueBanner />
      </div>
      
      <h1>{t('legal.cookiesTitle')}</h1>
      <p>{t('legal.cookiesContent1')}</p>
      <p>{t('legal.cookiesContent2')}</p>
      <p>{t('legal.cookiesContent3')}</p>
      
      <div className="space-y-2 my-4">
        <div className="flex justify-center">
          <Banner728x90Second className="hidden md:block" />
          <Banner300x250 className="md:hidden" />
        </div>
        <CrackRevenueBanner />
      </div>
    </article>
  );
}
