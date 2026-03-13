import Breadcrumbs from '../components/Breadcrumbs';
import InfiniteLoader from '../components/InfiniteLoader';
import ModelGrid from '../components/ModelGrid';
import Sidebar from '../components/Sidebar';
import Icon from '../components/Icon';
import { useI18n } from '../i18n';
import { countries } from '../lib/countries';
import { categoryName, categories as categoryList } from '../lib/categories';
import { generateDescription, generateTitle, useSEO } from '../lib/seo';
import { useModels } from '../lib/useModels';
import { PAGE_SIZES } from '../lib/constants';

export default function FreeCams() {
  const { t } = useI18n();
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

  // Ottimizzazione SEO specifica per "Free Cams"
  useSEO('Free Cams - Camere Live Gratis', 'Guarda free cams gratis su StripHubs. Accesso immediato a centinaia di modelle live senza registrazione.', '/free-cams');

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
        {!loading ? <p className="text-sm text-zinc-400">{total} {t('header.activeCams')}{hasMore ? ` - ${t('common.moreAvailable')}` : ''}</p> : null}
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <ModelGrid models={models} loading={loading} listName="Free Cams" />
        {hasMore ? <div ref={sentinelRef} className="h-6" aria-hidden="true" /> : null}
        <InfiniteLoader loading={loadingMore} hasMore={hasMore} />
      </div>
    </div>
  );
}
