import { 
  Banner728x90, 
  Banner300x250, 
  Banner728x90Second,
  RecommendationWidget,
  NativeAd,
  MultiformatAd,
  MultiformatV2,
  InstantMessage
} from '../components/BannerAds';
import CrackRevenueBanner from '../components/CrackRevenueBanner';
import Breadcrumbs from '../components/Breadcrumbs';
import FAQSection from '../components/FAQSection';
import InfiniteLoader from '../components/InfiniteLoader';
import InternalLinks from '../components/InternalLinks';
import ModelGrid from '../components/ModelGrid';
import Sidebar from '../components/Sidebar';
import Icon from '../components/Icon';
import { useEffect } from 'react';
import { countries } from '../lib/countries';
import { categoryName, categories as categoryList } from '../lib/categories';
import { generateDescription, generateTitle, useSEO, upsertJsonLd, removeJsonLd } from '../lib/seo';
import { useModels } from '../lib/useModels';
import { PAGE_SIZES } from '../lib/constants';
import { useI18n } from '../i18n';

export default function Live() {
  const { language, t } = useI18n();
  const {
    models,
    total,
    loading,
    loadingMore,
    error,
    hasMore,
    includeOffline,
    toggleIncludeOffline,
    sentinelRef
  } = useModels({
    pageSize: PAGE_SIZES.LIVE,
    initialIncludeOffline: false
  });

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
    if (!models.length) return;
    
    const itemListElement = models.slice(0, 20).map((model, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `/model/${encodeURIComponent(model.username)}`
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
  }, [models]);

  const sidebarCategories = categoryList.map((slug) => ({
    slug,
    name: categoryName(slug),
    count: models.filter((model) => model.category === slug).length
  }));

  const sidebarCountries = countries.map((country) => ({
    slug: country.slug,
    name: country.name,
    count: models.filter((model) => model.country === country.code).length
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
            {includeOffline ? t('common.showOnlyLive') : t('common.includeOffline')}
          </button>
        </div>
        {!loading ? <p className="text-sm text-zinc-400">{total} {t('header.activeCams')}{hasMore ? ` - ${t('common.moreAvailable')}` : ''}</p> : null}
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <ModelGrid models={models} loading={loading} listName="All Live Cams" />
        
        <div className="space-y-2 my-4">
          <div className="flex justify-center">
            <Banner728x90 className="hidden md:block" />
            <Banner300x250 className="md:hidden" />
          </div>
          <CrackRevenueBanner />
        </div>
        
        {hasMore ? <div ref={sentinelRef} className="h-6" aria-hidden="true" /> : null}
        <InfiniteLoader loading={loadingMore} hasMore={hasMore} />
        <InfiniteLoader loading={loadingMore} hasMore={hasMore} />
        <FAQSection language={language} />
        <InternalLinks language={language} />
        
        <div className="space-y-2 my-4">
          <div className="flex justify-center">
            <Banner728x90Second className="hidden md:block" />
            <Banner300x250 className="md:hidden" />
          </div>
          <CrackRevenueBanner />
        </div>
      </div>
    </div>
  );
}
