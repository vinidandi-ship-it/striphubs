import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useI18n } from '../i18n';
import { LanguageSwitcher } from '../i18n/LanguageSwitcher';
import { buildLocalizedPath } from '../i18n/routing';
import SearchBar from './SearchBar';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, language } = useI18n();

  const mainItems = [
    { to: '/', label: t('nav.home'), icon: '🏠' },
    { to: '/live', label: 'Live', icon: '🔴' },
    { to: '/cam/milf', label: 'MILF', icon: '💋' },
    { to: '/cam/teen', label: 'Teen', icon: '👧' },
    { to: '/cam/asian', label: 'Asian', icon: '🌏' }
  ];

  const countryItems = [
    { to: '/country/italian', label: t('countries.italian'), flag: '🇮🇹' },
    { to: '/country/american', label: t('countries.american'), flag: '🇺🇸' },
    { to: '/country/british', label: t('countries.british'), flag: '🇬🇧' },
    { to: '/country/german', label: t('countries.german'), flag: '🇩🇪' },
    { to: '/country/spanish', label: t('countries.spanish'), flag: '🇪🇸' }
  ];

  const getLocalizedTo = (to: string) => buildLocalizedPath(to, language);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/95 backdrop-blur-xl shadow-lg">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link to={getLocalizedTo('/')} className="flex min-w-0 items-center gap-2 text-lg font-extrabold text-white transition-transform hover:scale-105 sm:text-xl">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-pink-500 flex items-center justify-center shadow-lg">
            <span className="text-white text-sm font-bold">SH</span>
          </div>
          <span className="truncate">Strip<span className="text-accent">Hubs</span></span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {mainItems.map((item) => (
            <NavLink
              key={item.to}
              to={getLocalizedTo(item.to)}
              className={({ isActive }) =>
                `shrink-0 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-accent/20 text-accent border border-accent/30' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`
              }
            >
              <span className="mr-1">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
          
          <div className="relative group">
            <button className="shrink-0 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all flex items-center gap-1">
              🌍 {t('nav.countries')}
              <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute top-full left-0 mt-1 w-48 bg-panel border border-border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              {countryItems.map((item) => (
                <Link
                  key={item.to}
                  to={getLocalizedTo(item.to)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/50 first:rounded-t-xl last:rounded-b-xl"
                >
                  <span>{item.flag}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block w-64">
            <SearchBar compact />
          </div>
          
          <LanguageSwitcher compact />
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-bg/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            <div className="sm:hidden mb-3">
              <SearchBar compact />
            </div>
            
            {mainItems.map((item) => (
              <NavLink
                key={item.to}
                to={getLocalizedTo(item.to)}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-accent/20 text-accent border border-accent/30' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                  }`
                }
              >
                <span>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
            
            <div className="pt-2 border-t border-border">
              <p className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">{t('nav.countries')}</p>
              {countryItems.map((item) => (
                <Link
                  key={item.to}
                  to={getLocalizedTo(item.to)}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-xl transition-colors"
                >
                  <span>{item.flag}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
