import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { buildLocalizedPath } from '../i18n/routing';
import { LanguageSwitcher } from '../i18n/LanguageSwitcher';
import { getClickStats, trackAffiliateClick } from '../lib/affiliateTracking';
import { getAffiliateUrlWithProvider } from '../lib/affiliateProviders';
import { isPremiumUser } from '../lib/revenue';
import Icon from './Icon';

export default function Footer() {
  const { t, locale } = useI18n();
  const stats = getClickStats();
  
  const handleFooterCta = () => {
    let history: Array<{ username?: string; category?: string; country?: string; viewers?: number }> = [];
    try {
      history = JSON.parse(localStorage.getItem('sh_click_history') || '[]');
    } catch {
      history = [];
    }
    const lastModel = history[history.length - 1];
    
    if (lastModel?.username) {
      const { url, provider } = getAffiliateUrlWithProvider(lastModel.username);
      trackAffiliateClick(lastModel.username, 'footer_cta', {
        category: lastModel.category,
        country: lastModel.country,
        viewers: lastModel.viewers,
        provider
      });
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      trackAffiliateClick('homepage', 'footer_cta', { provider: 'stripchat' });
      window.open('https://go.mavrtracktor.com?userId=d28a8a923e19b6fd3ed0c160238cdfed71b13f759191c9457b28797b81780881', '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <footer className="mt-12 border-t border-border bg-gradient-to-b from-transparent to-black/50">
      <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-6 px-4 py-8 text-center text-sm text-zinc-400 sm:px-6 lg:flex-row lg:items-center lg:px-8 lg:text-left">
        <div>
          <p className="text-lg font-bold text-white mb-2">Strip<span className="text-accent">Hubs</span></p>
          <p>© {new Date().getFullYear()} StripHubs. {t('footer.allRightsReserved')}</p>
          <p className="text-xs text-zinc-500 mt-1">{t('footer.adultsOnly')}</p>
        </div>
        
        {!isPremiumUser() && stats.todayClicks > 0 && (
          <div 
            onClick={handleFooterCta}
            className="hidden lg:flex items-center gap-3 bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 border border-accent-primary/30 rounded-xl px-4 py-3 cursor-pointer hover:border-accent-primary transition-colors"
          >
            <div className="w-10 h-10 bg-accent-primary/20 rounded-lg flex items-center justify-center">
              <Icon name="play" size={18} className="text-accent-primary" />
            </div>
            <div className="text-left">
              <p className="text-white font-semibold text-sm">Continua a guardare</p>
              <p className="text-xs text-zinc-400">{stats.todayClicks} sessioni oggi</p>
            </div>
            <Icon name="arrowRight" size={16} className="text-accent-primary ml-2" />
          </div>
        )}
        
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
