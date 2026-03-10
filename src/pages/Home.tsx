import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard';
import InfiniteLoader from '../components/InfiniteLoader';
import ModelCard from '../components/ModelCard';
import ModelGrid from '../components/ModelGrid';
import { api } from '../lib/api';
import { countries, findCountryBySlug } from '../lib/countries';
import { Model } from '../lib/models';
import { categorizeModels, categories as categoryList } from '../lib/categories';
import { extractSeoTags, featuredTagGroups } from '../lib/tags';
import { generateDescription, generateTitle, useSEO } from '../lib/seo';
import { featuredCategoryTagCombos, featuredCountryRoutes, priorityTagSlugs } from '../lib/programmaticSeo';
import { useInfiniteLoad } from '../lib/useInfiniteLoad';
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
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState('');
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { t, language } = useI18n();

  useSEO(generateTitle('home'), generateDescription('home'), '/', language);

  useEffect(() => {
    setLoading(true);
    setOffset(0);
    setHasMore(false);
    setError('');
    void api.getModels({ limit: PAGE_SIZES.HOME, offset: 0 })
      .then((data) => {
        setModels(data.models);
        setOffset(data.models.length);
        setHasMore(Boolean(data.hasMore));
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load models'))
      .finally(() => setLoading(false));
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

  const loadMore = () => {
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
  };

  useInfiniteLoad({
    targetRef: sentinelRef,
    enabled: hasMore && !loading,
    loading: loadingMore,
    onLoadMore: loadMore
  });

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-purple-900/50 via-zinc-900 to-zinc-950 p-5 sm:p-8 md:p-12">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-32 h-32 bg-accent/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-500/30 rounded-full blur-3xl"></div>
        </div>
        <div className="relative">
          <p className="inline-flex rounded-full bg-accent/20 px-3 py-2 text-xs font-semibold text-accent sm:px-4 sm:text-sm">
            🔴 {t('header.liveNow')} - {models.length} {t('header.activeCams')}
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
            <Link to={buildLocalizedPath('/live', language)} className="rounded-full bg-accent px-6 py-3 text-center text-base font-semibold text-white transition-all hover:scale-105 hover:bg-accent/80 sm:px-8 sm:py-4 sm:text-lg">
              🎥 {t('home.watchLiveCta')}
            </Link>
            <Link to={buildLocalizedPath('/cam/teen', language)} className="rounded-full border border-border bg-zinc-900 px-6 py-3 text-center text-base font-semibold text-zinc-200 transition-all hover:bg-zinc-800 sm:px-8 sm:py-4 sm:text-lg">
              📂 {t('home.youngCamsCta')}
            </Link>
          </div>
        </div>
      </section>

      {youngSpotlight.length ? (
        <section className="space-y-3 rounded-3xl border border-border bg-panel p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Spotlight</p>
              <h2 className="text-2xl font-bold text-white">🎯 {t('home.spotlightTitle')}</h2>
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

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">📺 {t('home.allLiveCams')}</h2>
          <Link to={buildLocalizedPath('/live', language)} className="text-sm font-semibold text-accent hover:text-accent/80">{t('home.seeAll')} →</Link>
        </div>
        {error ? <p className="mb-3 text-sm text-red-400">{error}</p> : null}
        <ModelGrid models={prioritizedModels} loading={loading} listName="Home Live Models" />
        {hasMore ? <div ref={sentinelRef} className="h-6" aria-hidden="true" /> : null}
        <InfiniteLoader loading={loadingMore} hasMore={hasMore} />
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold text-white">📂 {t('home.popularCategories')}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.slug} slug={category.slug} name={category.name} count={category.count} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">🌍 {t('home.camsByCountry')}</h2>
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

      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">🌟 {t('home.categoriesForYou')}</h2>
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

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">🔗 {t('home.seoLanding')}</h2>
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

      <section className="py-8 text-center text-zinc-400">
        <p>{t('home.bestSite')}</p>
      </section>
    </div>
  );
}
