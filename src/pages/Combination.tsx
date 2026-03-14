import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import FAQSection from '../components/FAQSection';
import InfiniteLoader from '../components/InfiniteLoader';
import InternalLinks from '../components/InternalLinks';
import ModelGrid from '../components/ModelGrid';
import { AllCrackRevenueBanners, Banner728x90, Banner300x250, Banner728x90Second, NativeAd, MultiformatAd, MultiformatV2, InstantMessage, RecommendationWidget } from '../components/BannerAds';
import { categoryName, CategorySlug } from '../lib/categories';
import { featuredCategoryTagCombos } from '../lib/programmaticSeo';
import { generateCombinationMeta } from '../lib/metaTags';
import { useSEO, upsertJsonLd, removeJsonLd } from '../lib/seo';
import { seoTextForCombination } from '../lib/seoText';
import { useModelsByProvider } from '../lib/useModelsByProvider';
import { PAGE_SIZES } from '../lib/constants';
import { useI18n } from '../i18n';

export default function CombinationPage() {
  const { category = 'milf', tag = 'tattoo' } = useParams();
  const { language, t } = useI18n();
  const relatedCombos = featuredCategoryTagCombos.filter(
    (entry) => entry.category === category || entry.tag === tag
  ).slice(0, 8);

  const providerData = useModelsByProvider({
    category,
    tag,
    pageSize: PAGE_SIZES.COMBINATION,
    initialIncludeOffline: false
  });

  const { models, total, loading, loadingMore, error, hasMore, includeOffline, toggleIncludeOffline, sentinelRef } = providerData;
  
  const allModels = [...models.stripchat, ...models.chaturbate];
  const meta = generateCombinationMeta(category as CategorySlug, tag, language, allModels.length || 50);
  useSEO(meta.title, meta.description, `/cam/${category}/${tag}`, language);

  // Add structured data for combination page
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
      name: `${categoryName(category)} + ${tag} Live Cams`,
      description: seoTextForCombination(category, tag),
      itemListElement
    };
    
    upsertJsonLd('combination-schema', structuredData);
    
    return () => removeJsonLd('combination-schema');
  }, [category, tag, allModels]);

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: t('common.home'), to: '/' },
          { label: t('common.live'), to: '/live' },
          { label: categoryName(category), to: `/cam/${category}` },
          { label: tag, to: `/tag/${tag}` },
          { label: `${category} + ${tag}` }
        ]}
      />

      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-white">
          {categoryName(category)} + {tag} Live Cams
        </h1>
        <p className="text-sm text-zinc-400">{seoTextForCombination(category, tag)}</p>
      </header>

      {relatedCombos.length ? (
        <section className="rounded-2xl border border-border bg-panel p-4">
          <h2 className="text-lg font-semibold text-white">{t('combinationPage.altreLanding')}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {relatedCombos.map((entry) => (
              <Link
                key={`${entry.category}-${entry.tag}`}
                to={`/cam/${entry.category}/${entry.tag}`}
                className="rounded-full border border-border bg-zinc-900 px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-accent hover:text-white"
              >
                {entry.category} + {entry.tag}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <button
        type="button"
        onClick={toggleIncludeOffline}
        className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
          includeOffline ? 'border-accent bg-accent/10 text-accent' : 'border-border text-zinc-300 hover:border-accent hover:text-white'
        }`}
      >
        {includeOffline ? t('common.showOnlyLive') : t('common.includeOffline')}
      </button>

      {!loading.stripchat && !loading.chaturbate ? <p className="text-sm text-zinc-400">{total.stripchat + total.chaturbate} {t('common.modelsLoaded')}{(hasMore.stripchat || hasMore.chaturbate) ? ` ${t('common.moreAvailable')}` : ''}</p> : null}
      {error.stripchat || error.chaturbate ? <p className="text-sm text-red-400">{error.stripchat || error.chaturbate}</p> : null}
      
      {/* Banner section - distributed like VideoPage */}
      <AllCrackRevenueBanners className="my-4" />
      <MultiformatAd className="my-4" />
      
      {/* STRIPCHAT MODELS - REAL API */}
      <section>
        <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
          <span className="text-pink-500">●</span> Stripchat
        </h3>
        <ModelGrid models={models.stripchat} loading={loading.stripchat} listName={`${categoryName(category)} ${tag} Stripchat Models`} />
      </section>

      {/* Banner between providers */}
      <AllCrackRevenueBanners className="my-4" />
      
      {/* CHATURBATE MODELS - REAL API */}
      <section>
        <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
          <span className="text-green-500">●</span> Chaturbate
        </h3>
        <ModelGrid models={models.chaturbate} loading={loading.chaturbate} listName={`${categoryName(category)} ${tag} Chaturbate Models`} />
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
  );
}
