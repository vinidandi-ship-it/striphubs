import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { buildLocalizedPath } from '../i18n/routing';
import { LanguageSwitcher } from '../i18n/LanguageSwitcher';

export default function Footer() {
  const { t, locale } = useI18n();

  return (
    <footer className="mt-12 border-t border-border bg-gradient-to-b from-transparent to-black/50">
      <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-6 px-4 py-8 text-center text-sm text-zinc-400 sm:px-6 lg:flex-row lg:items-center lg:px-8 lg:text-left">
        <div>
          <p className="text-lg font-bold text-white mb-2">Strip<span className="text-accent">Hubs</span></p>
          <p>© {new Date().getFullYear()} StripHubs. {t('footer.allRightsReserved')}</p>
          <p className="text-xs text-zinc-500 mt-1">{t('footer.adultsOnly')}</p>
        </div>
        <div className="flex flex-col gap-4 lg:text-right">
          <div className="flex flex-wrap justify-center gap-4 lg:justify-end">
            <Link to={buildLocalizedPath('/privacy', locale)} className="hover:text-accent transition-colors">{t('footer.privacy')}</Link>
            <Link to={buildLocalizedPath('/terms', locale)} className="hover:text-accent transition-colors">{t('footer.terms')}</Link>
            <Link to={buildLocalizedPath('/cookies', locale)} className="hover:text-accent transition-colors">{t('footer.cookies')}</Link>
          </div>
          <div className="flex justify-center lg:justify-end items-center gap-4">
            <LanguageSwitcher compact />
            <p className="text-xs text-zinc-500">{t('footer.notAffiliated')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
