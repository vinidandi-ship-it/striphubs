import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import FAQSection from '../components/FAQSection';
import InfiniteLoader from '../components/InfiniteLoader';
import InternalLinks from '../components/InternalLinks';
import ModelGrid from '../components/ModelGrid';
import Sidebar from '../components/Sidebar';
import { AllCrackRevenueBanners, Banner728x90, Banner300x250, Banner728x90Second, NativeAd, MultiformatAd, MultiformatV2, InstantMessage, RecommendationWidget } from '../components/BannerAds';
import { useI18n, Language } from '../i18n';
import { api } from '../lib/api';
import { countries } from '../lib/countries';
import { categoryName, categories as categoryList, CategorySlug } from '../lib/categories';
import { generateCategoryMeta } from '../lib/metaTags';
import { useAdvancedSEO, upsertJsonLd, removeJsonLd } from '../lib/seo';
import { seoTextForCategory } from '../lib/seoText';
import { useModelsByProvider } from '../lib/useModelsByProvider';
import { PAGE_SIZES } from '../lib/constants';

export default function Category() {
  const { category = 'milf' } = useParams();
  const { language, t } = useI18n();
  const [categories, setCategories] = useState<{ slug: string; name: string; count: number }[]>([]);

  const providerData = useModelsByProvider({
    category,
    pageSize: PAGE_SIZES.CATEGORY,
    initialIncludeOffline: false
  });

  const { models, total, loading, loadingMore, error, hasMore, includeOffline, toggleIncludeOffline, sentinelRef } = providerData;
  
  const allModels = [...models.stripchat, ...models.chaturbate];
  const meta = generateCategoryMeta(category as CategorySlug, language, allModels.length || 150);
  useAdvancedSEO(
    meta.title,
    meta.description,
    `/cam/${category}`,
    {
      lang: language,
      keywords: meta.keywords
    }
  );

  // Add structured data for category page
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
      name: `${categoryName(category)} Live Cams`,
      description: seoTextForCategory(category),
      itemListElement
    };
    
    upsertJsonLd('category-schema', structuredData);
    
    return () => removeJsonLd('category-schema');
  }, [category, allModels]);

  useEffect(() => {
    api.getCategories().then((data) => setCategories(data.categories));
  }, []);

  const sidebarCategories = categoryList.map((slug) => {
    const catData = categories.find((c) => c.slug === slug);
    return {
      slug,
      name: categoryName(slug),
      count: catData?.count || 0
    };
  });

  const sidebarCountries = countries.map((country) => ({
    slug: country.slug,
    name: country.name,
    count: allModels.filter((model) => model.country === country.code).length
  }));

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      <Sidebar categories={sidebarCategories} countries={sidebarCountries} />

      <div className="flex-1 space-y-6">
        <Breadcrumbs items={[{ label: t('common.home'), to: '/' }, { label: t('common.categories'), to: '/live' }, { label: categoryName(category) }]} />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">{categoryName(category)} Live Cams</h1>
            <p className="mt-1 text-sm text-zinc-400">{seoTextForCategory(category)}</p>
          </div>
          <button
            type="button"
            onClick={toggleIncludeOffline}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
              includeOffline ? 'border-accent bg-accent/10 text-accent' : 'border-border text-zinc-300 hover:border-accent hover:text-white'
            }`}
          >
            {includeOffline ? t('common.showOnlyLive') : t('common.includeOffline')}
          </button>
        </div>
        {!loading.stripchat && !loading.chaturbate ? <p className="text-sm text-zinc-400">{total.stripchat + total.chaturbate} {t('common.modelsLoaded')}{(hasMore.stripchat || hasMore.chaturbate) ? ` ${t('common.moreAvailable')}` : ''}</p> : null}
        {error.stripchat || error.chaturbate ? <p className="text-sm text-red-400">{error.stripchat || error.chaturbate}</p> : null}
        
        {/* Banner section - distributed like VideoPage */}
        <AllCrackRevenueBanners className="my-1 md:my-3" />
        <MultiformatAd className="my-1 md:my-3" />
        
        {/* STRIPCHAT MODELS - REAL API */}
        <section>
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
            <span className="text-pink-500">●</span> Stripchat
          </h3>
          <ModelGrid models={models.stripchat} loading={loading.stripchat} listName={`${categoryName(category)} Stripchat Models`} />
        </section>

        {/* Banner between providers */}
        <AllCrackRevenueBanners className="my-1 md:my-3" />
        
        {/* CHATURBATE MODELS - REAL API */}
        <section>
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
            <span className="text-green-500">●</span> Chaturbate
          </h3>
          <ModelGrid models={models.chaturbate} loading={loading.chaturbate} listName={`${categoryName(category)} Chaturbate Models`} />
        </section>
        
        <Banner728x90 className="hidden md:block mx-auto my-2" />
        <Banner300x250 className="md:hidden mx-auto my-2" />
        <Banner728x90Second className="hidden md:block mx-auto my-2" />
        <NativeAd className="my-1 md:my-3" />
        <MultiformatV2 className="my-1 md:my-3" />
        <RecommendationWidget className="my-1 md:my-3" />
        
        {(hasMore.stripchat || hasMore.chaturbate) ? <div ref={sentinelRef} className="h-6" aria-hidden="true" /> : null}
        <InfiniteLoader loading={loadingMore.stripchat || loadingMore.chaturbate} hasMore={hasMore.stripchat || hasMore.chaturbate} />
        
        <InstantMessage className="my-1 md:my-3" />
        
        <FAQSection category={category as CategorySlug} language={language} />
        
        <InternalLinks currentCategory={category as CategorySlug} language={language} />
      </div>
    </div>
  );
}
