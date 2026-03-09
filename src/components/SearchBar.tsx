import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type SearchBarProps = {
  compact?: boolean;
  initialValue?: string;
};

export default function SearchBar({ compact = false, initialValue = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const navigate = useNavigate();

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form onSubmit={onSubmit} className={`flex items-center gap-2 ${compact ? 'w-full md:w-80' : 'w-full'}`}>
      <input
        className="h-10 w-full rounded-lg border border-border bg-zinc-900 px-3 text-sm text-white outline-none ring-accent focus:ring"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search models, tags, categories"
        aria-label="Search"
      />
      <button type="submit" className="h-10 rounded-lg bg-accent px-4 text-sm font-semibold text-white">
        Search
      </button>
    </form>
  );
}
