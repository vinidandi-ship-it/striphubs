import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import FAQSection from '../components/FAQSection';
import InfiniteLoader from '../components/InfiniteLoader';
import InternalLinks from '../components/InternalLinks';
import ModelGrid from '../components/ModelGrid';
import { AllCrackRevenueBanners, Banner728x90, Banner300x250, Banner728x90Second, NativeAd, MultiformatAd, MultiformatV2, InstantMessage, RecommendationWidget } from '../components/BannerAds';
import { useI18n } from '../i18n';
import { categories as categoryList, categoryName } from '../lib/categories';
import { featuredCategoryTagCombos } from '../lib/programmaticSeo';
import { generateTagMeta } from '../lib/metaTags';
import { useSEO, upsertJsonLd, removeJsonLd } from '../lib/seo';
import { seoTextForTag } from '../lib/seoText';
import { useModelsByProvider } from '../lib/useModelsByProvider';
import { PAGE_SIZES } from '../lib/constants';

export default function Tag() {
  const { tag = 'girls' } = useParams();
  const { language, t } = useI18n();
  const relatedCategories = categoryList.filter((category) =>
    featuredCategoryTagCombos.some((entry) => entry.category === category && entry.tag === tag)
  );

  const providerData = useModelsByProvider({
    tag,
    pageSize: PAGE_SIZES.TAG,
    initialIncludeOffline: false
  });

  const { models, total, loading, loadingMore, error, hasMore, includeOffline, toggleIncludeOffline, sentinelRef } = providerData;
  
  const allModels = [...models.stripchat, ...models.chaturbate];
  const meta = generateTagMeta(tag, language, allModels.length || 80);
  useSEO(meta.title, meta.description, `/tag/${tag}`, language);

  // Add structured data for tag page
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
      name: `#${tag} Cam Live`,
      description: `Live cam models with tag ${tag}`,
      itemListElement
    };
    
    upsertJsonLd('tag-schema', structuredData);
    
    return () => removeJsonLd('tag-schema');
  }, [tag, allModels]);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: t('common.home'), to: '/' }, { label: t('common.tag'), to: '/live' }, { label: tag }]} />
      <h1 className="text-3xl font-bold text-white">#{tag}</h1>
      <p className="text-sm text-zinc-400">{seoTextForTag(tag)}</p>
      {relatedCategories.length ? (
        <section className="rounded-2xl border border-border bg-panel p-4">
          <h2 className="text-lg font-semibold text-white">{t('tag.landingCorrelate')} {tag}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {relatedCategories.map((category) => (
              <Link
                key={category}
                to={`/cam/${category}/${tag}`}
                className="rounded-full border border-border bg-zinc-900 px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-accent hover:text-white"
              >
                {categoryName(category)} + {tag}
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
      <AllCrackRevenueBanners className="my-1 md:my-3" />
      <MultiformatAd className="my-1 md:my-3" />
      
      {/* STRIPCHAT MODELS - REAL API */}
      <section>
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
          <span className="text-pink-500">●</span> Stripchat
        </h3>
        <ModelGrid models={models.stripchat} loading={loading.stripchat} listName={`Tag ${tag} Stripchat Models`} />
      </section>

      {/* Banner between providers */}
      <AllCrackRevenueBanners className="my-1 md:my-3" />
      
      {/* CHATURBATE MODELS - REAL API */}
      <section>
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
          <span className="text-green-500">●</span> Chaturbate
        </h3>
        <ModelGrid models={models.chaturbate} loading={loading.chaturbate} listName={`Tag ${tag} Chaturbate Models`} />
      </section>
      
      <Banner728x90 className="hidden md:block mx-auto my-2" />
      <Banner300x250 className="md:hidden mx-auto my-2" />
      <Banner728x90Second className="hidden md:block mx-auto my-2" />
      <NativeAd className="my-1 md:my-3" />
      <MultiformatV2 className="my-1 md:my-3" />
      <RecommendationWidget className="my-1 md:my-3" />
      
      <InstantMessage className="my-1 md:my-3" />
      
      <FAQSection tag={tag} language={language} />
      
      <InternalLinks currentTag={tag} language={language} />
      
      {(hasMore.stripchat || hasMore.chaturbate) ? <div ref={sentinelRef} className="h-6" aria-hidden="true" /> : null}
      <InfiniteLoader loading={loadingMore.stripchat || loadingMore.chaturbate} hasMore={hasMore.stripchat || hasMore.chaturbate} />
    </div>
  );
}
