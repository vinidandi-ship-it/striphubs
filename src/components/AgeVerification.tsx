import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';

const KEY = 'striphubs_age_verified';

export default function AgeVerification() {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    setOpen(localStorage.getItem(KEY) !== 'true');
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" role="dialog" aria-modal="true" aria-label={t('ageVerification.title')}>
      <div className="w-full max-w-md rounded-2xl border border-border bg-panel p-6 text-center shadow-2xl">
        <h2 className="text-2xl font-bold text-white">{t('ageVerification.title')}</h2>
        <p className="mt-3 text-sm text-zinc-300">{t('ageVerification.description')}</p>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            onClick={() => {
              localStorage.setItem(KEY, 'true');
              setOpen(false);
            }}
            className="rounded-full bg-accent px-4 py-2 font-semibold text-white"
          >
            {t('ageVerification.confirm')}
          </button>
          <a href="https://www.google.com" className="rounded-full border border-border px-4 py-2 font-semibold text-zinc-200">{t('common.exit')}</a>
        </div>
      </div>
    </div>
  );
}
