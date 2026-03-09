import { Link, NavLink } from 'react-router-dom';
import SearchBar from './SearchBar';

export default function Header() {
  const items = [
    { to: '/', label: 'Home' },
    { to: '/live', label: 'Live' },
    { to: '/cam/milf', label: 'Categories' }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-white">
          <img src="/logo.svg" alt="StripHubs logo" className="h-8 w-auto" />
          <span className="hidden sm:inline">Strip<span className="text-accent">Hubs</span></span>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 ${isActive ? 'bg-accent text-white' : 'bg-zinc-900 text-zinc-300 hover:text-white'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="w-full lg:w-auto">
          <SearchBar compact />
        </div>
      </div>
    </header>
  );
}
