import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import FAQSection from '../components/FAQSection';
import InfiniteLoader from '../components/InfiniteLoader';
import InternalLinks from '../components/InternalLinks';
import ModelGrid from '../components/ModelGrid';
import { AllCrackRevenueBanners, Banner728x90, Banner300x250, Banner728x90Second, NativeAd, MultiformatAd, MultiformatV2, InstantMessage, RecommendationWidget } from '../components/BannerAds';
import { useI18n } from '../i18n';
import { findCountryBySlug, CountrySlug } from '../lib/countries';
import { featuredCategoryTagCombos, priorityTagSlugs } from '../lib/programmaticSeo';
import { generateCountryMeta } from '../lib/metaTags';
import { useSEO } from '../lib/seo';
import { seoTextForCountry } from '../lib/seoText';
import { useModelsByProvider } from '../lib/useModelsByProvider';
import { PAGE_SIZES } from '../lib/constants';

export default function Country() {
  const { countrySlug = 'italian' } = useParams();
  const { language, t } = useI18n();
  const country = findCountryBySlug(countrySlug);

  const providerData = useModelsByProvider({
    country: country?.code,
    pageSize: PAGE_SIZES.COUNTRY,
    initialIncludeOffline: false
  });

  const { models, total, loading, loadingMore, error, hasMore, includeOffline, toggleIncludeOffline, sentinelRef } = providerData;
  
  const allModels = [...models.stripchat, ...models.chaturbate];
  const meta = generateCountryMeta(countrySlug as CountrySlug, language, t, allModels.length || 100);
  useSEO(meta.title, meta.description, `/country/${countrySlug}`, language);

  const relatedCombos = useMemo(
    () => featuredCategoryTagCombos.filter((entry) => allModels.some((model) => model.category === entry.category)).slice(0, 6),
    [allModels]
  );

  if (!country) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: t('common.home'), to: '/' }, { label: t('common.countries'), to: '/live' }, { label: countrySlug }]} />
        <div className="rounded-2xl border border-border bg-panel p-6 text-zinc-300">{t('common.notFound')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: t('common.home'), to: '/' }, { label: t('common.countries'), to: '/live' }, { label: country.name }]} />

      <header className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">{country.name} Cam Live</h1>
            <p className="max-w-3xl text-sm text-zinc-400">{seoTextForCountry(country.name)}</p>
          </div>
          <button
            type="button"
            onClick={toggleIncludeOffline}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${includeOffline ? 'border-accent bg-accent/10 text-accent' : 'border-border text-zinc-300 hover:border-accent hover:text-white'}`}
          >
            {includeOffline ? t('countryPage.showOnlyLive') : t('countryPage.includeOffline')}
          </button>
        </div>
      </header>

      <section className="rounded-2xl border border-border bg-panel p-4 sm:p-5">
        <h2 className="text-lg font-semibold text-white">{t('countryPage.tagPopolari', { country: country.name.toLowerCase() })}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {priorityTagSlugs.slice(0, 10).map((tag) => (
            <Link
              key={tag}
              to={`/tag/${tag}`}
              className="rounded-full border border-border bg-zinc-900 px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-accent hover:text-white"
            >
              {tag}
            </Link>
          ))}
        </div>
      </section>

      {relatedCombos.length ? (
        <section className="rounded-2xl border border-border bg-panel p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-white">{t('countryPage.combinazioniDaSpingere')}</h2>
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

      {error.stripchat || error.chaturbate ? <p className="text-sm text-red-400">{error.stripchat || error.chaturbate}</p> : null}
      {!loading.stripchat && !loading.chaturbate ? <p className="text-sm text-zinc-400">{total.stripchat + total.chaturbate} {t('common.modelsLoaded')}{(hasMore.stripchat || hasMore.chaturbate) ? ` ${t('common.moreAvailable')}` : ''}</p> : null}
      
      {/* Banner section - distributed like VideoPage */}
      <AllCrackRevenueBanners className="my-1 md:my-3" />
      <MultiformatAd className="my-1 md:my-3" />
      
      {/* STRIPCHAT MODELS - REAL API */}
      <section>
        <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
          <span className="text-pink-500">●</span> Stripchat
        </h3>
        <ModelGrid models={models.stripchat} loading={loading.stripchat} listName={`${country.name} Stripchat Models`} />
      </section>

      {/* Banner between providers */}
      <AllCrackRevenueBanners className="my-1 md:my-3" />
      
      {/* CHATURBATE MODELS - REAL API */}
      <section>
        <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
          <span className="text-green-500">●</span> Chaturbate
        </h3>
        <ModelGrid models={models.chaturbate} loading={loading.chaturbate} listName={`${country.name} Chaturbate Models`} />
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
      
      <FAQSection country={countrySlug as CountrySlug} language={language} />
      
      <InternalLinks currentCountry={countrySlug as CountrySlug} language={language} />
    </div>
  );
}
