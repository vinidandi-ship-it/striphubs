import { Link, NavLink } from 'react-router-dom';
import SearchBar from './SearchBar';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Live', to: '/live' },
  { label: 'Categories', to: '/cam/milf' },
  { label: 'Tags', to: '/tag/featured' }
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-extrabold tracking-tight text-white">
          Strip<span className="text-accent">Hubs</span>
        </Link>

        <nav className="flex items-center gap-3 text-sm text-zinc-300">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 transition ${isActive ? 'bg-accent text-white' : 'hover:bg-zinc-800'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="w-full md:w-auto">
          <SearchBar compact />
        </div>
      </div>
    </header>
  );
}
