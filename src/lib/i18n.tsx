import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

export const SUPPORTED_LANGUAGES = ['en', 'it', 'es', 'fr', 'de', 'pt'] as const;
export type Lang = (typeof SUPPORTED_LANGUAGES)[number];

type Dict = Record<string, string>;

const dict: Record<Lang, Dict> = {
  en: {
    navHome: 'Home',
    navLive: 'Live',
    navCategories: 'Categories',
    navTags: 'Tags',
    searchPlaceholder: 'Search models, tags, categories',
    searchButton: 'Search',
    heroBadge: 'Live now',
    heroTitle: 'Discover top live cam models and start watching instantly.',
    heroText: 'StripHubs helps you find live models by category and tag with direct one-click access.',
    heroExplore: 'Explore Live Cams',
    heroBrowse: 'Browse Categories',
    liveFeed: 'Live Cam Feed',
    categories: 'Categories',
    trendingLive: 'Trending Live',
    footerAdults: 'Adults only (18+).',
    footerPrivacy: 'Privacy',
    footerTerms: 'Terms',
    footerCookies: 'Cookies',
    ageTitle: 'Age Verification',
    ageText: 'You must be 18 or older to access this website.',
    ageAccept: 'I am 18+',
    ageExit: 'Exit',
    cookieText: 'We use cookies to improve your experience and track affiliate performance. Read our',
    cookiePolicy: 'Cookie Policy',
    cookieAccept: 'Accept',
    categoryBrowse: 'Browse live {category} models',
    modelLive: 'LIVE',
    modelWatching: 'watching',
    modelWatch: 'Watch Live',
    noModels: 'No models found.',
    allLive: 'All Live Cams',
    realtimeFeed: 'Real-time feed powered by live provider affiliate widget.',
    categoryLive: '{category} Live Cams',
    categoryRealtime: 'Real-time category feed powered by live provider.',
    tagRealtime: 'Real-time tag feed powered by live provider.',
    searchTitle: 'Search',
    searchRealtime: 'Real-time results for "{query}"',
    searchFallback: '{count} local fallback results for "{query}"',
    privacyTitle: 'Privacy Policy',
    termsTitle: 'Terms of Service',
    cookiesTitle: 'Cookie Policy',
    modelNotFound: 'Model not found.',
    categoryLabel: 'Category',
    watchModel: 'Watch {name} Live',
    modelViewersNow: '{viewers} viewers watching now',
    ifNoFeed: 'If no feed appears, disable ad blockers or open directly on',
    stripchat: 'live provider',
    searchPageTitle: 'Search Cams',
    livePageTitle: 'All Live Cams',
    homePageTitle: 'Live Cam Directory'
  },
  it: {
    navHome: 'Home',
    navLive: 'Live',
    navCategories: 'Categorie',
    navTags: 'Tag',
    searchPlaceholder: 'Cerca modelle, tag, categorie',
    searchButton: 'Cerca',
    heroBadge: 'In diretta ora',
    heroTitle: 'Scopri le migliori modelle live e guarda subito.',
    heroText: 'StripHubs ti aiuta a trovare modelle live per categoria e tag con accesso diretto in un click.',
    heroExplore: 'Esplora Live Cam',
    heroBrowse: 'Sfoglia categorie',
    liveFeed: 'Feed Live Cam',
    categories: 'Categorie',
    trendingLive: 'Live di tendenza',
    footerAdults: 'Solo per adulti (18+).',
    footerPrivacy: 'Privacy',
    footerTerms: 'Termini',
    footerCookies: 'Cookie',
    ageTitle: 'Verifica età',
    ageText: 'Devi avere almeno 18 anni per accedere a questo sito.',
    ageAccept: 'Ho più di 18 anni',
    ageExit: 'Esci',
    cookieText: 'Usiamo cookie per migliorare l’esperienza e tracciare le performance affiliate. Leggi la nostra',
    cookiePolicy: 'Cookie Policy',
    cookieAccept: 'Accetta',
    categoryBrowse: 'Guarda modelle live {category}',
    modelLive: 'LIVE',
    modelWatching: 'in visione',
    modelWatch: 'Guarda live',
    noModels: 'Nessuna modella trovata.',
    allLive: 'Tutte le Live Cam',
    realtimeFeed: 'Feed in tempo reale powered by widget affiliato live provider.',
    categoryLive: 'Live Cam {category}',
    categoryRealtime: 'Feed categoria in tempo reale powered by live provider.',
    tagRealtime: 'Feed tag in tempo reale powered by live provider.',
    searchTitle: 'Ricerca',
    searchRealtime: 'Risultati in tempo reale per "{query}"',
    searchFallback: '{count} risultati locali fallback per "{query}"',
    privacyTitle: 'Privacy Policy',
    termsTitle: 'Termini di servizio',
    cookiesTitle: 'Cookie Policy',
    modelNotFound: 'Modella non trovata.',
    categoryLabel: 'Categoria',
    watchModel: 'Guarda {name} Live',
    modelViewersNow: '{viewers} utenti in visione ora',
    ifNoFeed: 'Se non vedi il feed, disattiva l’ad blocker oppure apri direttamente su',
    stripchat: 'live provider',
    searchPageTitle: 'Cerca Cam',
    livePageTitle: 'Tutte le Live Cam',
    homePageTitle: 'Directory Live Cam'
  },
  es: {
    navHome: 'Inicio',
    navLive: 'En vivo',
    navCategories: 'Categorías',
    navTags: 'Tags',
    searchPlaceholder: 'Buscar modelos, tags, categorías',
    searchButton: 'Buscar',
    heroBadge: 'En vivo ahora',
    heroTitle: 'Descubre modelos en vivo y mira al instante.',
    heroText: 'StripHubs te ayuda a encontrar modelos por categoría y tag con acceso directo.',
    heroExplore: 'Explorar en vivo',
    heroBrowse: 'Ver categorías',
    liveFeed: 'Feed en vivo',
    categories: 'Categorías',
    trendingLive: 'Tendencias en vivo',
    footerAdults: 'Solo adultos (18+).',
    footerPrivacy: 'Privacidad',
    footerTerms: 'Términos',
    footerCookies: 'Cookies',
    ageTitle: 'Verificación de edad',
    ageText: 'Debes tener 18 años o más para acceder a este sitio.',
    ageAccept: 'Tengo 18+',
    ageExit: 'Salir',
    cookieText: 'Usamos cookies para mejorar tu experiencia y medir rendimiento de afiliados. Lee nuestra',
    cookiePolicy: 'Política de cookies',
    cookieAccept: 'Aceptar',
    categoryBrowse: 'Ver modelos en vivo {category}',
    modelLive: 'LIVE',
    modelWatching: 'mirando',
    modelWatch: 'Ver en vivo',
    noModels: 'No se encontraron modelos.',
    allLive: 'Todas las cámaras en vivo',
    realtimeFeed: 'Feed en tiempo real con widget afiliado de live provider.',
    categoryLive: 'Cámaras en vivo {category}',
    categoryRealtime: 'Feed de categoría en tiempo real por live provider.',
    tagRealtime: 'Feed de tag en tiempo real por live provider.',
    searchTitle: 'Buscar',
    searchRealtime: 'Resultados en tiempo real para "{query}"',
    searchFallback: '{count} resultados locales para "{query}"',
    privacyTitle: 'Política de privacidad',
    termsTitle: 'Términos del servicio',
    cookiesTitle: 'Política de cookies',
    modelNotFound: 'Modelo no encontrada.',
    categoryLabel: 'Categoría',
    watchModel: 'Ver {name} en vivo',
    modelViewersNow: '{viewers} espectadores ahora',
    ifNoFeed: 'Si no aparece el feed, desactiva adblock o abre directamente en',
    stripchat: 'live provider',
    searchPageTitle: 'Buscar cams',
    livePageTitle: 'Todas las cams en vivo',
    homePageTitle: 'Directorio live cam'
  },
  fr: {
    navHome: 'Accueil',
    navLive: 'Live',
    navCategories: 'Catégories',
    navTags: 'Tags',
    searchPlaceholder: 'Rechercher modèles, tags, catégories',
    searchButton: 'Chercher',
    heroBadge: 'En direct',
    heroTitle: 'Découvrez les meilleurs modèles live et regardez instantanément.',
    heroText: 'StripHubs vous aide à trouver des modèles live par catégorie et tag.',
    heroExplore: 'Explorer le live',
    heroBrowse: 'Voir catégories',
    liveFeed: 'Flux live',
    categories: 'Catégories',
    trendingLive: 'Tendance live',
    footerAdults: 'Réservé aux adultes (18+).',
    footerPrivacy: 'Confidentialité',
    footerTerms: 'Conditions',
    footerCookies: 'Cookies',
    ageTitle: 'Vérification d’âge',
    ageText: 'Vous devez avoir 18 ans ou plus pour accéder à ce site.',
    ageAccept: 'J’ai 18+',
    ageExit: 'Quitter',
    cookieText: 'Nous utilisons des cookies pour améliorer votre expérience et suivre les affiliations. Lisez notre',
    cookiePolicy: 'Politique cookies',
    cookieAccept: 'Accepter',
    categoryBrowse: 'Voir modèles live {category}',
    modelLive: 'LIVE',
    modelWatching: 'spectateurs',
    modelWatch: 'Regarder live',
    noModels: 'Aucun modèle trouvé.',
    allLive: 'Toutes les cams live',
    realtimeFeed: 'Flux en temps réel via widget affilié live provider.',
    categoryLive: 'Cams live {category}',
    categoryRealtime: 'Flux catégorie en temps réel via live provider.',
    tagRealtime: 'Flux tag en temps réel via live provider.',
    searchTitle: 'Recherche',
    searchRealtime: 'Résultats en temps réel pour "{query}"',
    searchFallback: '{count} résultats locaux pour "{query}"',
    privacyTitle: 'Politique de confidentialité',
    termsTitle: 'Conditions d’utilisation',
    cookiesTitle: 'Politique cookies',
    modelNotFound: 'Modèle introuvable.',
    categoryLabel: 'Catégorie',
    watchModel: 'Regarder {name} en live',
    modelViewersNow: '{viewers} spectateurs en ce moment',
    ifNoFeed: 'Si le flux ne s’affiche pas, désactivez l’adblock ou ouvrez directement sur',
    stripchat: 'live provider',
    searchPageTitle: 'Recherche cams',
    livePageTitle: 'Toutes les cams live',
    homePageTitle: 'Annuaire live cam'
  },
  de: {
    navHome: 'Start',
    navLive: 'Live',
    navCategories: 'Kategorien',
    navTags: 'Tags',
    searchPlaceholder: 'Models, Tags, Kategorien suchen',
    searchButton: 'Suchen',
    heroBadge: 'Jetzt live',
    heroTitle: 'Entdecke Top-Live-Models und starte sofort.',
    heroText: 'StripHubs hilft dir, Live-Models nach Kategorie und Tag zu finden.',
    heroExplore: 'Live-Cams ansehen',
    heroBrowse: 'Kategorien ansehen',
    liveFeed: 'Live-Feed',
    categories: 'Kategorien',
    trendingLive: 'Live-Trends',
    footerAdults: 'Nur für Erwachsene (18+).',
    footerPrivacy: 'Datenschutz',
    footerTerms: 'AGB',
    footerCookies: 'Cookies',
    ageTitle: 'Altersprüfung',
    ageText: 'Du musst 18 Jahre oder älter sein, um diese Seite zu nutzen.',
    ageAccept: 'Ich bin 18+',
    ageExit: 'Verlassen',
    cookieText: 'Wir nutzen Cookies für bessere Erfahrung und Affiliate-Tracking. Lies unsere',
    cookiePolicy: 'Cookie-Richtlinie',
    cookieAccept: 'Akzeptieren',
    categoryBrowse: 'Live-Models {category} ansehen',
    modelLive: 'LIVE',
    modelWatching: 'zuschauer',
    modelWatch: 'Live ansehen',
    noModels: 'Keine Models gefunden.',
    allLive: 'Alle Live-Cams',
    realtimeFeed: 'Echtzeit-Feed mit live provider Affiliate Widget.',
    categoryLive: '{category} Live-Cams',
    categoryRealtime: 'Echtzeit-Kategorie-Feed von live provider.',
    tagRealtime: 'Echtzeit-Tag-Feed von live provider.',
    searchTitle: 'Suche',
    searchRealtime: 'Echtzeit-Ergebnisse für "{query}"',
    searchFallback: '{count} lokale Ergebnisse für "{query}"',
    privacyTitle: 'Datenschutzrichtlinie',
    termsTitle: 'Nutzungsbedingungen',
    cookiesTitle: 'Cookie-Richtlinie',
    modelNotFound: 'Model nicht gefunden.',
    categoryLabel: 'Kategorie',
    watchModel: '{name} live ansehen',
    modelViewersNow: '{viewers} Zuschauer jetzt',
    ifNoFeed: 'Wenn kein Feed erscheint, Adblock deaktivieren oder direkt öffnen auf',
    stripchat: 'live provider',
    searchPageTitle: 'Cam-Suche',
    livePageTitle: 'Alle Live-Cams',
    homePageTitle: 'Live-Cam-Verzeichnis'
  },
  pt: {
    navHome: 'Início',
    navLive: 'Ao vivo',
    navCategories: 'Categorias',
    navTags: 'Tags',
    searchPlaceholder: 'Buscar modelos, tags, categorias',
    searchButton: 'Buscar',
    heroBadge: 'Ao vivo agora',
    heroTitle: 'Descubra modelos ao vivo e assista na hora.',
    heroText: 'StripHubs ajuda você a encontrar modelos por categoria e tag com acesso direto.',
    heroExplore: 'Explorar ao vivo',
    heroBrowse: 'Ver categorias',
    liveFeed: 'Feed ao vivo',
    categories: 'Categorias',
    trendingLive: 'Tendência ao vivo',
    footerAdults: 'Somente adultos (18+).',
    footerPrivacy: 'Privacidade',
    footerTerms: 'Termos',
    footerCookies: 'Cookies',
    ageTitle: 'Verificação de idade',
    ageText: 'Você deve ter 18 anos ou mais para acessar este site.',
    ageAccept: 'Tenho 18+',
    ageExit: 'Sair',
    cookieText: 'Usamos cookies para melhorar sua experiência e rastrear afiliados. Leia nossa',
    cookiePolicy: 'Política de cookies',
    cookieAccept: 'Aceitar',
    categoryBrowse: 'Ver modelos ao vivo {category}',
    modelLive: 'LIVE',
    modelWatching: 'assistindo',
    modelWatch: 'Assistir ao vivo',
    noModels: 'Nenhuma modelo encontrada.',
    allLive: 'Todas as cams ao vivo',
    realtimeFeed: 'Feed em tempo real com widget afiliado live provider.',
    categoryLive: 'Cams ao vivo {category}',
    categoryRealtime: 'Feed de categoria em tempo real via live provider.',
    tagRealtime: 'Feed de tag em tempo real via live provider.',
    searchTitle: 'Busca',
    searchRealtime: 'Resultados em tempo real para "{query}"',
    searchFallback: '{count} resultados locais para "{query}"',
    privacyTitle: 'Política de privacidade',
    termsTitle: 'Termos de serviço',
    cookiesTitle: 'Política de cookies',
    modelNotFound: 'Modelo não encontrada.',
    categoryLabel: 'Categoria',
    watchModel: 'Assistir {name} ao vivo',
    modelViewersNow: '{viewers} espectadores agora',
    ifNoFeed: 'Se o feed não aparecer, desative adblock ou abra diretamente no',
    stripchat: 'live provider',
    searchPageTitle: 'Buscar cams',
    livePageTitle: 'Todas as cams ao vivo',
    homePageTitle: 'Diretório live cam'
  }
};

type I18nContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const detectLanguage = (): Lang => {
  const saved = localStorage.getItem('striphubs_lang');
  if (saved && SUPPORTED_LANGUAGES.includes(saved as Lang)) return saved as Lang;

  const browser = navigator.language.slice(0, 2).toLowerCase();
  if (SUPPORTED_LANGUAGES.includes(browser as Lang)) return browser as Lang;

  return 'en';
};

const interpolate = (text: string, vars?: Record<string, string | number>): string => {
  if (!vars) return text;
  return Object.entries(vars).reduce(
    (acc, [key, value]) => acc.replaceAll(`{${key}}`, String(value)),
    text
  );
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    setLangState(detectLanguage());
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem('striphubs_lang', lang);
  }, [lang]);

  const setLang = (next: Lang) => setLangState(next);

  const t = (key: string, vars?: Record<string, string | number>) => {
    const table = dict[lang] || dict.en;
    const fallback = dict.en[key] || key;
    return interpolate(table[key] || fallback, vars);
  };

  const value = useMemo(() => ({ lang, setLang, t }), [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within LanguageProvider');
  return ctx;
}
