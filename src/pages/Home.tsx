import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard';
import FAQSection from '../components/FAQSection';
import InfiniteLoader from '../components/InfiniteLoader';
import ModelCard from '../components/ModelCard';
import ModelGrid from '../components/ModelGrid';
import Icon from '../components/Icon';
import { AllCrackRevenueBanners, Banner728x90, Banner300x250, Banner728x90Second, NativeAd, MultiformatAd, MultiformatV2, InstantMessage, RecommendationWidget } from '../components/BannerAds';
import { api } from '../lib/api';
import { countries, findCountryBySlug } from '../lib/countries';
import { Model } from '../lib/models';
import { categorizeModels, categories as categoryList } from '../lib/categories';
import { extractSeoTags, featuredTagGroups } from '../lib/tags';
import { generateDescription, generateTitle, useSEO } from '../lib/seo';
import { featuredCategoryTagCombos, featuredCountryRoutes, priorityTagSlugs } from '../lib/programmaticSeo';
import { useInfiniteLoad } from '../lib/useInfiniteLoad';
import { useModelsByProvider } from '../lib/useModelsByProvider';
import { useI18n } from '../i18n';
import { buildLocalizedPath } from '../i18n/routing';
import {
  PAGE_SIZES,
  CATEGORY_PREVIEW_LIMIT,
  HOME_CATEGORY_PRIORITY,
  YOUNG_MODEL_PATTERNS,
  YOUNG_SPOTLIGHT_THRESHOLD,
  YOUNG_SPOTLIGHT_SIZE
} from '../lib/constants';

// Blog posts for the home page section
const recentBlogPosts = [
  {
    slug: 'guida-cam-gratis',
    title: 'Guida Completa alle Cam Live Gratis',
    excerpt: 'Scopri come accedere a migliaia di cam live gratuite senza registrazione.',
    category: 'Guide'
  },
  {
    slug: 'migliori-modelle-italiane',
    title: 'Migliori Modelle Italiane',
    excerpt: 'Una selezione delle modelle italiane più popolari.',
    category: 'Liste'
  },
  {
    slug: 'sicurezza-cam',
    title: 'Sicurezza e Privacy',
    excerpt: 'Come proteggere la tua privacy online.',
    category: 'Guide'
  }
];

const getHomeCategoryRank = (slug: string) => {
  const index = HOME_CATEGORY_PRIORITY.indexOf(slug as (typeof HOME_CATEGORY_PRIORITY)[number]);
  return index === -1 ? HOME_CATEGORY_PRIORITY.length : index;
};

const getYoungModelScore = (model: Model) => {
  const joined = `${model.category} ${model.tags.join(' ')}`.toLowerCase();
  let score = 0;

  YOUNG_MODEL_PATTERNS.forEach((pattern, index) => {
    if (pattern.test(joined)) {
      score += index === 0 ? 100 : 25;
    }
  });

  if (model.category === 'teen') score += 150;
  if (joined.includes('petite')) score += 40;
  return score;
};

export default function Home() {
  const [models, setModels] = useState<Model[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState('');
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { t, language } = useI18n();

  // Separate models by provider - REAL DATA from two APIs
  const providerData = useModelsByProvider({
    pageSize: 24,
    initialIncludeOffline: false
  });

  useSEO(
    generateTitle('home'),
    generateDescription('home'),
    '/',
    language,
    {
      keywords: ['live cam gratis', 'cam directory', 'modelle online', 'streaming gratis', 'cam live', 'teen cam', 'milf cam', 'asiatiche cam']
    }
  );

  // Add structured data for home page
  useEffect(() => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'StripHubs',
      url: 'https://striphubs.com',
      description: 'La migliore directory italiana di live cam gratis',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://striphubs.com/search?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Progressive loading: first small batch, then load more
  useEffect(() => {
    setLoading(true);
    setError('');
    
    // First: load just 24 models for fast initial render
    api.getModels({ limit: 24, offset: 0 })
      .then((data) => {
        setModels(data.models);
        setTotal(data.total || data.models.length);
        setOffset(data.models.length);
        setHasMore(Boolean(data.hasMore));
        setLoading(false);
        setInitialLoadComplete(true);
        
        // Then: load remaining in background
        return api.getModels({ limit: PAGE_SIZES.HOME - 24, offset: 24 });
      })
      .then((data) => {
        if (data.models.length > 0) {
          setModels(prev => [...prev, ...data.models]);
          setOffset(prev => prev + data.models.length);
        }
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load models');
        setLoading(false);
      });
  }, []);

  const prioritizedModels = useMemo(
    () =>
      [...models].sort((a, b) => {
        const scoreDiff = getYoungModelScore(b) - getYoungModelScore(a);
        if (scoreDiff !== 0) return scoreDiff;
        return b.viewers - a.viewers;
      }),
    [models]
  );

  const youngSpotlight = useMemo(
    () => prioritizedModels.filter((model) => getYoungModelScore(model) >= YOUNG_SPOTLIGHT_THRESHOLD).slice(0, YOUNG_SPOTLIGHT_SIZE),
    [prioritizedModels]
  );

  const categories = useMemo(() => {
    const fromHomeFeed = categorizeModels(models);
    return categoryList.map((slug) => {
      const existing = fromHomeFeed.find((item) => item.slug === slug);
      const previewCount = models.filter((model) => model.category === slug).length;
      return {
        slug,
        name: existing?.name ?? t(`categories.${slug}`) ?? slug.charAt(0).toUpperCase() + slug.slice(1),
        count: Math.max(existing?.count ?? 0, previewCount)
      };
    }).sort((a, b) => {
      const rankDiff = getHomeCategoryRank(a.slug) - getHomeCategoryRank(b.slug);
      if (rankDiff !== 0) return rankDiff;
      return b.count - a.count;
    });
  }, [models, t]);
  const categoryModels = useMemo(
    () =>
      Object.fromEntries(
        categoryList.map((category) => [
          category,
          prioritizedModels.filter((model) => model.category === category).slice(0, CATEGORY_PREVIEW_LIMIT)
        ])
      ) as Record<string, Model[]>,
    [prioritizedModels]
  );
  const topCategories = useMemo(
    () => categories.filter((category) => (categoryModels[category.slug]?.length ?? 0) > 0),
    [categories, categoryModels]
  );
  const tagSections = useMemo(
    () =>
      Object.entries(featuredTagGroups)
        .map(([group, groupTags]) => ({
          group,
          items: groupTags
            .map((tag) => ({
              tag,
              models: models.filter((model) => model.tags.some((item) => item.includes(tag))).slice(0, CATEGORY_PREVIEW_LIMIT)
            }))
            .filter((entry) => entry.models.length > 0)
        }))
        .filter((section) => section.items.length > 0),
    [models]
  );
  const trendingSeoTags = useMemo(() => {
    const counts = new Map<string, number>();

    models.forEach((model) => {
      extractSeoTags(model.tags, 5).forEach((tag) => {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      });
    });

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([tag]) => tag);
  }, [models]);
  const featuredCountries = useMemo(
    () =>
      featuredCountryRoutes
        .map((route) => route.replace('/country/', ''))
        .map((slug) => findCountryBySlug(slug))
        .filter((c): c is NonNullable<typeof c> => Boolean(c))
        .map((country) => ({
          ...country,
          name: t(`countries.${country.nameKey}`),
          count: models.filter((model) => model.country === country.code).length
        }))
        .filter((country) => country.count > 0),
    [models, t]
  );

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    void api.getModels({ limit: PAGE_SIZES.HOME, offset })
      .then((data) => {
        setModels((current) => {
          const seen = new Set(current.map((item) => item.username.toLowerCase()));
          const merged = [...current];
          data.models.forEach((item) => {
            const name = item.username.toLowerCase();
            if (!seen.has(name)) {
              seen.add(name);
              merged.push(item);
            }
          });
          return merged;
        });
        setOffset((current) => current + data.models.length);
        setHasMore(Boolean(data.hasMore));
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load more models'))
      .finally(() => setLoadingMore(false));
  }, [loadingMore, hasMore, offset]);

  useInfiniteLoad({
    targetRef: sentinelRef,
    enabled: hasMore && !loading,
    loading: loadingMore,
    onLoadMore: loadMore
  });

  return (
    <div className="space-y-4 md:space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-purple-900/50 via-zinc-900 to-zinc-950 p-5 sm:p-8 md:p-12">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-32 h-32 bg-accent/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-500/30 rounded-full blur-3xl"></div>
        </div>
        <div className="relative">
           <p className="inline-flex rounded-full bg-accent/20 px-3 py-2 text-xs font-semibold text-accent sm:px-4 sm:text-sm items-center gap-2">
             <Icon name="live" size={12} /> {t('header.liveNow')} - 20,000+ modelle online ora
           </p>
          <h1 className="mt-4 max-w-4xl text-2xl font-extrabold leading-tight text-white sm:text-5xl">
            {t('home.heroTitle')}
          </h1>
          <p className="mt-4 max-w-3xl text-base text-zinc-300 sm:text-lg">
            {t('home.heroSubtitle')}
          </p>
          <p className="mt-2 max-w-3xl text-base text-zinc-400 sm:text-lg">
            {t('home.heroDescription')}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link to={buildLocalizedPath('/live', language)} className="rounded-full bg-accent px-6 py-3 text-center text-base font-semibold text-white transition-all hover:scale-105 hover:bg-accent/80 sm:px-8 sm:py-4 sm:text-lg flex items-center justify-center gap-2">
               <Icon name="camera" size={18} /> {t('home.watchLiveCta')}
             </Link>
             <Link to={buildLocalizedPath('/cam/teen', language)} className="rounded-full border border-border bg-zinc-900 px-6 py-3 text-center text-base font-semibold text-zinc-200 transition-all hover:bg-zinc-800 sm:px-8 sm:py-4 sm:text-lg flex items-center justify-center gap-2">
               <Icon name="categories" size={18} /> {t('home.youngCamsCta')}
             </Link>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-zinc-400 sm:text-sm">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              99.9% Uptime
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z"/></svg>
              100% Gratis
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              SSL Sicuro
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/></svg>
              Nessuna Registrazione
            </span>
          </div>
        </div>
      </section>

      {/* BANNER dopo hero */}
      <AllCrackRevenueBanners className="my-1 md:my-3" />
      <MultiformatAd className="my-1 md:my-3" />

      {/* Young Spotlight - modelli */}
      {youngSpotlight.length ? (
        <section className="space-y-3 rounded-3xl border border-border bg-panel p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Spotlight</p>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Icon name="spotlight" size={24} /> {t('home.spotlightTitle')}
              </h2>
              <p className="text-sm text-zinc-400">{t('home.spotlightSubtitle')}</p>
            </div>
            <Link to={buildLocalizedPath('/cam/teen', language)} className="text-sm font-semibold text-accent hover:text-accent/80">
              {t('home.discoverTeen')} →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {youngSpotlight.map((model) => (
              <ModelCard key={model.username} model={model} />
            ))}
          </div>
        </section>
      ) : null}

      {/* BANNER dopo spotlight */}
      <Banner728x90 className="hidden md:block mx-auto my-1 md:my-3" />
      <Banner300x250 className="md:hidden mx-auto my-2" />

      {/* STRIPCHAT MODELS - REAL API DATA */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-pink-500">●</span> Stripchat Models
          </h2>
          <Link to={buildLocalizedPath('/live', language)} className="text-sm font-semibold text-accent hover:text-accent/80">{t('home.seeAll')} →</Link>
        </div>
        <ModelGrid models={providerData.models.stripchat} loading={providerData.loading.stripchat} listName="Stripchat Models" />
      </section>

      {/* Banner between providers */}
      <AllCrackRevenueBanners className="my-1 md:my-3" />

      {/* CHATURBATE MODELS - REAL API DATA */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-green-500">●</span> Chaturbate Models
          </h2>
          <Link to={buildLocalizedPath('/live', language)} className="text-sm font-semibold text-accent hover:text-accent/80">{t('home.seeAll')} →</Link>
        </div>
        <ModelGrid models={providerData.models.chaturbate} loading={providerData.loading.chaturbate} listName="Chaturbate Models" />
      </section>

      {/* Banner section - distributed like VideoPage */}
      <AllCrackRevenueBanners className="my-1 md:my-3" />
      <MultiformatAd className="my-1 md:my-3" />
      <Banner728x90 className="hidden md:block mx-auto my-2" />
      <Banner300x250 className="md:hidden mx-auto my-2" />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Icon name="globe" size={24} /> {t('home.camsByCountry')}
          </h2>
          <Link to={buildLocalizedPath('/live', language)} className="text-sm font-semibold text-accent hover:text-accent/80">{t('home.seeAll')} →</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCountries.map((country) => (
            <Link
              key={country.slug}
              to={buildLocalizedPath(`/country/${country.slug}`, language)}
              className="rounded-2xl border border-border bg-panel p-5 transition-all hover:-translate-y-1 hover:border-accent hover:shadow-lg hover:shadow-accent/20"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-lg font-semibold text-zinc-100">{country.name}</p>
                <span className="rounded-full bg-zinc-800 px-2 py-1 text-xs text-zinc-400">{country.count}</span>
              </div>
              <p className="mt-2 text-sm text-zinc-500">{t('country.liveCam')} {country.name.toLowerCase()}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* BANNER dopo paesi */}
      <Banner728x90Second className="hidden md:block mx-auto my-4" />
      <NativeAd className="my-4" />

      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Icon name="spotlight" size={24} /> {t('home.categoriesForYou')}
          </h2>
          <Link to={buildLocalizedPath('/live', language)} className="text-sm font-semibold text-accent hover:text-accent/80">{t('home.seeAll')} →</Link>
        </div>

        {topCategories.slice(0, 6).map((category) => (
          <section key={category.slug} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">{category.name} <span className="text-sm font-normal text-zinc-400">• {category.count} live</span></h3>
              </div>
              <Link to={buildLocalizedPath(`/cam/${category.slug}`, language)} className="text-sm font-semibold text-accent hover:text-accent/80">{t('home.seeAll')} →</Link>
            </div>
            <ModelGrid
              models={categoryModels[category.slug] || []}
              loading={loading}
              listName={`${category.slug} home preview`}
            />
          </section>
        ))}
      </section>

      {/* More banners distributed in page */}
      <Banner728x90Second className="hidden md:block mx-auto my-2" />
      <NativeAd className="my-4" />
      <MultiformatV2 className="my-4" />
      <RecommendationWidget className="my-4" />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Icon name="blog" size={24} /> Articoli Recenti
          </h2>
          <Link to={buildLocalizedPath('/blog', language)} className="text-sm font-semibold text-accent hover:text-accent/80">{t('home.seeAll')} →</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentBlogPosts.map((post) => (
            <Link
              key={post.slug}
              to={buildLocalizedPath(`/blog/${post.slug}`, language)}
              className="rounded-2xl border border-border bg-panel p-5 transition-all hover:-translate-y-1 hover:border-accent hover:shadow-lg hover:shadow-accent/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-1 rounded-full">
                  {post.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{post.title}</h3>
              <p className="text-sm text-zinc-400">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Icon name="quickLinks" size={24} /> {t('home.seoLanding')}
          </h2>
          <Link to={buildLocalizedPath('/search', language)} className="text-sm font-semibold text-accent hover:text-accent/80">{t('home.explore')} →</Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {priorityTagSlugs.map((tag) => (
            <Link
              key={tag}
              to={buildLocalizedPath(`/tag/${tag}`, language)}
              className="rounded-full border border-border bg-zinc-900 px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-accent hover:text-white"
            >
              {tag}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {featuredCategoryTagCombos.map((entry) => (
            <Link
              key={`${entry.category}-${entry.tag}`}
              to={buildLocalizedPath(`/cam/${entry.category}/${entry.tag}`, language)}
              className="rounded-full border border-border bg-zinc-900 px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-accent hover:text-white"
            >
              {entry.category} + {entry.tag}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {trendingSeoTags.map((tag) => (
            <Link
              key={tag}
              to={buildLocalizedPath(`/tag/${tag}`, language)}
              className="rounded-full border border-border bg-panel px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-accent hover:text-white"
            >
              {t('home.trend')}: {tag}
            </Link>
          ))}
        </div>
      </section>

      <FAQSection language={language} />

      {/* Final banners at bottom */}
      <AllCrackRevenueBanners className="my-4" />
      <InstantMessage className="my-4" />
      <Banner728x90 className="hidden md:block mx-auto my-2" />
      <Banner300x250 className="md:hidden mx-auto my-2" />

      <section className="py-8 text-center text-zinc-400">
        <p>{t('home.bestSite')}</p>
      </section>
    </div>
  );
}
