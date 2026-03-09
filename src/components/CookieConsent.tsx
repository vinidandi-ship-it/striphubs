import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n';

const STORAGE_KEY = 'striphubs_cookie_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    setVisible(consent !== 'accepted');
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="glass fixed bottom-4 left-4 right-4 z-[90] rounded-2xl border border-border p-4 shadow-xl sm:left-auto sm:w-[460px]">
      <p className="text-sm text-zinc-300">
        {t('cookieText')}{' '}
        <Link to="/cookies" className="text-accent underline">{t('cookiePolicy')}</Link>.
      </p>
      <button onClick={accept} className="mt-3 rounded-full bg-accent px-4 py-2 text-sm font-bold text-white">{t('cookieAccept')}</button>
    </div>
  );
}
