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
    <aside className="w-64 flex-shrink-0">
      <div className="sticky top-24 space-y-6">
        {/* Categories Section */}
        <div className="bg-panel rounded-xl border border-border p-4">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            📂 Categorie
          </h3>
          <nav className="space-y-1">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/cam/${category.slug}`}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
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
          <nav className="space-y-1 max-h-64 overflow-y-auto">
            {countries.map((country) => (
              <Link
                key={country.slug}
                to={`/cam/${country.slug}`}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  currentPath === `/cam/${country.slug}`
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
          <nav className="space-y-1">
            <Link
              to="/live"
              className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                currentPath === '/live'
                  ? 'bg-accent/20 text-accent'
                  : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-white'
              }`}
            >
              📺 Tutte le Live
            </Link>
            <Link
              to="/"
              className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
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
