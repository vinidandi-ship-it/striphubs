import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AgeVerification from './components/AgeVerification';
import Analytics from './components/Analytics';
import CookieConsent from './components/CookieConsent';
import Footer from './components/Footer';
import Header from './components/Header';
import HreflangTags from './components/HreflangTags';
import { I18nProvider, useI18n } from './i18n';
import { extractLocaleFromPath } from './i18n/routing';
import { SITE_NAME, SITE_URL } from './lib/models';
import { upsertJsonLd } from './lib/seo';

const Home = lazy(() => import('./pages/Home'));
const Live = lazy(() => import('./pages/Live'));
const FreeCams = lazy(() => import('./pages/FreeCams'));
const Category = lazy(() => import('./pages/Category'));
const Country = lazy(() => import('./pages/Country'));
const Tag = lazy(() => import('./pages/Tag'));
const ModelPage = lazy(() => import('./pages/Model'));
const Search = lazy(() => import('./pages/Search'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Cookies = lazy(() => import('./pages/Cookies'));
const Combination = lazy(() => import('./pages/Combination'));

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
  }, [language]);

  return (
    <div className="min-h-screen bg-bg text-zinc-100">
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="rounded-2xl border border-border bg-panel p-6">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/en" element={<Home />} />
            <Route path="/de" element={<Home />} />
            <Route path="/fr" element={<Home />} />
            <Route path="/es" element={<Home />} />
            <Route path="/pt" element={<Home />} />
            <Route path="/live" element={<Live />} />
            <Route path="/en/live" element={<Live />} />
            <Route path="/de/live" element={<Live />} />
            <Route path="/fr/live" element={<Live />} />
            <Route path="/es/live" element={<Live />} />
            <Route path="/pt/live" element={<Live />} />
            <Route path="/free-cams" element={<FreeCams />} />
            <Route path="/en/free-cams" element={<FreeCams />} />
            <Route path="/de/free-cams" element={<FreeCams />} />
            <Route path="/fr/free-cams" element={<FreeCams />} />
            <Route path="/es/free-cams" element={<FreeCams />} />
            <Route path="/pt/free-cams" element={<FreeCams />} />
            <Route path="/country/:countrySlug" element={<Country />} />
            <Route path="/en/country/:countrySlug" element={<Country />} />
            <Route path="/de/country/:countrySlug" element={<Country />} />
            <Route path="/fr/country/:countrySlug" element={<Country />} />
            <Route path="/es/country/:countrySlug" element={<Country />} />
            <Route path="/pt/country/:countrySlug" element={<Country />} />
            <Route path="/cam/:category/:tag" element={<Combination />} />
            <Route path="/en/cam/:category/:tag" element={<Combination />} />
            <Route path="/de/cam/:category/:tag" element={<Combination />} />
            <Route path="/fr/cam/:category/:tag" element={<Combination />} />
            <Route path="/es/cam/:category/:tag" element={<Combination />} />
            <Route path="/pt/cam/:category/:tag" element={<Combination />} />
            <Route path="/cam/:category" element={<Category />} />
            <Route path="/en/cam/:category" element={<Category />} />
            <Route path="/de/cam/:category" element={<Category />} />
            <Route path="/fr/cam/:category" element={<Category />} />
            <Route path="/es/cam/:category" element={<Category />} />
            <Route path="/pt/cam/:category" element={<Category />} />
            <Route path="/tag/:tag" element={<Tag />} />
            <Route path="/en/tag/:tag" element={<Tag />} />
            <Route path="/de/tag/:tag" element={<Tag />} />
            <Route path="/fr/tag/:tag" element={<Tag />} />
            <Route path="/es/tag/:tag" element={<Tag />} />
            <Route path="/pt/tag/:tag" element={<Tag />} />
            <Route path="/model/:username" element={<ModelPage />} />
            <Route path="/en/model/:username" element={<ModelPage />} />
            <Route path="/de/model/:username" element={<ModelPage />} />
            <Route path="/fr/model/:username" element={<ModelPage />} />
            <Route path="/es/model/:username" element={<ModelPage />} />
            <Route path="/pt/model/:username" element={<ModelPage />} />
            <Route path="/search" element={<Search />} />
            <Route path="/en/search" element={<Search />} />
            <Route path="/de/search" element={<Search />} />
            <Route path="/fr/search" element={<Search />} />
            <Route path="/es/search" element={<Search />} />
            <Route path="/pt/search" element={<Search />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/en/privacy" element={<Privacy />} />
            <Route path="/de/privacy" element={<Privacy />} />
            <Route path="/fr/privacy" element={<Privacy />} />
            <Route path="/es/privacy" element={<Privacy />} />
            <Route path="/pt/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/en/terms" element={<Terms />} />
            <Route path="/de/terms" element={<Terms />} />
            <Route path="/fr/terms" element={<Terms />} />
            <Route path="/es/terms" element={<Terms />} />
            <Route path="/pt/terms" element={<Terms />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/en/cookies" element={<Cookies />} />
            <Route path="/de/cookies" element={<Cookies />} />
            <Route path="/fr/cookies" element={<Cookies />} />
            <Route path="/es/cookies" element={<Cookies />} />
            <Route path="/pt/cookies" element={<Cookies />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <HreflangTags />
      <Analytics />
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
