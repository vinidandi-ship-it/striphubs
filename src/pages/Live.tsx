import Breadcrumbs from '../components/Breadcrumbs';
import FAQSection from '../components/FAQSection';
import InfiniteLoader from '../components/InfiniteLoader';
import InternalLinks from '../components/InternalLinks';
import ModelGrid from '../components/ModelGrid';
import Sidebar from '../components/Sidebar';
import Icon from '../components/Icon';
import { AllCrackRevenueBanners, Banner728x90, Banner300x250, Banner728x90Second, NativeAd, MultiformatAd, MultiformatV2, InstantMessage, RecommendationWidget } from '../components/BannerAds';
import { useEffect } from 'react';
import { useI18n } from '../i18n';
import { countries } from '../lib/countries';
import { categoryName, categories as categoryList } from '../lib/categories';
import { generateDescription, generateTitle, useSEO, upsertJsonLd, removeJsonLd } from '../lib/seo';
import { useModelsByProvider } from '../lib/useModelsByProvider';
import { PAGE_SIZES } from '../lib/constants';

export default function Live() {
  const { language, t } = useI18n();
  const providerData = useModelsByProvider({
    pageSize: PAGE_SIZES.LIVE,
    initialIncludeOffline: false
  });

  const { models, total, loading, loadingMore, error, hasMore, includeOffline, toggleIncludeOffline, sentinelRef } = providerData;
  
  const allModels = [...models.stripchat, ...models.chaturbate];

  useSEO(
    generateTitle('live'),
    generateDescription('live'),
    '/live',
    language,
    {
      keywords: ['cam live', 'tutte le cam', 'modelle online', 'streaming live', 'cam gratis', 'directory cam']
    }
  );

  // Add structured data for live page
  useEffect(() => {
    if (!allModels.length) return;

    const itemListElement = allModels.slice(0, 20).map((model, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `/model/${model.provider || 'stripchat'}/${encodeURIComponent(model.username)}`
    }));
    
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Live Cam Models',
      description: 'All live cam models online 24/7',
      itemListElement
    };
    
    upsertJsonLd('live-schema', structuredData);
    
    return () => removeJsonLd('live-schema');
  }, [allModels]);

  const sidebarCategories = categoryList.map((slug) => ({
    slug,
    name: categoryName(slug),
    count: allModels.filter((model) => model.category === slug).length
  }));

  const sidebarCountries = countries.map((country) => ({
    slug: country.slug,
    name: country.name,
    count: allModels.filter((model) => model.country === country.code).length
  }));

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      <Sidebar categories={sidebarCategories} countries={sidebarCountries} />

      <div className="flex-1 space-y-6">
        <Breadcrumbs items={[{ label: t('common.home'), to: '/' }, { label: t('common.live') }]} />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-white sm:text-3xl flex items-center gap-2">
            <Icon name="allLive" size={28} /> {t('home.allLiveCams')}
          </h1>
          <button
            type="button"
            onClick={toggleIncludeOffline}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${includeOffline ? 'border-accent bg-accent/10 text-accent' : 'border-border text-zinc-300 hover:border-accent hover:text-white'}`}
          >
            {providerData.includeOffline ? t('common.showOnlyLive') : t('common.includeOffline')}
          </button>
        </div>
        {!loading.stripchat && !loading.chaturbate ? <p className="text-sm text-zinc-400">{total.stripchat + total.chaturbate} {t('header.activeCams')}</p> : null}
        {error.stripchat || error.chaturbate ? <p className="text-sm text-red-400">{error.stripchat || error.chaturbate}</p> : null}
        
        {/* Banner section - distributed like VideoPage */}
        <AllCrackRevenueBanners className="my-1 md:my-3" />
        <MultiformatAd className="my-1 md:my-3" />
        
        {/* STRIPCHAT MODELS - REAL API */}
        <section>
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
            <span className="text-pink-500">●</span> Stripchat
          </h3>
          <ModelGrid models={models.stripchat} loading={loading.stripchat} listName="Stripchat Live Cams" />
        </section>

        {/* Banner between providers */}
        <AllCrackRevenueBanners className="my-1 md:my-3" />
        
        {/* CHATURBATE MODELS - REAL API */}
        <section>
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
            <span className="text-green-500">●</span> Chaturbate
          </h3>
          <ModelGrid models={models.chaturbate} loading={loading.chaturbate} listName="Chaturbate Live Cams" />
        </section>
        
        <Banner728x90 className="hidden md:block mx-auto my-2" />
        <Banner300x250 className="md:hidden mx-auto my-2" />
        <Banner728x90Second className="hidden md:block mx-auto my-2" />
        <NativeAd className="my-1 md:my-3" />
        <MultiformatV2 className="my-1 md:my-3" />
        <RecommendationWidget className="my-1 md:my-3" />
        
        <InstantMessage className="my-1 md:my-3" />
        
        <FAQSection language={language} />
        <InternalLinks language={language} />
      </div>
    </div>
  );
}
