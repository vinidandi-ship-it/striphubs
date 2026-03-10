import { Link, useLocation } from 'react-router-dom';

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

  return (
    <aside className="w-full flex-shrink-0 lg:w-64">
      <div className="space-y-4 lg:sticky lg:top-24 lg:space-y-6">
        {/* Categories Section */}
        <div className="bg-panel rounded-xl border border-border p-4">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            📂 Categorie
          </h3>
          <nav className="flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/cam/${category.slug}`}
                className={`flex min-w-fit items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors lg:min-w-0 ${
                  currentPath === `/cam/${category.slug}`
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

        {/* Countries Section */}
        <div className="bg-panel rounded-xl border border-border p-4">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            🌍 Paesi
          </h3>
          <nav className="flex gap-2 overflow-x-auto pb-1 lg:max-h-64 lg:block lg:space-y-1 lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0">
            {countries.map((country) => (
              <Link
                key={country.slug}
                to={`/country/${country.slug}`}
                className={`flex min-w-fit items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors lg:min-w-0 ${
                  currentPath === `/country/${country.slug}`
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

        {/* Quick Links */}
        <div className="bg-panel rounded-xl border border-border p-4">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            🔗 Rapido
          </h3>
          <nav className="flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
            <Link
              to="/live"
              className={`flex min-w-fit items-center rounded-lg px-3 py-2 text-sm transition-colors lg:min-w-0 ${
                currentPath === '/live'
                  ? 'bg-accent/20 text-accent'
                  : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-white'
              }`}
            >
              📺 Tutte le Live
            </Link>
            <Link
              to="/"
              className={`flex min-w-fit items-center rounded-lg px-3 py-2 text-sm transition-colors lg:min-w-0 ${
                currentPath === '/'
                  ? 'bg-accent/20 text-accent'
                  : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-white'
              }`}
            >
              🏠 Home
            </Link>
          </nav>
        </div>
      </div>
    </aside>
  );
}
