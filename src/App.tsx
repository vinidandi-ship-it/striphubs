import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AgeVerification from './components/AgeVerification';
import Analytics from './components/Analytics';
import CookieConsent from './components/CookieConsent';
import Footer from './components/Footer';
import Header from './components/Header';
import { SITE_NAME, SITE_URL } from './lib/models';
import { upsertJsonLd } from './lib/seo';

const Home = lazy(() => import('./pages/Home'));
const Live = lazy(() => import('./pages/Live'));
const Category = lazy(() => import('./pages/Category'));
const Tag = lazy(() => import('./pages/Tag'));
const ModelPage = lazy(() => import('./pages/Model'));
const Search = lazy(() => import('./pages/Search'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Cookies = lazy(() => import('./pages/Cookies'));
const Combination = lazy(() => import('./pages/Combination'));

export default function App() {
  useEffect(() => {
    upsertJsonLd('website-jsonld', {
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
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="rounded-2xl border border-border bg-panel p-6">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/live" element={<Live />} />
            <Route path="/cam/:category/:tag" element={<Combination />} />
            <Route path="/cam/:category" element={<Category />} />
            <Route path="/tag/:tag" element={<Tag />} />
            <Route path="/model/:username" element={<ModelPage />} />
            <Route path="/search" element={<Search />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <Analytics />
      <AgeVerification />
      <CookieConsent />
    </div>
  );
}
