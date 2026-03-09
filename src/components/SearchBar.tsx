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
    <form onSubmit={submit} className={`flex items-center gap-2 ${compact ? 'w-full md:w-80' : 'w-full'}`}>
      <input
        aria-label="Search models"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search models, tags, countries"
        className="h-11 w-full rounded-full border border-border bg-zinc-900 px-4 text-sm text-white outline-none focus:ring-2 focus:ring-accent"
      />
      <button className="h-11 rounded-full bg-accent px-5 text-sm font-semibold text-white" type="submit">Search</button>
    </form>
  );
}
