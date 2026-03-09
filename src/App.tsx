import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AgeVerification from './components/AgeVerification';
import CookieConsent from './components/CookieConsent';
import { SITE_NAME, SITE_URL } from './lib/constants';
import { injectJsonLd } from './lib/seo';

const HomePage = lazy(() => import('./pages/HomePage'));
const LivePage = lazy(() => import('./pages/LivePage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const TagPage = lazy(() => import('./pages/TagPage'));
const ModelPage = lazy(() => import('./pages/ModelPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const CookiesPage = lazy(() => import('./pages/CookiesPage'));

export default function App() {
  useEffect(() => {
    injectJsonLd('website-schema', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-bg text-zinc-100">
      <Header />
      <main className="mx-auto min-h-[65vh] w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="rounded-xl border border-border bg-panel p-6">Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/live" element={<LivePage />} />
            <Route path="/cam/:category" element={<CategoryPage />} />
            <Route path="/tag/:tag" element={<TagPage />} />
            <Route path="/model/:name" element={<ModelPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/cookies" element={<CookiesPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <AgeVerification />
      <CookieConsent />
    </div>
  );
}
