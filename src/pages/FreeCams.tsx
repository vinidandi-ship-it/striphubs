import Breadcrumbs from '../components/Breadcrumbs';
import InfiniteLoader from '../components/InfiniteLoader';
import ModelGrid from '../components/ModelGrid';
import Sidebar from '../components/Sidebar';
import Icon from '../components/Icon';
import { AllCrackRevenueBanners, Banner728x90, Banner300x250, Banner728x90Second, NativeAd, MultiformatAd, MultiformatV2, InstantMessage, RecommendationWidget } from '../components/BannerAds';
import { useI18n } from '../i18n';
import { countries } from '../lib/countries';
import { categoryName, categories as categoryList } from '../lib/categories';
import { generateDescription, generateTitle, useSEO } from '../lib/seo';
import { useModelsByProvider } from '../lib/useModelsByProvider';
import { PAGE_SIZES } from '../lib/constants';

export default function FreeCams() {
  const { t } = useI18n();
  const providerData = useModelsByProvider({
    pageSize: PAGE_SIZES.LIVE,
    initialIncludeOffline: false
  });

  const { models, total, loading, loadingMore, error, hasMore, includeOffline, toggleIncludeOffline, sentinelRef } = providerData;
  
  const allModels = [...models.stripchat, ...models.chaturbate];

  useSEO('Free Cams - Camere Live Gratis', 'Guarda free cams gratis su StripHubs. Accesso immediato a centinaia di modelle live senza registrazione.', '/free-cams');

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
        <Breadcrumbs items={[{ label: t('common.home'), to: '/' }, { label: t('common.freeCams') }]} />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-white sm:text-3xl flex items-center gap-2">
            <Icon name="camera" size={28} /> {t('common.freeCams')}
          </h1>
          <button
            type="button"
            onClick={toggleIncludeOffline}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${includeOffline ? 'border-accent bg-accent/10 text-accent' : 'border-border text-zinc-300 hover:border-accent hover:text-white'}`}
          >
            {includeOffline ? t('common.showOnlyLive') : t('common.includeOffline')}
          </button>
        </div>
        {!loading.stripchat && !loading.chaturbate ? <p className="text-sm text-zinc-400">{total.stripchat + total.chaturbate} {t('header.activeCams')}{(hasMore.stripchat || hasMore.chaturbate) ? ` - ${t('common.moreAvailable')}` : ''}</p> : null}
        {error.stripchat || error.chaturbate ? <p className="text-sm text-red-400">{error.stripchat || error.chaturbate}</p> : null}
        
        {/* Banner section - interleaved */}
        <AllCrackRevenueBanners className="my-4" />
        <MultiformatAd className="my-4" />
        
        {/* STRIPCHAT MODELS - REAL API */}
        <section>
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
            <span className="text-pink-500">●</span> Stripchat
          </h3>
          <ModelGrid models={models.stripchat} loading={loading.stripchat} listName="Stripchat Free Cams" />
        </section>

        {/* Banner between providers */}
        <AllCrackRevenueBanners className="my-4" />
        
        {/* CHATURBATE MODELS - REAL API */}
        <section>
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
            <span className="text-green-500">●</span> Chaturbate
          </h3>
          <ModelGrid models={models.chaturbate} loading={loading.chaturbate} listName="Chaturbate Free Cams" />
        </section>
        
        <Banner728x90 className="hidden md:block mx-auto my-2" />
        <Banner300x250 className="md:hidden mx-auto my-2" />
        <Banner728x90Second className="hidden md:block mx-auto my-2" />
        <NativeAd className="my-4" />
        <MultiformatV2 className="my-4" />
        <RecommendationWidget className="my-4" />
        <InstantMessage className="my-4" />
        
        {(hasMore.stripchat || hasMore.chaturbate) ? <div ref={sentinelRef} className="h-6" aria-hidden="true" /> : null}
        <InfiniteLoader loading={loadingMore.stripchat || loadingMore.chaturbate} hasMore={hasMore.stripchat || hasMore.chaturbate} />
      </div>
    </div>
  );
}
