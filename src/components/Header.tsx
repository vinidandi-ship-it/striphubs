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
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center justify-between gap-3">
        <Link to="/" className="flex min-w-0 items-center gap-2 text-lg font-extrabold text-white transition-transform hover:scale-105 sm:text-xl">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-pink-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">SH</span>
          </div>
          <span className="truncate">Strip<span className="text-accent">Hubs</span></span>
        </Link>
        </div>
        <nav className="-mx-1 flex items-center gap-1 overflow-x-auto px-1 pb-1 text-sm lg:mx-0 lg:px-0 lg:pb-0">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `shrink-0 whitespace-nowrap rounded-xl px-3 py-2 transition-all sm:px-4 ${
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
        <div className="w-full lg:max-w-xs">
          <SearchBar compact />
        </div>
      </div>
    </header>
  );
}
