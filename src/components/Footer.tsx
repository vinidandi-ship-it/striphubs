import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-border bg-black/50">
      <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-4 px-4 py-8 text-sm text-zinc-400 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} StripHubs. Adults only (18+).</p>
        <div className="flex gap-4">
          <Link to="/privacy" className="hover:text-white">Privacy</Link>
          <Link to="/terms" className="hover:text-white">Terms</Link>
          <Link to="/cookies" className="hover:text-white">Cookies</Link>
        </div>
      </div>
    </footer>
  );
}
