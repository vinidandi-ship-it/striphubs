import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AgeVerification from './components/AgeVerification';
import Analytics from './components/Analytics';
import CookieConsent from './components/CookieConsent';
import Footer from './components/Footer';
import Header from './components/Header';
import HreflangTags from './components/HreflangTags';
import PageLayout from './components/PageLayout';
import SmartPopunder from './components/SmartPopunder';
import { I18nProvider, useI18n } from './i18n';
import { extractLocaleFromPath } from './i18n/routing';
import { SITE_NAME, SITE_URL } from './lib/models';
import { upsertJsonLd } from './lib/seo';

const Home = lazy(() => import('./pages/Home'));
const Live = lazy(() => import('./pages/Live'));
const FreeCams = lazy(() => import('./pages/FreeCams'));
const Category = lazy(() => import('./pages/Category'));
const Country = lazy(() => import('./pages/Country'));
const CountryCombination = lazy(() => import('./pages/CountryCombination'));
const Tag = lazy(() => import('./pages/Tag'));
const ModelPage = lazy(() => import('./pages/Model'));
const Search = lazy(() => import('./pages/Search'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Cookies = lazy(() => import('./pages/Cookies'));
const Combination = lazy(() => import('./pages/Combination'));
const Alternative = lazy(() => import('./pages/Alternative'));
const BestOf = lazy(() => import('./pages/BestOf'));
const Comparison = lazy(() => import('./pages/Comparison'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const GuidaCamGratis = lazy(() => import('./pages/blog/GuidaCamGratis'));
const MiglioriModelleItaliane = lazy(() => import('./pages/blog/MiglioriModelleItaliane'));
const SicurezzaCam = lazy(() => import('./pages/blog/SicurezzaCam'));
const TagPopolari = lazy(() => import('./pages/blog/TagPopolari'));
const PremiumCheckout = lazy(() => import('./pages/premium/Checkout'));
const PremiumSuccess = lazy(() => import('./pages/premium/Success'));
const Videos = lazy(() => import('./pages/Videos'));
const VideoPage = lazy(() => import('./pages/VideoPage'));

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <PageLayout>
      {children}
    </PageLayout>
  );
}

function AppContent() {
  const location = useLocation();
  const { language, setLanguage } = useI18n();

  useEffect(() => {
    const { locale: routeLocale } = extractLocaleFromPath(location.pathname);
    if (routeLocale !== language) {
      setLanguage(routeLocale);
    }
  }, [location.pathname, language, setLanguage]);

  useEffect(() => {
    upsertJsonLd('website-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: language,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    });
    upsertJsonLd('organization-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/icon-512.png`,
      sameAs: [],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: ['Italian', 'English', 'German', 'French', 'Spanish', 'Portuguese']
      }
    });
  }, [language]);
  
  return (
    <div className="min-h-screen bg-bg text-zinc-100">
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="rounded-2xl border border-border bg-panel p-6">Loading...</div>}>
          <Routes>
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/en" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/de" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/fr" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/es" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/pt" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/live" element={<PageWrapper><Live /></PageWrapper>} />
            <Route path="/en/live" element={<PageWrapper><Live /></PageWrapper>} />
            <Route path="/de/live" element={<PageWrapper><Live /></PageWrapper>} />
            <Route path="/fr/live" element={<PageWrapper><Live /></PageWrapper>} />
            <Route path="/es/live" element={<PageWrapper><Live /></PageWrapper>} />
            <Route path="/pt/live" element={<PageWrapper><Live /></PageWrapper>} />
            <Route path="/free-cams" element={<PageWrapper><FreeCams /></PageWrapper>} />
            <Route path="/en/free-cams" element={<PageWrapper><FreeCams /></PageWrapper>} />
            <Route path="/de/free-cams" element={<PageWrapper><FreeCams /></PageWrapper>} />
            <Route path="/fr/free-cams" element={<PageWrapper><FreeCams /></PageWrapper>} />
            <Route path="/es/free-cams" element={<PageWrapper><FreeCams /></PageWrapper>} />
            <Route path="/pt/free-cams" element={<PageWrapper><FreeCams /></PageWrapper>} />
            <Route path="/country/:countrySlug" element={<PageWrapper><Country /></PageWrapper>} />
            <Route path="/en/country/:countrySlug" element={<PageWrapper><Country /></PageWrapper>} />
            <Route path="/de/country/:countrySlug" element={<PageWrapper><Country /></PageWrapper>} />
            <Route path="/fr/country/:countrySlug" element={<PageWrapper><Country /></PageWrapper>} />
            <Route path="/es/country/:countrySlug" element={<PageWrapper><Country /></PageWrapper>} />
            <Route path="/pt/country/:countrySlug" element={<PageWrapper><Country /></PageWrapper>} />
            <Route path="/cam/:category/:tag" element={<PageWrapper><Combination /></PageWrapper>} />
            <Route path="/en/cam/:category/:tag" element={<PageWrapper><Combination /></PageWrapper>} />
            <Route path="/de/cam/:category/:tag" element={<PageWrapper><Combination /></PageWrapper>} />
            <Route path="/fr/cam/:category/:tag" element={<PageWrapper><Combination /></PageWrapper>} />
            <Route path="/es/cam/:category/:tag" element={<PageWrapper><Combination /></PageWrapper>} />
            <Route path="/pt/cam/:category/:tag" element={<PageWrapper><Combination /></PageWrapper>} />
            <Route path="/cam/:category" element={<PageWrapper><Category /></PageWrapper>} />
            <Route path="/en/cam/:category" element={<PageWrapper><Category /></PageWrapper>} />
            <Route path="/de/cam/:category" element={<PageWrapper><Category /></PageWrapper>} />
            <Route path="/fr/cam/:category" element={<PageWrapper><Category /></PageWrapper>} />
            <Route path="/es/cam/:category" element={<PageWrapper><Category /></PageWrapper>} />
            <Route path="/pt/cam/:category" element={<PageWrapper><Category /></PageWrapper>} />
            <Route path="/tag/:tag" element={<PageWrapper><Tag /></PageWrapper>} />
            <Route path="/en/tag/:tag" element={<PageWrapper><Tag /></PageWrapper>} />
            <Route path="/de/tag/:tag" element={<PageWrapper><Tag /></PageWrapper>} />
            <Route path="/fr/tag/:tag" element={<PageWrapper><Tag /></PageWrapper>} />
            <Route path="/es/tag/:tag" element={<PageWrapper><Tag /></PageWrapper>} />
            <Route path="/pt/tag/:tag" element={<PageWrapper><Tag /></PageWrapper>} />
            <Route path="/model/:username" element={<PageWrapper><ModelPage /></PageWrapper>} />
            <Route path="/en/model/:username" element={<PageWrapper><ModelPage /></PageWrapper>} />
            <Route path="/de/model/:username" element={<PageWrapper><ModelPage /></PageWrapper>} />
            <Route path="/fr/model/:username" element={<PageWrapper><ModelPage /></PageWrapper>} />
            <Route path="/es/model/:username" element={<PageWrapper><ModelPage /></PageWrapper>} />
            <Route path="/pt/model/:username" element={<PageWrapper><ModelPage /></PageWrapper>} />
            <Route path="/search" element={<PageWrapper><Search /></PageWrapper>} />
            <Route path="/en/search" element={<PageWrapper><Search /></PageWrapper>} />
            <Route path="/de/search" element={<PageWrapper><Search /></PageWrapper>} />
            <Route path="/fr/search" element={<PageWrapper><Search /></PageWrapper>} />
            <Route path="/es/search" element={<PageWrapper><Search /></PageWrapper>} />
            <Route path="/pt/search" element={<PageWrapper><Search /></PageWrapper>} />
            <Route path="/privacy" element={<PageWrapper><Privacy /></PageWrapper>} />
            <Route path="/en/privacy" element={<PageWrapper><Privacy /></PageWrapper>} />
            <Route path="/de/privacy" element={<PageWrapper><Privacy /></PageWrapper>} />
            <Route path="/fr/privacy" element={<PageWrapper><Privacy /></PageWrapper>} />
            <Route path="/es/privacy" element={<PageWrapper><Privacy /></PageWrapper>} />
            <Route path="/pt/privacy" element={<PageWrapper><Privacy /></PageWrapper>} />
            <Route path="/terms" element={<PageWrapper><Terms /></PageWrapper>} />
            <Route path="/en/terms" element={<PageWrapper><Terms /></PageWrapper>} />
            <Route path="/de/terms" element={<PageWrapper><Terms /></PageWrapper>} />
            <Route path="/fr/terms" element={<PageWrapper><Terms /></PageWrapper>} />
            <Route path="/es/terms" element={<PageWrapper><Terms /></PageWrapper>} />
            <Route path="/pt/terms" element={<PageWrapper><Terms /></PageWrapper>} />
            <Route path="/cookies" element={<PageWrapper><Cookies /></PageWrapper>} />
            <Route path="/en/cookies" element={<PageWrapper><Cookies /></PageWrapper>} />
            <Route path="/de/cookies" element={<PageWrapper><Cookies /></PageWrapper>} />
            <Route path="/fr/cookies" element={<PageWrapper><Cookies /></PageWrapper>} />
            <Route path="/es/cookies" element={<PageWrapper><Cookies /></PageWrapper>} />
            <Route path="/pt/cookies" element={<PageWrapper><Cookies /></PageWrapper>} />
            <Route path="/blog" element={<PageWrapper><Blog /></PageWrapper>} />
            <Route path="/en/blog" element={<PageWrapper><Blog /></PageWrapper>} />
            <Route path="/de/blog" element={<PageWrapper><Blog /></PageWrapper>} />
            <Route path="/fr/blog" element={<PageWrapper><Blog /></PageWrapper>} />
            <Route path="/es/blog" element={<PageWrapper><Blog /></PageWrapper>} />
            <Route path="/pt/blog" element={<PageWrapper><Blog /></PageWrapper>} />
            <Route path="/blog/guida-cam-gratis" element={<PageWrapper><GuidaCamGratis /></PageWrapper>} />
            <Route path="/en/blog/guida-cam-gratis" element={<PageWrapper><GuidaCamGratis /></PageWrapper>} />
            <Route path="/de/blog/guida-cam-gratis" element={<PageWrapper><GuidaCamGratis /></PageWrapper>} />
            <Route path="/fr/blog/guida-cam-gratis" element={<PageWrapper><GuidaCamGratis /></PageWrapper>} />
            <Route path="/es/blog/guida-cam-gratis" element={<PageWrapper><GuidaCamGratis /></PageWrapper>} />
            <Route path="/pt/blog/guida-cam-gratis" element={<PageWrapper><GuidaCamGratis /></PageWrapper>} />
            <Route path="/blog/migliori-modelle-italiane" element={<PageWrapper><MiglioriModelleItaliane /></PageWrapper>} />
            <Route path="/en/blog/migliori-modelle-italiane" element={<PageWrapper><MiglioriModelleItaliane /></PageWrapper>} />
            <Route path="/de/blog/migliori-modelle-italiane" element={<PageWrapper><MiglioriModelleItaliane /></PageWrapper>} />
            <Route path="/fr/blog/migliori-modelle-italiane" element={<PageWrapper><MiglioriModelleItaliane /></PageWrapper>} />
            <Route path="/es/blog/migliori-modelle-italiane" element={<PageWrapper><MiglioriModelleItaliane /></PageWrapper>} />
            <Route path="/pt/blog/migliori-modelle-italiane" element={<PageWrapper><MiglioriModelleItaliane /></PageWrapper>} />
            <Route path="/blog/sicurezza-cam" element={<PageWrapper><SicurezzaCam /></PageWrapper>} />
            <Route path="/en/blog/sicurezza-cam" element={<PageWrapper><SicurezzaCam /></PageWrapper>} />
            <Route path="/de/blog/sicurezza-cam" element={<PageWrapper><SicurezzaCam /></PageWrapper>} />
            <Route path="/fr/blog/sicurezza-cam" element={<PageWrapper><SicurezzaCam /></PageWrapper>} />
            <Route path="/es/blog/sicurezza-cam" element={<PageWrapper><SicurezzaCam /></PageWrapper>} />
            <Route path="/pt/blog/sicurezza-cam" element={<PageWrapper><SicurezzaCam /></PageWrapper>} />
            <Route path="/blog/tag-popolari" element={<PageWrapper><TagPopolari /></PageWrapper>} />
            <Route path="/en/blog/tag-popolari" element={<PageWrapper><TagPopolari /></PageWrapper>} />
            <Route path="/de/blog/tag-popolari" element={<PageWrapper><TagPopolari /></PageWrapper>} />
            <Route path="/fr/blog/tag-popolari" element={<PageWrapper><TagPopolari /></PageWrapper>} />
            <Route path="/es/blog/tag-popolari" element={<PageWrapper><TagPopolari /></PageWrapper>} />
            <Route path="/pt/blog/tag-popolari" element={<PageWrapper><TagPopolari /></PageWrapper>} />
            <Route path="/blog/:slug" element={<PageWrapper><BlogPost /></PageWrapper>} />
            <Route path="/en/blog/:slug" element={<PageWrapper><BlogPost /></PageWrapper>} />
            <Route path="/de/blog/:slug" element={<PageWrapper><BlogPost /></PageWrapper>} />
            <Route path="/fr/blog/:slug" element={<PageWrapper><BlogPost /></PageWrapper>} />
            <Route path="/es/blog/:slug" element={<PageWrapper><BlogPost /></PageWrapper>} />
            <Route path="/pt/blog/:slug" element={<PageWrapper><BlogPost /></PageWrapper>} />
            <Route path="/alternative/:name" element={<PageWrapper><Alternative /></PageWrapper>} />
            <Route path="/en/alternative/:name" element={<PageWrapper><Alternative /></PageWrapper>} />
            <Route path="/de/alternative/:name" element={<PageWrapper><Alternative /></PageWrapper>} />
            <Route path="/fr/alternative/:name" element={<PageWrapper><Alternative /></PageWrapper>} />
            <Route path="/es/alternative/:name" element={<PageWrapper><Alternative /></PageWrapper>} />
            <Route path="/pt/alternative/:name" element={<PageWrapper><Alternative /></PageWrapper>} />
            <Route path="/best/:timeframe/:category" element={<PageWrapper><BestOf /></PageWrapper>} />
            <Route path="/en/best/:timeframe/:category" element={<PageWrapper><BestOf /></PageWrapper>} />
            <Route path="/de/best/:timeframe/:category" element={<PageWrapper><BestOf /></PageWrapper>} />
            <Route path="/fr/best/:timeframe/:category" element={<PageWrapper><BestOf /></PageWrapper>} />
            <Route path="/es/best/:timeframe/:category" element={<PageWrapper><BestOf /></PageWrapper>} />
            <Route path="/pt/best/:timeframe/:category" element={<PageWrapper><BestOf /></PageWrapper>} />
            <Route path="/vs/:comparison" element={<PageWrapper><Comparison /></PageWrapper>} />
            <Route path="/en/vs/:comparison" element={<PageWrapper><Comparison /></PageWrapper>} />
            <Route path="/de/vs/:comparison" element={<PageWrapper><Comparison /></PageWrapper>} />
            <Route path="/fr/vs/:comparison" element={<PageWrapper><Comparison /></PageWrapper>} />
            <Route path="/es/vs/:comparison" element={<PageWrapper><Comparison /></PageWrapper>} />
            <Route path="/pt/vs/:comparison" element={<PageWrapper><Comparison /></PageWrapper>} />
            <Route path="/country/:countrySlug/cam/:category" element={<PageWrapper><CountryCombination /></PageWrapper>} />
            <Route path="/en/country/:countrySlug/cam/:category" element={<PageWrapper><CountryCombination /></PageWrapper>} />
            <Route path="/de/country/:countrySlug/cam/:category" element={<PageWrapper><CountryCombination /></PageWrapper>} />
            <Route path="/fr/country/:countrySlug/cam/:category" element={<PageWrapper><CountryCombination /></PageWrapper>} />
            <Route path="/es/country/:countrySlug/cam/:category" element={<PageWrapper><CountryCombination /></PageWrapper>} />
            <Route path="/pt/country/:countrySlug/cam/:category" element={<PageWrapper><CountryCombination /></PageWrapper>} />
            <Route path="/country/:countrySlug/tag/:tag" element={<PageWrapper><CountryCombination /></PageWrapper>} />
            <Route path="/en/country/:countrySlug/tag/:tag" element={<PageWrapper><CountryCombination /></PageWrapper>} />
            <Route path="/de/country/:countrySlug/tag/:tag" element={<PageWrapper><CountryCombination /></PageWrapper>} />
            <Route path="/fr/country/:countrySlug/tag/:tag" element={<PageWrapper><CountryCombination /></PageWrapper>} />
            <Route path="/es/country/:countrySlug/tag/:tag" element={<PageWrapper><CountryCombination /></PageWrapper>} />
            <Route path="/pt/country/:countrySlug/tag/:tag" element={<PageWrapper><CountryCombination /></PageWrapper>} />
            <Route path="/premium/checkout" element={<PageWrapper><PremiumCheckout /></PageWrapper>} />
            <Route path="/premium/success" element={<PageWrapper><PremiumSuccess /></PageWrapper>} />
            <Route path="/videos" element={<PageWrapper><Videos /></PageWrapper>} />
            <Route path="/en/videos" element={<PageWrapper><Videos /></PageWrapper>} />
            <Route path="/de/videos" element={<PageWrapper><Videos /></PageWrapper>} />
            <Route path="/fr/videos" element={<PageWrapper><Videos /></PageWrapper>} />
            <Route path="/es/videos" element={<PageWrapper><Videos /></PageWrapper>} />
            <Route path="/pt/videos" element={<PageWrapper><Videos /></PageWrapper>} />
            <Route path="/video/:id" element={<PageWrapper><VideoPage /></PageWrapper>} />
            <Route path="/en/video/:id" element={<PageWrapper><VideoPage /></PageWrapper>} />
            <Route path="/de/video/:id" element={<PageWrapper><VideoPage /></PageWrapper>} />
            <Route path="/fr/video/:id" element={<PageWrapper><VideoPage /></PageWrapper>} />
            <Route path="/es/video/:id" element={<PageWrapper><VideoPage /></PageWrapper>} />
            <Route path="/pt/video/:id" element={<PageWrapper><VideoPage /></PageWrapper>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <HreflangTags />
      <Analytics />
      <SmartPopunder />
      <AgeVerification />
      <CookieConsent />
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}
