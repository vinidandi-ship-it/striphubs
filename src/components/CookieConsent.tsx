import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { buildLocalizedPath } from '../i18n/routing';

const KEY = 'striphubs_cookie_consent';

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const { t, locale } = useI18n();

  useEffect(() => {
    setShow(localStorage.getItem(KEY) !== 'accepted');
  }, []);

  if (!show) return null;

  return (
    <aside className="fixed bottom-4 left-4 right-4 z-50 rounded-2xl border border-border bg-panel p-4 shadow-xl sm:left-auto sm:w-[430px]" aria-label="Cookie consent">
      <p className="text-sm text-zinc-300">
        {t('cookieConsent.message')}{' '}
        <Link className="text-accent underline" to={buildLocalizedPath('/cookies', locale)}>{t('cookieConsent.policy')}</Link>.
      </p>
      <button
        onClick={() => {
          localStorage.setItem(KEY, 'accepted');
          setShow(false);
        }}
        className="mt-3 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white"
      >
        {t('common.accept')}
      </button>
    </aside>
  );
}
