import { Link, NavLink } from 'react-router-dom';
import SearchBar from './SearchBar';

export default function Header() {
  const items = [
    { to: '/', label: '🏠 Home' },
    { to: '/live', label: '🔴 Live' },
    { to: '/cam/milf', label: '📂 Categorie' }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/95 backdrop-blur-xl shadow-lg">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-white hover:scale-105 transition-transform">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-pink-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">SH</span>
          </div>
          <span>Strip<span className="text-accent">Hubs</span></span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-accent/20 text-accent border border-accent/30' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="w-full lg:w-auto lg:max-w-xs">
          <SearchBar compact />
        </div>
      </div>
    </header>
  );
}
