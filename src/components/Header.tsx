import { Link, NavLink } from 'react-router-dom';
import SearchBar from './SearchBar';
import LanguageSwitcher from './LanguageSwitcher';
import { useI18n } from '../lib/i18n';

export default function Header() {
  const { t } = useI18n();

  const navItems = [
    { label: t('navHome'), to: '/' },
    { label: t('navLive'), to: '/live' },
    { label: t('navCategories'), to: '/cam/milf' },
    { label: t('navTags'), to: '/tag/featured' }
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-bg/88 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-2xl font-extrabold tracking-tight text-white">
          Strip<span className="text-accent">Hubs</span>
        </Link>

        <nav className="order-3 flex w-full items-center gap-2 text-sm text-zinc-300 md:order-2 md:w-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 transition ${
                  isActive
                    ? 'bg-accent text-white shadow-[0_0_20px_rgba(255,45,117,.35)]'
                    : 'border border-transparent bg-zinc-900/70 hover:border-border'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="order-2 flex items-center gap-3 md:order-3">
          <LanguageSwitcher />
          <div className="hidden lg:block">
            <SearchBar compact />
          </div>
        </div>

        <div className="order-4 w-full lg:hidden">
          <SearchBar compact />
        </div>
      </div>
    </header>
  );
}
