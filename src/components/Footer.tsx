import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-border bg-gradient-to-b from-transparent to-black/50">
      <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-6 px-4 py-8 text-center text-sm text-zinc-400 sm:px-6 lg:flex-row lg:items-center lg:px-8 lg:text-left">
        <div>
          <p className="text-lg font-bold text-white mb-2">Strip<span className="text-accent">Hubs</span></p>
          <p>© {new Date().getFullYear()} StripHubs. Tutti i diritti riservati.</p>
          <p className="text-xs text-zinc-500 mt-1">Adulti only (18+). Contenuti per adulti.</p>
        </div>
        <div className="flex flex-col gap-2 lg:text-right">
          <div className="flex flex-wrap justify-center gap-4 lg:justify-end">
            <Link to="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-accent transition-colors">Termini</Link>
            <Link to="/cookies" className="hover:text-accent transition-colors">Cookies</Link>
          </div>
          <p className="text-xs text-zinc-500">StripHubs non è affiliato a Stripchat</p>
        </div>
      </div>
    </footer>
  );
}
