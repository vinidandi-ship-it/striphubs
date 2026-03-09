import { Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n';

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="mt-16 border-t border-border bg-black/45">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-4 px-4 py-8 text-sm text-zinc-400 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <p>
          © {new Date().getFullYear()} StripHubs. {t('footerAdults')}
        </p>
        <div className="flex gap-4">
          <Link to="/privacy" className="hover:text-white">{t('footerPrivacy')}</Link>
          <Link to="/terms" className="hover:text-white">{t('footerTerms')}</Link>
          <Link to="/cookies" className="hover:text-white">{t('footerCookies')}</Link>
        </div>
      </div>
    </footer>
  );
}
