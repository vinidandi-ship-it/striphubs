export type SupportedLocale = 'it' | 'en' | 'de' | 'fr' | 'es' | 'pt';

export const SUPPORTED_LOCALES: SupportedLocale[] = ['it', 'en', 'de', 'fr', 'es', 'pt'];

export const DEFAULT_LOCALE: SupportedLocale = 'it';

export const LOCALE_NAMES: Record<SupportedLocale, string> = {
  it: 'Italiano',
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  pt: 'Português'
};

export const LOCALE_FLAGS: Record<SupportedLocale, string> = {
  it: '🇮🇹',
  en: '🇬🇧',
  de: '🇩🇪',
  fr: '🇫🇷',
  es: '🇪🇸',
  pt: '🇵🇹'
};

export interface TranslationKeys {
  common: {
    loading: string;
    loadMore: string;
    loadingModels: string;
    error: string;
    viewers: string;
    live: string;
    offline: string;
    modelsLoaded: string;
    moreAvailable: string;
    watchLive: string;
    search: string;
    searchPlaceholder: string;
    accept: string;
    exit: string;
  };
  nav: {
    home: string;
    countries: string;
    categories: string;
    quickLinks: string;
    allLive: string;
  };
  header: {
    liveNow: string;
    activeCams: string;
  };
  footer: {
    allRightsReserved: string;
    adultsOnly: string;
    notAffiliated: string;
    privacy: string;
    terms: string;
    cookies: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    watchLiveCta: string;
    youngCamsCta: string;
    spotlightTitle: string;
    spotlightSubtitle: string;
    discoverTeen: string;
    allLiveCams: string;
    seeAll: string;
    popularCategories: string;
    camsByCountry: string;
    categoriesForYou: string;
    seoLanding: string;
    explore: string;
    bestSite: string;
    trend: string;
  };
  category: {
    liveCams: string;
    showOnlyLive: string;
    includeOffline: string;
  };
  country: {
    liveCam: string;
  };
  model: {
    profile: string;
    watchingNow: string;
    country: string;
    relatedModels: string;
    notFound: string;
  };
  search: {
    title: string;
    description: string;
    resultsFor: string;
    noResults: string;
    tryDifferent: string;
  };
  seo: {
    homeTitle: string;
    homeDescription: string;
    liveTitle: string;
    liveDescription: string;
    categoryTitle: string;
    categoryDescription: string;
    tagTitle: string;
    tagDescription: string;
    combinationTitle: string;
    combinationDescription: string;
    countryTitle: string;
    countryDescription: string;
    modelTitle: string;
    modelDescription: string;
    searchTitle: string;
    searchDescription: string;
  };
  ageVerification: {
    title: string;
    description: string;
    confirm: string;
  };
  cookieConsent: {
    message: string;
    policy: string;
  };
  categories: Record<string, string>;
  countries: Record<string, string>;
}

export type Translations = TranslationKeys;
