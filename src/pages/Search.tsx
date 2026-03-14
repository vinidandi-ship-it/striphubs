import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import InfiniteLoader from '../components/InfiniteLoader';
import ModelGrid from '../components/ModelGrid';
import SearchBar from '../components/SearchBar';
import { AllCrackRevenueBanners, Banner728x90, Banner300x250, Banner728x90Second, NativeAd, MultiformatAd, MultiformatV2, InstantMessage, RecommendationWidget } from '../components/BannerAds';
import { api } from '../lib/api';
import { generateDescription, generateTitle, useAdvancedSEO } from '../lib/seo';
import { useInfiniteLoad } from '../lib/useInfiniteLoad';
import { useI18n } from '../i18n';

export default function Search() {
  const PAGE_SIZE = 120;
  const [params] = useSearchParams();
  const query = params.get('q') || '';
  const { t } = useI18n();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const [results, setResults] = useState<{ stripchat: any[]; chaturbate: any[]; loading: boolean; error: string; hasMore: boolean }>({
    stripchat: [],
    chaturbate: [],
    loading: true,
    error: '',
    hasMore: false
  });

  useAdvancedSEO(generateTitle('search'), generateDescription('search'), '/search', { noindex: true });

  useEffect(() => {
    setResults(prev => ({ ...prev, loading: true, error: '' }));
    
    Promise.all([
      api.getModels({ search: query, limit: PAGE_SIZE, offset: 0, provider: 'stripchat' }),
      api.getModels({ search: query, limit: PAGE_SIZE, offset: 0, provider: 'chaturbate' })
    ])
      .then(([stripchatData, chaturbateData]) => {
        setResults({
          stripchat: (stripchatData.models || []).map(m => ({ ...m, provider: 'stripchat' })),
          chaturbate: (chaturbateData.models || []).map(m => ({ ...m, provider: 'chaturbate' })),
          loading: false,
          error: '',
          hasMore: (stripchatData.hasMore || chaturbateData.hasMore) || false
        });
      })
      .catch((err) => {
        setResults(prev => ({ ...prev, loading: false, error: err.message }));
      });
  }, [query]);

  const allModels = [...results.stripchat, ...results.chaturbate];

  const loadMore = () => {
    if (results.loading) return;
    setResults(prev => ({ ...prev, loading: true }));
    
    Promise.all([
      api.getModels({ search: query, limit: PAGE_SIZE, offset: allModels.length, provider: 'stripchat' }),
      api.getModels({ search: query, limit: PAGE_SIZE, offset: allModels.length, provider: 'chaturbate' })
    ])
      .then(([stripchatData, chaturbateData]) => {
        setResults(prev => ({
          ...prev,
          stripchat: [...prev.stripchat, ...(stripchatData.models || []).map(m => ({ ...m, provider: 'stripchat' }))],
          chaturbate: [...prev.chaturbate, ...(chaturbateData.models || []).map(m => ({ ...m, provider: 'chaturbate' }))],
          loading: false,
          hasMore: (stripchatData.hasMore || chaturbateData.hasMore) || false
        }));
      })
      .catch(() => {
        setResults(prev => ({ ...prev, loading: false }));
      });
  };

  useInfiniteLoad({
    targetRef: sentinelRef,
    enabled: results.hasMore && !results.loading,
    loading: results.loading,
    onLoadMore: loadMore
  });

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: t('common.home'), to: '/' }, { label: t('search.searchTitle') }]} />
      <h1 className="text-3xl font-bold text-white">{t('search.searchTitle')}</h1>
      <SearchBar initialValue={query} />
      <p className="text-sm text-zinc-400">{allModels.length} {t('common.modelsLoaded')} {t('search.resultsFor')} "{query || 'all'}"{results.hasMore ? ` ${t('common.moreAvailable')}` : ''}</p>
      {results.error ? <p className="text-sm text-red-400">{results.error}</p> : null}
      
      {/* Banner section */}
      <AllCrackRevenueBanners className="my-4" />
      <MultiformatAd className="my-4" />
      
      {/* STRIPCHAT RESULTS */}
      <section>
        <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
          <span className="text-pink-500">●</span> Stripchat
        </h3>
        <ModelGrid models={results.stripchat} loading={results.loading} listName="Stripchat Search Results" />
      </section>

      {/* Banner between providers */}
      <AllCrackRevenueBanners className="my-4" />
      
      {/* CHATURBATE RESULTS */}
      <section>
        <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
          <span className="text-green-500">●</span> Chaturbate
        </h3>
        <ModelGrid models={results.chaturbate} loading={results.loading} listName="Chaturbate Search Results" />
      </section>
      
      <Banner728x90 className="hidden md:block mx-auto my-2" />
      <Banner300x250 className="md:hidden mx-auto my-2" />
      <Banner728x90Second className="hidden md:block mx-auto my-2" />
      <NativeAd className="my-4" />
      <MultiformatV2 className="my-4" />
      <RecommendationWidget className="my-4" />
      <InstantMessage className="my-4" />
      
      {results.hasMore ? <div ref={sentinelRef} className="h-6" aria-hidden="true" /> : null}
      <InfiniteLoader loading={results.loading} hasMore={results.hasMore} />
    </div>
  );
}
