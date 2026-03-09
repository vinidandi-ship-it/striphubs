import { useEffect, useState } from 'react';
import { useI18n } from '../lib/i18n';

const STORAGE_KEY = 'striphubs_age_verified';

export default function AgeVerification() {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

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
      <div className="glass w-full max-w-md rounded-2xl border border-border p-6 text-center card-glow">
        <h2 className="mb-3 text-2xl font-bold">{t('ageTitle')}</h2>
        <p className="mb-6 text-sm text-zinc-300">{t('ageText')}</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button onClick={accept} className="rounded-full bg-accent px-4 py-2 font-semibold text-white">{t('ageAccept')}</button>
          <a href="https://www.google.com" className="rounded-full border border-border px-4 py-2 font-semibold text-zinc-200">{t('ageExit')}</a>
        </div>
      </div>
    </div>
  );
}
