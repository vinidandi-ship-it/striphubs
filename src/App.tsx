import { lazy, Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AgeVerification from './components/AgeVerification';
import Analytics from './components/Analytics';
import CookieConsent from './components/CookieConsent';
import ExitIntent from './components/ExitIntent';
import FloatingCTA from './components/FloatingCTA';
import Footer from './components/Footer';
import Header from './components/Header';
import HreflangTags from './components/HreflangTags';
import NativeAdSlot from './components/NativeAdSlot';
import PremiumBanner from './components/PremiumBanner';
import RevenueStack from './components/RevenueStack';
import SmartPopunder from './components/SmartPopunder';
import StickyMobileCTA from './components/StickyMobileCTA';
import { I18nProvider, useI18n } from './i18n';
import { extractLocaleFromPath } from './i18n/routing';
import { initRevenueStack } from './lib/revenue';
import { Model, SITE_NAME, SITE_URL } from './lib/models';
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

function AppContent() {
  const location = useLocation();
  const { language, setLanguage } = useI18n();
  const [lastViewedModel, setLastViewedModel] = useState<Model | null>(null);
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  useEffect(() => {
    const { locale: routeLocale } = extractLocaleFromPath(location.pathname);
    if (routeLocale !== language) {
      setLanguage(routeLocale);
    }
  }, [location.pathname, language, setLanguage]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowStickyCTA(true);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sh_last_model');
      if (stored) {
        setLastViewedModel(JSON.parse(stored));
      }
    } catch {
      // ignore
    }

    const handleModelView = (e: CustomEvent<Model>) => {
      setLastViewedModel(e.detail);
      localStorage.setItem('sh_last_model', JSON.stringify(e.detail));
    };

    window.addEventListener('modelView', handleModelView as EventListener);
    return () => window.removeEventListener('modelView', handleModelView as EventListener);
  }, []);

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
  
  useEffect(() => {
    const cleanup = initRevenueStack();
    return cleanup;
  }, []);

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
            <Route path="/blog" element={<Blog />} />
            <Route path="/en/blog" element={<Blog />} />
            <Route path="/de/blog" element={<Blog />} />
            <Route path="/fr/blog" element={<Blog />} />
            <Route path="/es/blog" element={<Blog />} />
            <Route path="/pt/blog" element={<Blog />} />
            <Route path="/blog/guida-cam-gratis" element={<GuidaCamGratis />} />
            <Route path="/en/blog/guida-cam-gratis" element={<GuidaCamGratis />} />
            <Route path="/de/blog/guida-cam-gratis" element={<GuidaCamGratis />} />
            <Route path="/fr/blog/guida-cam-gratis" element={<GuidaCamGratis />} />
            <Route path="/es/blog/guida-cam-gratis" element={<GuidaCamGratis />} />
            <Route path="/pt/blog/guida-cam-gratis" element={<GuidaCamGratis />} />
            <Route path="/blog/migliori-modelle-italiane" element={<MiglioriModelleItaliane />} />
            <Route path="/en/blog/migliori-modelle-italiane" element={<MiglioriModelleItaliane />} />
            <Route path="/de/blog/migliori-modelle-italiane" element={<MiglioriModelleItaliane />} />
            <Route path="/fr/blog/migliori-modelle-italiane" element={<MiglioriModelleItaliane />} />
            <Route path="/es/blog/migliori-modelle-italiane" element={<MiglioriModelleItaliane />} />
            <Route path="/pt/blog/migliori-modelle-italiane" element={<MiglioriModelleItaliane />} />
            <Route path="/blog/sicurezza-cam" element={<SicurezzaCam />} />
            <Route path="/en/blog/sicurezza-cam" element={<SicurezzaCam />} />
            <Route path="/de/blog/sicurezza-cam" element={<SicurezzaCam />} />
            <Route path="/fr/blog/sicurezza-cam" element={<SicurezzaCam />} />
            <Route path="/es/blog/sicurezza-cam" element={<SicurezzaCam />} />
            <Route path="/pt/blog/sicurezza-cam" element={<SicurezzaCam />} />
            <Route path="/blog/tag-popolari" element={<TagPopolari />} />
            <Route path="/en/blog/tag-popolari" element={<TagPopolari />} />
            <Route path="/de/blog/tag-popolari" element={<TagPopolari />} />
            <Route path="/fr/blog/tag-popolari" element={<TagPopolari />} />
            <Route path="/es/blog/tag-popolari" element={<TagPopolari />} />
            <Route path="/pt/blog/tag-popolari" element={<TagPopolari />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/en/blog/:slug" element={<BlogPost />} />
            <Route path="/de/blog/:slug" element={<BlogPost />} />
            <Route path="/fr/blog/:slug" element={<BlogPost />} />
            <Route path="/es/blog/:slug" element={<BlogPost />} />
            <Route path="/pt/blog/:slug" element={<BlogPost />} />
            <Route path="/alternative/:name" element={<Alternative />} />
            <Route path="/en/alternative/:name" element={<Alternative />} />
            <Route path="/de/alternative/:name" element={<Alternative />} />
            <Route path="/fr/alternative/:name" element={<Alternative />} />
            <Route path="/es/alternative/:name" element={<Alternative />} />
            <Route path="/pt/alternative/:name" element={<Alternative />} />
            <Route path="/best/:timeframe/:category" element={<BestOf />} />
            <Route path="/en/best/:timeframe/:category" element={<BestOf />} />
            <Route path="/de/best/:timeframe/:category" element={<BestOf />} />
            <Route path="/fr/best/:timeframe/:category" element={<BestOf />} />
            <Route path="/es/best/:timeframe/:category" element={<BestOf />} />
            <Route path="/pt/best/:timeframe/:category" element={<BestOf />} />
            <Route path="/vs/:comparison" element={<Comparison />} />
            <Route path="/en/vs/:comparison" element={<Comparison />} />
            <Route path="/de/vs/:comparison" element={<Comparison />} />
            <Route path="/fr/vs/:comparison" element={<Comparison />} />
            <Route path="/es/vs/:comparison" element={<Comparison />} />
            <Route path="/pt/vs/:comparison" element={<Comparison />} />
            <Route path="/country/:countrySlug/cam/:category" element={<CountryCombination />} />
            <Route path="/en/country/:countrySlug/cam/:category" element={<CountryCombination />} />
            <Route path="/de/country/:countrySlug/cam/:category" element={<CountryCombination />} />
            <Route path="/fr/country/:countrySlug/cam/:category" element={<CountryCombination />} />
            <Route path="/es/country/:countrySlug/cam/:category" element={<CountryCombination />} />
            <Route path="/pt/country/:countrySlug/cam/:category" element={<CountryCombination />} />
            <Route path="/country/:countrySlug/tag/:tag" element={<CountryCombination />} />
            <Route path="/en/country/:countrySlug/tag/:tag" element={<CountryCombination />} />
            <Route path="/de/country/:countrySlug/tag/:tag" element={<CountryCombination />} />
            <Route path="/fr/country/:countrySlug/tag/:tag" element={<CountryCombination />} />
            <Route path="/es/country/:countrySlug/tag/:tag" element={<CountryCombination />} />
            <Route path="/pt/country/:countrySlug/tag/:tag" element={<CountryCombination />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <StickyMobileCTA model={lastViewedModel} visible={showStickyCTA} />
      <FloatingCTA model={lastViewedModel} />
      <ExitIntent topModel={lastViewedModel} />
      <SmartPopunder />
      <PremiumBanner />
      <HreflangTags />
      <Analytics />
      <AgeVerification />
      <CookieConsent />
      <RevenueStack />
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
