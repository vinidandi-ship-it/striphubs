import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ initialValue = '', compact = false }: { initialValue?: string; compact?: boolean }) {
  const [query, setQuery] = useState(initialValue);
  const navigate = useNavigate();

  useEffect(() => setQuery(initialValue), [initialValue]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form onSubmit={submit} className={`flex items-center gap-2 ${compact ? 'w-full' : 'w-full'}`}>
      <div className="relative flex-1">
        <input
          aria-label="Search models"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 Cerca modelle, tag, paesi..."
          className="h-11 w-full rounded-xl border border-border bg-zinc-900/80 px-4 pl-10 text-sm text-white outline-none focus:ring-2 focus:ring-accent placeholder:text-zinc-500"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">🔍</span>
      </div>
      <button className="h-11 rounded-xl bg-gradient-to-r from-accent to-pink-500 px-5 text-sm font-semibold text-white hover:shadow-lg hover:shadow-accent/30 transition-all" type="submit">
        Cerca
      </button>
    </form>
  );
}
