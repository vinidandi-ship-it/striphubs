import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../i18n';
import { buildLocalizedPath } from '../i18n/routing';

interface Category {
  slug: string;
  name: string;
  count?: number;
}

interface SidebarProps {
  categories: Category[];
  countries: Category[];
}

export default function Sidebar({ categories, countries }: SidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { t, locale } = useI18n();

  return (
    <aside className="w-full flex-shrink-0 lg:w-64">
      <div className="space-y-4 lg:sticky lg:top-24 lg:space-y-6">
        <div className="bg-panel rounded-xl border border-border p-4">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            📂 {t('nav.categories')}
          </h3>
          <nav className="flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={buildLocalizedPath(`/cam/${category.slug}`, locale)}
                className={`flex min-w-fit items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors lg:min-w-0 ${
                  currentPath === `/cam/${category.slug}` || currentPath === `/${locale}/cam/${category.slug}`
                    ? 'bg-accent/20 text-accent'
                    : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-white'
                }`}
              >
                <span>{category.name}</span>
                {category.count !== undefined && (
                  <span className="text-xs text-zinc-500">{category.count}</span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="bg-panel rounded-xl border border-border p-4">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            🌍 {t('nav.countries')}
          </h3>
          <nav className="flex gap-2 overflow-x-auto pb-1 lg:max-h-64 lg:block lg:space-y-1 lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0">
            {countries.map((country) => (
              <Link
                key={country.slug}
                to={buildLocalizedPath(`/country/${country.slug}`, locale)}
                className={`flex min-w-fit items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors lg:min-w-0 ${
                  currentPath === `/country/${country.slug}` || currentPath === `/${locale}/country/${country.slug}`
                    ? 'bg-accent/20 text-accent'
                    : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-white'
                }`}
              >
                <span>{country.name}</span>
                {country.count !== undefined && (
                  <span className="text-xs text-zinc-500">{country.count}</span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="bg-panel rounded-xl border border-border p-4">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            🔗 {t('nav.quickLinks')}
          </h3>
          <nav className="flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
            <Link
              to={buildLocalizedPath('/live', locale)}
              className={`flex min-w-fit items-center rounded-lg px-3 py-2 text-sm transition-colors lg:min-w-0 ${
                currentPath === '/live' || currentPath === `/${locale}/live`
                  ? 'bg-accent/20 text-accent'
                  : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-white'
              }`}
            >
              📺 {t('nav.allLive')}
            </Link>
            <Link
              to={buildLocalizedPath('/', locale)}
              className={`flex min-w-fit items-center rounded-lg px-3 py-2 text-sm transition-colors lg:min-w-0 ${
                currentPath === '/' || currentPath === `/${locale}`
                  ? 'bg-accent/20 text-accent'
                  : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-white'
              }`}
            >
              🏠 {t('nav.home')}
            </Link>
          </nav>
        </div>
      </div>
    </aside>
  );
}
