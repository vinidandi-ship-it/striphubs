import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useI18n } from '../i18n';
import { LanguageSwitcher } from '../i18n/LanguageSwitcher';
import { buildLocalizedPath } from '../i18n/routing';
import SearchBar from './SearchBar';
import Icon from './Icon';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, language } = useI18n();

  const mainItems = [
    { to: '/', label: t('nav.home'), icon: 'home' as const },
    { to: '/live', label: 'Live', icon: 'live' as const },
    { to: '/free-cams', label: 'Free Cams', icon: 'camera' as const },
    { to: '/cam/milf', label: 'MILF', icon: 'heart' as const },
    { to: '/cam/teen', label: 'Teen', icon: 'user' as const },
    { to: '/cam/asian', label: 'Asian', icon: 'search' as const }
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
    <header className="sticky top-0 z-40 border-b border-border-color bg-bg-primary/95 backdrop-blur-xl shadow-lg">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link to={getLocalizedTo('/')} className="flex min-w-0 items-center gap-2 text-base font-extrabold text-white transition-transform hover:scale-105 sm:text-lg">
          <div className="w-6 h-6 rounded-md sh-gradient-primary flex items-center justify-center shadow-sm shrink-0">
            <span className="text-white text-[8px] font-bold leading-none">SH</span>
          </div>
          <span className="hidden sm:inline truncate">Strip<span className="text-accent-primary">Hubs</span></span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {mainItems.map((item) => (
            <NavLink
              key={item.to}
              to={getLocalizedTo(item.to)}
              className={({ isActive }) =>
                `shrink-0 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-all flex items-center gap-2 ${
                  isActive 
                    ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30' 
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                }`
              }
            >
              <Icon name={item.icon} size={16} />
              {item.label}
            </NavLink>
          ))}
          
          <div className="relative group">
            <button className="shrink-0 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-all flex items-center gap-1">
              <Icon name="search" size={16} />
              {t('nav.countries')}
              <Icon name="arrowDown" size={14} className="transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-0 mt-1 w-48 bg-bg-card border border-border-color rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              {countryItems.map((item) => (
                <Link
                  key={item.to}
                  to={getLocalizedTo(item.to)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover first:rounded-t-xl last:rounded-b-xl"
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
            className="lg:hidden p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <Icon name="close" size={24} />
            ) : (
              <Icon name="menu" size={24} />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border-color bg-bg-primary/95 backdrop-blur-xl">
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
                      ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                  }`
                }
              >
                <Icon name={item.icon} size={18} />
                {item.label}
              </NavLink>
            ))}
            
            <div className="pt-2 border-t border-border-color">
              <p className="px-4 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">{t('nav.countries')}</p>
              {countryItems.map((item) => (
                <Link
                  key={item.to}
                  to={getLocalizedTo(item.to)}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded-xl transition-colors"
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
