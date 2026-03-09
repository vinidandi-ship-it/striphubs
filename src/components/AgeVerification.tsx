import { useEffect, useState } from 'react';

const STORAGE_KEY = 'striphubs_age_verified';

export default function AgeVerification() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem(STORAGE_KEY);
    setOpen(verified !== 'true');
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-panel p-6 text-center">
        <h2 className="mb-3 text-2xl font-bold">Age Verification</h2>
        <p className="mb-6 text-sm text-zinc-300">You must be 18 or older to access this website.</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button onClick={accept} className="rounded-lg bg-accent px-4 py-2 font-semibold text-white">I am 18+</button>
          <a href="https://www.google.com" className="rounded-lg border border-border px-4 py-2 font-semibold text-zinc-200">Exit</a>
        </div>
      </div>
    </div>
  );
}
